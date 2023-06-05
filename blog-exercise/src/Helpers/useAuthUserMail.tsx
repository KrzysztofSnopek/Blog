import { useContext } from "react";
import { AuthStoreContext, useAuthStore } from "../Components/Auth/AuthStore";

export const useAuthUserMail = () => {
  const AuthStore = useAuthStore();
  AuthStore.getCurrentUser?.();
  console.log("hook", AuthStore.currUser);
  const currUserMail: string = AuthStore.currUser?.email || "No current user";

  return currUserMail;
};
