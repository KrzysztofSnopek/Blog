import { useState, useEffect } from "react";
import { storage } from "../../firebase";
import {
  ref,
  listAll,
  getDownloadURL,
  getMetadata,
  FullMetadata,
} from "firebase/storage";
import { auth } from "../../firebase";

export function ViewYours() {
  const [pictureList, setPictureList] = useState([]);
  const [oMetadata, setOMetadata] = useState<FullMetadata>();

  const userName = auth.currentUser?.displayName;
  const pictureListRef = ref(storage, "projectFiles");

  console.log("username:", userName);

  useEffect(() => {
    let subscribed = true;
    listAll(pictureListRef).then((response) => {
      response.items.forEach((item) => {
        getMetadata(item).then((data) => setOMetadata(data));
        if (oMetadata?.customMetadata?.createdBy === userName) {
          getDownloadURL(item).then((url) => {
            if (subscribed) {
              console.log("1", oMetadata?.customMetadata?.createdBy);
              console.log("2", userName);
              setPictureList((prev): any => [...prev, url]);
            }
          });
        }
      });
    });
    return () => {
      subscribed = false;
    };
  }, []);

  console.log("metadata info:", oMetadata?.customMetadata?.createdBy);
  console.log("picturelist", pictureList);

  return (
    <div>
      {userName}
      {pictureList.map((url) => {
        return <img src={url} key={url} />;
      })}
    </div>
  );
}
