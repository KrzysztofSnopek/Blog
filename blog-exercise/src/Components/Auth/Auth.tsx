import { useAuthStore } from "./AuthStore";

export const Auth = () => {
  const AuthStore = useAuthStore();

  return (
    <div className="bg-pattern-main h-screen bg-cover bg-blend-multiply bg-blue-100">
      <div className="flex justify-center items-center min-h-screen flex-col">
        <div className="h-1/2 bg-blue-500 flex justify-center bg-opacity-60 backdrop-blur-md md:rounded-2xl md:drop-shadow-lg md:z-10 max-md:w-full md:w-auto">
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-50 to-blue-200 md:px-16 py-10 font-extrabold text-4xl md:w-fit max-md:py-6">
            ShowYourPicture
          </p>
        </div>

        <div className="h-1/2 bg-blue-500 flex flex-col bg-opacity-60 backdrop-blur-md md:rounded-2xl drop-shadow-lg md:relative md:p-6 md:pt-16 md:pb-6 md:-top-10 md:left-16 max-md:w-full md:w-auto">
          <button
            className="text-blue-100 text-center font-extrabold text-2xl outline-2 outline-offset-1 outline px-12 py-4 mx-20 rounded-md hover:text-blue-500 hover:bg-blue-100"
            onClick={AuthStore.signInWithGoogleAccount}
          >
            Sign in
          </button>
          <p className="text-blue-100 text-center font-thin p-4 max-md:pb-6">
            Sign in with Google to continue.
          </p>
        </div>
      </div>
    </div>
  );
};
