import { useAuthStore } from "../Components/Auth/AuthStore";

export const useAuthUserMail = () => {
  const AuthStore = useAuthStore();
  AuthStore.getCurrentUser?.();
  const currUserMail: string = AuthStore.currUser?.email || "No current user";

  return currUserMail;
};
