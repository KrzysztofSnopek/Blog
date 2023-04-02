import { useContext } from "react";
import { AuthStoreContext } from "./AuthStore";

export const Auth = () => {
  const AuthStore = useContext(AuthStoreContext);

  return (
    <div className="bg-pattern-main h-screen bg-cover bg-blend-multiply bg-slate-500">
      <div className="flex justify-center items-center min-h-screen flex-col">
        <div className="w-1/4 h-1/2 bg-slate-50 flex justify-center bg-opacity-20 backdrop-blur-md rounded-2xl drop-shadow-lg z-10 ">
          <p className="text-orange-200 p-6 py-10 font-extrabold text-4xl">
            ShowYourPicture
          </p>
        </div>

        <div className="w-1/4 h-1/2 bg-slate-50 flex flex-col bg-opacity-20 backdrop-blur-md rounded-2xl drop-shadow-lg relative -top-10 left-16">
          <button
            className="text-orange-200 p-6 pt-16 text-center font-extrabold text-4xl"
            onClick={AuthStore.signInWithGoogleAccount}
          >
            Sign in
          </button>
          <p className="text-orange-200 p-6 pb-16 text-center font-thin">
            Sign in with Google to continue.
          </p>
        </div>
      </div>
    </div>
  );
};
