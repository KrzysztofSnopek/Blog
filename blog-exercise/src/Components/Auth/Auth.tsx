import { useContext } from "react";
import { AuthStoreContext } from "./AuthStore";

export const Auth = () => {
  const AuthStore = useContext(AuthStoreContext);

  return (
    <div className="bg-pattern-main h-screen bg-cover bg-blend-multiply bg-slate-500">
      <div className="flex justify-center items-center min-h-screen flex-col">
        <div className="h-1/2 bg-orange-500 flex justify-center bg-opacity-20 backdrop-blur-md md:rounded-2xl md:drop-shadow-lg md:z-10 max-md:w-full md:w-auto">
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-100 md:px-16 py-10 font-extrabold text-4xl md:w-fit max-md:py-6">
            ShowYourPicture
          </p>
        </div>

        <div className="h-1/2 bg-orange-500 flex flex-col bg-opacity-20 backdrop-blur-md md:rounded-2xl drop-shadow-lg md:relative md:p-6 md:pt-16 md:pb-10 md:-top-10 md:left-16 max-md:w-full md:w-auto">
          <button
            className="text-orange-200 text-center font-extrabold text-4xl outline-2 outline-offset-1 outline px-16 py-2 mx-16 rounded-md hover:brightness-75 hover:shadow-inner"
            onClick={AuthStore.signInWithGoogleAccount}
          >
            Sign in
          </button>
          <p className="text-orange-200 text-center font-thin p-4 max-md:pb-6">
            Sign in with Google to continue.
          </p>
        </div>
      </div>
    </div>
  );
};
