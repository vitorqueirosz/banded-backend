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
  return userChats?.map(({ users = [], messages = [], chatId }, index) => {
    let userNotExists: any;

    const [user] = users;
    const lastMessage = messages[messages.length - 1];

    if (!user) {
      userNotExists = userChats[index];
    }

    return {
      id: user?.id ?? userNotExists?._id,
      name: user?.name ?? userNotExists?.name,
      avatar: user?.avatar ?? userNotExists?.avatar,
      chatId,
      lastMessage: lastMessage && {
        id: lastMessage.id,
        text: lastMessage.text,
        createdAt: lastMessage.createdAt,
        isReceived: String(lastMessage.userReceivingId) === userLoggedId,
      },
    };
  });
};
