import { UserModel } from '@src/models/User';

export const checkIsTheSameUser = (
  userChats: UserModel[],
  userLoggedId: string,
): UserModel[] => {
  const usersWithoutUserLoggedIn = userChats.filter(
    user => user.id !== userLoggedId,
  );

  return usersWithoutUserLoggedIn;
};
