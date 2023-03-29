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

  // console.log("username:", userName);
  const mypath = "projectFiles/dracola890-d2aa9156";
  const regex = /\/([^\/-]+)-/;
  const regexResult = mypath.match(regex);
  console.log("mypath regex to:", regexResult?.at(1));

  useEffect(() => {
    let subscribed = true;
    listAll(pictureListRef).then((response) => {
      response.items.forEach((item) => {
        getMetadata(item)
          .then((data) => setOMetadata(data))
          .then(() => {
            if (oMetadata?.customMetadata?.createdBy === userName) {
              getDownloadURL(item).then((url) => {
                if (subscribed) {
                  setPictureList((prev): any => {
                    return [...prev, url];
                  });
                }
              });
            }
          });
      });
    });
    return () => {
      subscribed = false;
    };
  }, [userName]);

  return (
    <div>
      {userName}
      {pictureList.map((url) => {
        return <img src={url} key={url} />;
      })}
    </div>
  );
}
