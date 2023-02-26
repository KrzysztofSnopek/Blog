import { signInWithPopup, signOut } from "firebase/auth";
import { makeAutoObservable } from "mobx";
import React, { useContext, useRef } from "react";
import Cookies from "universal-cookie";
import { auth, provider } from "../../firebase";

export default class AuthStore {
  constructor() {
    makeAutoObservable(this);
  }
  cookie: Cookies = new Cookies();
  isAuth: boolean = !!this.cookie.get("auth-token");

  setIsAuth = (isAuth: boolean) => {
    this.isAuth = isAuth;
  };

  signInWithGoogleAccount = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      this.cookie.set("auth-token", result.user.refreshToken, {
        sameSite: "lax",
      });
      this.setIsAuth(true);
    } catch (error) {
      console.log(error);
    }
  };

  signUserOut = async () => {
    await signOut(auth);
    this.cookie.remove("auth-token");
    this.setIsAuth(false);
  };
}

export const AuthStoreContext = React.createContext<Partial<AuthStore>>({});

export const useAuthStore = () => useContext(AuthStoreContext);

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthStoreProvider({ children }: AuthProviderProps) {
  const store = useRef(new AuthStore());

  return (
    <AuthStoreContext.Provider value={store.current}>
      {children}
    </AuthStoreContext.Provider>
  );
}
