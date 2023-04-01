import { useContext } from "react";
import { AuthStoreContext } from "./AuthStore";

export const Auth = () => {
  const AuthStore = useContext(AuthStoreContext);

  return (
    <div>
      <p>Sign in with Google to continue.</p>
      <button onClick={AuthStore.signInWithGoogleAccount}>Sign in</button>
    </div>
  );
};
