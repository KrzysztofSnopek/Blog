import { useContext } from "react";
import { AuthStoreContext } from "./AuthStore";

export const Auth = () => {
  const AuthStore = useContext(AuthStoreContext);

  return (
    <div className="bg-pattern-main h-screen bg-cover">
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-1/4 h-1/2 bg-slate-50 flex flex-col bg-opacity-20 backdrop-blur-md rounded-md drop-shadow-sm">
          <p className="text-orange-200 p-6 pt-16 text-center">
            Sign in with Google to continue.
          </p>
          <button
            className="text-orange-100 p-6 pb-16 text-center"
            onClick={AuthStore.signInWithGoogleAccount}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};
