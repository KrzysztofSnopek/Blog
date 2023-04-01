import { useContext } from "react";
import { AuthStoreContext } from "./AuthStore";

export const Auth = () => {
  const AuthStore = useContext(AuthStoreContext);

  return (
    <div className="bg-pattern-main h-screen">
      <div className="flex justify-center ">
        <p>Sign in with Google to continue.</p>
        <button
          className="text-orange-100"
          onClick={AuthStore.signInWithGoogleAccount}
        >
          Sign in
        </button>
      </div>
    </div>
  );
};
