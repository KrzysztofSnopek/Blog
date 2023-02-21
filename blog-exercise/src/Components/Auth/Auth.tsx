import { auth, provider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";

export const Auth = () => {
  const SignInWithGoogle = async () => {
    await signInWithPopup(auth, provider);
  };

  return (
    <div>
      <p>Sign in with Google to continue.</p>
      <button onClick={SignInWithGoogle}>Sign in</button>
    </div>
  );
};
