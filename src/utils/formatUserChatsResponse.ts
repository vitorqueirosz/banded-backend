import { UserChat } from '@src/controllers/UserChatsController';

type UserChatsFormattedResponse = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: {
    id: string;
    text: string;
    createdAt: string;
    isReceived: boolean;
  };
}[];

export const formattedUserChats = (
  userChats: UserChat[],
  userLoggedId: string,
): UserChatsFormattedResponse => {
  return userChats.map(({ users, messages }) => {
    const [user] = users;
    const lastMessage = messages[messages.length - 1];

    return {
      id: user.id,
      name: user.name,
      avatar: user?.avatar,
      lastMessage: {
        id: lastMessage.id,
        text: lastMessage.text,
        createdAt: lastMessage.createdAt,
        isReceived: String(lastMessage.userReceivingId) === userLoggedId,
      },
    };
  });
};
