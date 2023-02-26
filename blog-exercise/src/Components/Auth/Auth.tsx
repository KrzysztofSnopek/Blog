import { auth, provider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";
import { useContext } from "react";
import { AuthStoreContext } from "./AuthStore";

export const Auth = () => {
  const AuthStore = useContext(AuthStoreContext);
  const cookies = AuthStore.cookie;

  const signInWithGoogleAccount = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      cookies?.set("auth-token", result.user.refreshToken);
      AuthStore.setIsAuth && AuthStore.setIsAuth(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <p>Sign in with Google to continue.</p>
      <button onClick={signInWithGoogleAccount}>Sign in</button>
    </div>
  );
};
