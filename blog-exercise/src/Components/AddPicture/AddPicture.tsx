import { useState } from "react";
import { storage } from "../../firebase";
import { ref, uploadString } from "firebase/storage";
import { auth, db } from "../../firebase";
import { addDoc, collection, serverTimestamp } from "@firebase/firestore";
import { observer } from "mobx-react";
import { v4 } from "uuid";

export const AddPicture = observer(() => {
  const [filebase64, setFileBase64] = useState<string>("");
  const [pictureName, setPictureName] = useState<string>("");
  const userName = auth.currentUser?.displayName ?? "";
  const storagePathElement = userName + "_" + v4();

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
      },
    };

    await uploadString(imageRef, filebase64, "base64", metadata).then(() => {
      alert("uploaded to the storage");
    });
  };

  const handleLikeDataCreation = async (e: any) => {
    const likedPhotosRef = collection(db, `Photos/${userName}`);

    const uploadLikedData = async () => {
      await addDoc(likedPhotosRef, {
        isLiked: false,
        timestamp: serverTimestamp(),
        user: auth.currentUser?.displayName,
        storageElement: storagePathElement,
      });
    };
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

  return (
    <div>
      <h1 className="font-bold p-2">Share your pictures with others here!</h1>

      <form onSubmit={handleImageUpload} className="p-2 bg-orange-300">
        <input type="file" onChange={(e) => convertFile(e.target.files)} />
        <input
          type="text"
          placeholder="Add picture name"
          onChange={(e) => setPictureName(e.target.value)}
        />
        <button type="submit">Share your picture!</button>
      </form>
    </div>
  );
});
