import { useEffect, useState } from "react";
import { storage } from "../../firebase";
import { ref, listAll, uploadString, getDownloadURL } from "firebase/storage";
import { auth } from "../../firebase";
import { observer } from "mobx-react";
import { v4 } from "uuid";

export const AddPicture = observer(() => {
  const [filebase64, setFileBase64] = useState<string>("");
  const userName = auth.currentUser?.displayName;

  const handleImageUpload = async (e: any) => {
    e.preventDefault();

    if (filebase64 === "") return;

    const imageRef = ref(storage, `projectFiles/${userName + "/" + v4()}`);

    const metadata = {
      customMetadata: {
        createdBy: `${userName}`,
      },
    };

    await uploadString(imageRef, filebase64, "base64", metadata).then(() => {
      alert("uploaded to the storage");
    });
  };

  function convertFile(files: FileList | null): void {
    if (files) {
      const fileRef = files[0] || "";
      const fileType: string = fileRef.type || "";
      console.log("This file upload is of type:", fileType);
      const reader = new FileReader();
      reader.readAsBinaryString(fileRef);
      reader.onload = (e: any) => {
        // convert it to base64
        setFileBase64(`${btoa(e.target.result)}`);
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
