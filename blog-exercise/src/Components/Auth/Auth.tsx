import { auth, provider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";
import Cookies from "universal-cookie";

interface Props {
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Auth = (props: Props) => {
  const cookies = new Cookies();

  const signInWithGoogleAccount = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      cookies.set("auth-token", result.user.refreshToken);
      props.setIsAuth(true);
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
