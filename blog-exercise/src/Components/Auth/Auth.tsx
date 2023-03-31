import { useContext } from "react";
import { AuthStoreContext } from "./AuthStore";

export const Auth = () => {
  const AuthStore = useContext(AuthStoreContext);

  return (
    <div className="p-2 m-2 bg-pattern-signUp h-screen">
      <div>
        <p>Sign in with Google to continue.</p>
        <button onClick={AuthStore.signInWithGoogleAccount}>Sign in</button>
      </div>
    </div>
  );
};
