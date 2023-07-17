import { useState } from "react";
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
  const userName = auth.currentUser?.displayName ?? "";
  const storagePathElement = userName + "_" + v4();
  const [picturePreview, setPicturePreview] = useState();

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
      alert("uploaded to the storage");
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

  return (
    <div className="flex justify-center bg-blue-50 min-h-[calc(100vh-5rem)] font-body">
      <div className="flex items-center flex-col pt-10 w-1/2">
        <h1 className="font-bold p-2 w-full bg-blue-300 text-center">
          Share your pictures with others here!
        </h1>
        <div className="w-full">
          <form
            onSubmit={handleImageUpload}
            className="bg-blue-300 flex p-4 justify-between"
          >
            <input
              type="file"
              id="photo-picker"
              className="p-4"
              onChange={(e) => {
                handlePictureChange(e);
              }}
            />
            <input
              className="p-4"
              type="text"
              placeholder="Add picture name"
              id="photo-name"
              onChange={(e) => setPictureName(e.target.value)}
            />
            <button type="submit" className="p-4 bg-blue-200">
              Share your picture!
            </button>
          </form>
        </div>

        {picturePreview && (
          <>
            <div className="bg-blue-200 flex flex-col w-full items-center">
              <div>
                <img
                  src={URL.createObjectURL(picturePreview)}
                  alt="Thumb"
                  className="max-h-[60vh] w-auto"
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
