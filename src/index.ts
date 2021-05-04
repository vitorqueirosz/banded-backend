import { Server } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { Message } from './models/Message';
import { Chat } from './models/Chat';
import { User } from './models/User';
import { SetupServer } from './server';

type MessageData = {
  chatId: string;
  userId: string;
  text: string;
};

type UserConnected = {
  chatId: string;
  userId: string;
};

const usersConnected: UserConnected[] = [];

export const socketInstance = (
  io: Server<DefaultEventsMap, DefaultEventsMap>,
): void => {
  const getOnlineUsers = () => {
    const { sockets } = io.of('/');
    const values = Object.fromEntries(sockets);

    return Object.values(values).forEach(socket => {
      const userId = socket.handshake.query.userLoggedId;

      const userConnectedPayload = {
        chatId: socket.id,
        userId: String(userId),
      };

      const hasUser = usersConnected.findIndex(user => user.userId === userId);

      if (hasUser !== -1) {
        usersConnected.splice(hasUser, 1);
      }

      usersConnected.push(userConnectedPayload);
    });
  };

  io.use((socket: any, next) => {
    if (socket.handshake.query && socket.handshake.query.userLoggedId) {
      const { userLoggedId } = socket.handshake.query;
      socket.user = userLoggedId;

      return next();
    }

    return undefined;
  }).on('connection', async (socket: any) => {
    const userLoggedId = socket.user;
    getOnlineUsers();

    socket.on('sended-message', async (data: MessageData) => {
      const payloadMessage = {
        ...data,
        userId: userLoggedId,
      };

      const userTargedId = data.chatId;

      const userOnSocket = usersConnected.find(
        user => user.userId === userTargedId,
      );

      if (!userOnSocket) return;

      const { chatId } = userOnSocket;

      const message = await Message.create({
        user: userLoggedId,
        chatId: userTargedId,
        text: data.text,
      });

      const hasChatByUser = await Chat.findOne({
        user: userLoggedId,
        chatId: userTargedId,
      });

      if (hasChatByUser) {
        await Chat.findOneAndUpdate(
          {
            user: userLoggedId,
            chatId: userTargedId,
          },
          {
            $push: { messages: message._id },
          },
        );
      }

      const hasChatByChatId = await Chat.findOne({
        user: userTargedId,
        chatId: userLoggedId,
      });

      if (hasChatByChatId) {
        await Chat.findOneAndUpdate(
          {
            user: userTargedId,
            chatId: userLoggedId,
          },
          {
            $push: { messages: message._id },
          },
        );
      }

      if (!hasChatByUser && !hasChatByChatId) {
        await Chat.create({
          user: userLoggedId,
          chatId: userTargedId,
          message: message._id,
        });
      }

      io.to(chatId).emit('new-message', payloadMessage);
    });

    socket.on('join-private-channel', async (chatId: string) => {
      const { _id, name, avatar } = await User.findOne({ _id: chatId });
      const userJoinnedPayload = {
        id: _id,
        name,
        avatar,
      };

      const messages = await Message.find({ user: userLoggedId, chatId });

      socket.emit('joinned-private-channel', {
        user: userJoinnedPayload,
        messages,
      });
    });
  });
};

(async () => {
  const server = new SetupServer(process.env.APP_PORT);
  await server.init();
  const { io } = server.start();

  socketInstance(io);
})();
