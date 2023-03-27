import { useState, useEffect } from "react";
import { storage, auth } from "../../firebase";
import { ref, listAll, getDownloadURL } from "firebase/storage";

export function Main() {
  const [pictureList, setPictureList] = useState([]);

  const userName = auth.currentUser?.displayName;
  const pictureListRef = ref(storage, "projectFiles");

  useEffect(() => {
    let subscribed = true;
    listAll(pictureListRef).then((response) => {
      response.prefixes.forEach((item) => {
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
  console.log(pictureList);

  return (
    <div>
      {pictureList.map((url) => {
        return <img src={url} key={url} />;
      })}
    </div>
  );
}
