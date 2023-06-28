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
    }
  };

  const removeSelectedImage = () => {
    setPicturePreview(undefined);
  };

  return (
    <div className="w-9/12 m-auto">
      <div className="h-auto flex items-center flex-col">
        <h1 className="font-bold p-2">Share your pictures with others here!</h1>

        <form
          onSubmit={handleImageUpload}
          className="min-w-full bg-orange-300 flex p-4 justify-between"
        >
          <input
            type="file"
            id="photo-picker"
            className="p-4"
            onChange={(e) => {
              handlePictureChange(e);
              // convert it to base64
              setFileBase64(convertFile(e.target.files));
            }}
          />
          <input
            className="p-4"
            type="text"
            placeholder="Add picture name"
            id="photo-name"
            onChange={(e) => setPictureName(e.target.value)}
          />
          <button type="submit" className="p-4">
            Share your picture!
          </button>
        </form>

        {picturePreview && (
          <div className="h-1/4 max-w-screen-sm p-12">
            <img
              className="max-h-full"
              src={URL.createObjectURL(picturePreview)}
              alt="Thumb"
            />
            <button
              onClick={removeSelectedImage}
              className="bg-orange-300 w-full p-4 font-bold"
            >
              Close the image preview
            </button>
          </div>
        )}
      </div>
    </div>
  );
});
