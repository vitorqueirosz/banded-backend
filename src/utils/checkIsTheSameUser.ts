import { UserModel } from '@src/models/User';

export const checkIsTheSameUser = (
  userChats: UserModel[],
  userLoggedId: string,
): UserModel[] => {
  const checkHasSameUser = userChats.findIndex(
    user => user.id === userLoggedId,
  );

  if (checkHasSameUser !== -1) {
    userChats.splice(checkHasSameUser, 1);
  }

  return userChats;
};
