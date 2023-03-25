import { useState, useEffect } from "react";
import { storage } from "../../firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { auth } from "../../firebase";

export function ViewYours() {
  const [pictureList, setPictureList] = useState([]);

  const userName = auth.currentUser?.displayName;
  const pictureListRef = ref(storage, `projectFiles/${userName}`);

  useEffect(() => {
    let subscribed = true;
    listAll(pictureListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          if (subscribed) {
            setPictureList((prev): any => [...prev, url]);
          }
        });
      });
    });
    return () => {
      subscribed = false;
    };
  }, []);

  return (
    <div>
      {pictureList.map((url) => {
        return <img src={url} key={url} />;
      })}
    </div>
  );
}
