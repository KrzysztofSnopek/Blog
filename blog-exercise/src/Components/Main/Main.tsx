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
      <div className="flex flex-wrap flex-row-3 bg-slate-400 justify-center gap-4">
        {pictureList.map((url) => {
          return (
            <div className="w-1/4 p-8 flex justify-center">
              <img
                className="object-cover max-w-full h-auto"
                src={url}
                key={url}
                alt=""
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
