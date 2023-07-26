import { useEffect, useState } from "react";
import { storage } from "../../firebase";
import { ref, uploadString } from "firebase/storage";
import { auth } from "../../firebase";
import { serverTimestamp } from "@firebase/firestore";
import { observer } from "mobx-react";
import { v4 } from "uuid";
import { convertFile } from "../../Helpers/utils";

export const AddPicture = observer(() => {
  const [filebase64, setFileBase64] = useState<string>("");
  const [pictureName, setPictureName] = useState<string>("");
  const userName = auth.currentUser?.email ?? "";
  const storagePathElement = userName + "_" + v4();
  const [picturePreview, setPicturePreview] = useState();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleImageUpload = async (e: any) => {
    e.preventDefault();

    if (filebase64 === "") return;

    const imageRef = ref(storage, `projectFiles/${storagePathElement}`);

    const metadata = {
      timeCreated: serverTimestamp(),
      customMetadata: {
        createdBy: userName,
        imageName: pictureName,
        storagePathElement: storagePathElement,
        likeCount: "0",
      },
    };

    await uploadString(imageRef, filebase64, "base64", metadata).then(() => {
      setShowSuccessMessage(true);
    });
  };

  const handlePictureChange = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      setPicturePreview(e.target.files[0]);
      // convert it to base64
      convertFile(e.target.files)
        .then((base64String) => setFileBase64(base64String))
        .catch((e) => console.error(e));
    }
  };

  const removeSelectedImage = () => {
    setPicturePreview(undefined);
  };

  useEffect(() => {
    if (showSuccessMessage) {
      const timeout = setTimeout(() => {
        setShowSuccessMessage(false);
        setPicturePreview(undefined);
        setPictureName("");
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [showSuccessMessage]);

  return (
    <div className="flex justify-center bg-blue-50 min-h-[calc(100vh-5rem)] font-body">
      <div className="flex items-center flex-col pt-10 w-1/2 max-lg:w-full">
        <h1 className="font-bold text-xl pt-6 w-full bg-blue-200 text-center">
          Share your pictures with others here!
        </h1>
        <div className="w-full">
          <form
            onSubmit={handleImageUpload}
            className="bg-blue-200 flex p-8 justify-between"
          >
            <label
              htmlFor="photo-picker"
              className="bg-blue-300 relative p-4 font-bold hover:text-slate-950 before:absolute before:-z-10 before:bottom-0 before:left-[50%] before:w-0 before:h-0 before:bg-blue-400 hover:before:animate-fillNav hover:opacity-90 hover:cursor-pointer"
            >
              Select a file
            </label>
            <input
              type="file"
              id="photo-picker"
              className="hidden"
              onChange={(e) => {
                handlePictureChange(e);
              }}
            />
            <div>
              <input
                className="p-4"
                type="text"
                minLength={3}
                maxLength={25}
                placeholder="Add picture name"
                id="photo-name"
                value={pictureName}
                onChange={(e) => setPictureName(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-300 relative p-4 font-bold hover:text-slate-950 before:absolute before:-z-10 before:bottom-0 before:left-[50%] before:w-0 before:h-0 before:bg-blue-400 hover:before:animate-fillNav hover:opacity-90"
              >
                Share your picture!
              </button>
            </div>
          </form>
          {showSuccessMessage && (
            <div className="p-4 pt-0 bg-blue-200 text-green-500 font-bold text-lg text-center">
              Picture uploaded successfully!
            </div>
          )}
        </div>

        {picturePreview && (
          <>
            <div className="bg-blue-200 flex flex-col w-full items-center">
              <div>
                <img
                  src={URL.createObjectURL(picturePreview)}
                  alt="Thumb"
                  className="max-h-[50vh] w-auto mb-6"
                />
              </div>
            </div>
            <button
              onClick={removeSelectedImage}
              className="bg-blue-300 w-full p-4 font-bold"
            >
              Close the image preview
            </button>
          </>
        )}
      </div>
    </div>
  );
});
