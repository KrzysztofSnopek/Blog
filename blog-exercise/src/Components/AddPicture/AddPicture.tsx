import { useEffect, useState } from "react";
import { storage } from "../../firebase";
import { ref, uploadBytes } from "firebase/storage";
import { auth, db } from "../../firebase";
import { observer } from "mobx-react";
import { v4 } from "uuid";

export const AddPicture = observer(() => {
  const [myImage, setMyImage] = useState(null);
  const [filebase64, setFileBase64] = useState<string>("");
  const userName = auth.currentUser?.displayName;

  const handleImageUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    if (myImage === null) return;

    const imageRef = ref(storage, `images/${userName}/${myImage + v4()}`);
    uploadBytes(imageRef, myImage).then(() => {
      alert("uploaded to the storage");
    });
  };
  // const handleFilePicking = (
  //   e: React.ChangeEvent<HTMLInputElement>
  // ): void => {
  //   const files = (e.target as HTMLInputElement).files

  //   if(files !== null){
  //     setMyImage(files);
  //   }
  // };

  function convertFile(files: FileList | null) {
    if (files) {
      const fileRef = files[0] || "";
      const fileType: string = fileRef.type || "";
      console.log("This file upload is of type:", fileType);
      const reader = new FileReader();
      reader.readAsBinaryString(fileRef);
      reader.onload = (ev: any) => {
        // convert it to base64
        setFileBase64(`data:${fileType};base64,${btoa(ev.target.result)}`);
      };
    }
  }

  return (
    <div>
      <h1 className="font-bold p-2">Share your pictures with others here!</h1>

      <form onSubmit={handleImageUpload} className="p-2 bg-orange-300">
        <input type="file" onChange={(e) => convertFile(e.target.files)} />
        <button type="submit">Share your picture!</button>
      </form>
    </div>
  );
});
