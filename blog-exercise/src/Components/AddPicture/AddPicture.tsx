import { useEffect, useState } from "react";
import { storage } from "../../firebase";
import { ref, uploadString } from "firebase/storage";
import { auth, db } from "../../firebase";
import { serverTimestamp } from "@firebase/firestore";
import { observer } from "mobx-react";
import { v4 } from "uuid";

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

  const convertFile = (files: FileList | null): void => {
    if (files) {
      const fileRef = files[0] || "";
      const fileType: string = fileRef.type || "";
      const reader = new FileReader();
      reader.readAsBinaryString(fileRef);
      reader.onload = (e: any) => {
        // convert it to base64
        setFileBase64(`${btoa(e.target.result)}`);
      };
    }
  };

  const removeSelectedImage = () => {
    setPicturePreview(undefined);
  };

  return (
    <div>
      <h1 className="font-bold p-2">Share your pictures with others here!</h1>

      <form onSubmit={handleImageUpload} className="p-2 bg-orange-300">
        <input
          type="file"
          id="photo-picker"
          onChange={(e) => {
            handlePictureChange(e);
            convertFile(e.target.files);
          }}
        />
        <input
          type="text"
          placeholder="Add picture name"
          id="photo-name"
          onChange={(e) => setPictureName(e.target.value)}
        />
        <button type="submit">Share your picture!</button>
      </form>
      {picturePreview && (
        <div>
          <img src={URL.createObjectURL(picturePreview)} alt="Thumb" />
          <button onClick={removeSelectedImage}>Remove This Image</button>
        </div>
      )}
    </div>
  );
});
