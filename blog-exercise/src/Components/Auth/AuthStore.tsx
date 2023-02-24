import { makeAutoObservable } from "mobx";
import React, { useContext, Dispatch, SetStateAction, useRef } from "react";
import Cookies from "universal-cookie";

export default class AuthStore {
  constructor() {
    makeAutoObservable(this);
  }
  cookie: Cookies = new Cookies();
  isAuth: boolean = !!this.cookie.get("auth-token");
  setIsAuth = (isAuth: boolean) => {
    this.isAuth = isAuth;
  };
  //   setIsAuth: Dispatch<SetStateAction<boolean>>
}

export const AuthStoreContext = React.createContext<Partial<AuthStore>>(
  //   null as unknown as AuthStore
  {}
);

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
