import { useContext } from "react";
import { AuthStoreContext } from "./AuthStore";

export const Auth = () => {
  const AuthStore = useContext(AuthStoreContext);

  return (
    <div className="bg-pattern-main">
      <div className="flex justify-center h-screen">
        <p>Sign in with Google to continue.</p>
        <button className="" onClick={AuthStore.signInWithGoogleAccount}>
          Sign in
        </button>
      </div>
    </div>
  );
};
