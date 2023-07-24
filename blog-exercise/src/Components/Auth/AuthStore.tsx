import { User, signInWithPopup, signOut } from "firebase/auth";
import { makeAutoObservable } from "mobx";
import React, { useContext, useState } from "react";
import Cookies from "universal-cookie";
import { auth, provider } from "../../firebase";

export default class AuthStore {
  constructor() {
    makeAutoObservable(this);
  }
  cookie: Cookies = new Cookies();
  isAuth: boolean = !!this.cookie.get("auth-token");
  currUser: User | null = null;
  currentUserMail: string =
    window.localStorage.getItem("user") ?? "no current user";
  getCurrentUser = () => {
    this.currUser = auth.currentUser;
  };

  setIsAuth = (isAuth: boolean) => {
    this.isAuth = isAuth;
  };

  signInWithGoogleAccount = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      this.cookie.set("auth-token", result.user.refreshToken, {
        sameSite: "lax",
      });
      this.currUser = auth.currentUser;
      this.setIsAuth(true);
      window.localStorage.setItem("user", JSON.stringify(this.currUser?.email));
    } catch (error) {
      console.log(error);
    }
  };

  signUserOut = async () => {
    await signOut(auth);
    this.cookie.remove("auth-token");
    this.setIsAuth(false);
    window.localStorage.removeItem("user");
  };
}

type AuthStoreContextValue = AuthStore;
export const AuthStoreContext =
  React.createContext<AuthStoreContextValue | null>(null);

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthStoreContextProvider({ children }: AuthProviderProps) {
  const [store] = useState(() => new AuthStore());

  return (
    <AuthStoreContext.Provider value={store}>
      {children}
    </AuthStoreContext.Provider>
  );
}

export function useAuthStore(): AuthStoreContextValue {
  const contextValue = useContext(AuthStoreContext);
  if (contextValue === null) {
    throw new Error(
      "useAuthStore must be used within AuthStoreContextProvider"
    );
  }
  return contextValue;
}
