import { useState, useEffect } from "react";
import { storage } from "../../firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { auth } from "../../firebase";

export function Main() {
  const [pictureList, setPictureList] = useState([]);

  const userName = auth.currentUser?.displayName;
  const pictureListRef = ref(storage, `projectFiles`);

  useEffect(() => {
    let subscribed = true;
    listAll(pictureListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          if (subscribed) {
            setPictureList((prev): any => {
              return [...prev, url];
            });
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
      {userName}
      {pictureList.map((url) => {
        return <img src={url} key={url} />;
      })}
    </div>
  );
}
