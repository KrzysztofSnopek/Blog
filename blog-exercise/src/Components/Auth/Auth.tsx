import { auth, provider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";
import Cookies from "universal-cookie";
import { useContext } from "react";
import { AuthStoreContext } from "./AuthStore";

// interface Props {
//   setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
// }

export const Auth = () => {
  const AuthStore = useContext(AuthStoreContext);
  console.log("Authstore z Auth.tsx: ", AuthStore.isAuth);
  // AuthStore.cookies;
  const cookies = AuthStore.cookie;
  // console.log(AuthStore.isAuth);
  const signInWithGoogleAccount = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      cookies?.set("auth-token", result.user.refreshToken);
      AuthStore.setIsAuth && AuthStore.setIsAuth(true);
      console.log(AuthStore.setIsAuth && AuthStore.setIsAuth(true));
      // console.log(cookies);
      // console.log(AuthStore.isAuth);
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
