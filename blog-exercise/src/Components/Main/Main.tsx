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
      <div className="bg-slate-400">{userName}</div>
      <div className="flex flex-wrap flex-row-3 bg-slate-400 justify-center gap-6">
        {pictureList.map((url) => {
          return (
            <div className="w-1/4 p-8 flex justify-center max-h-96 bg-slate-600 bg-opacity-20 backdrop-blur-md shadow-xl">
              <img
                className="object-contain max-w-full h-auto"
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
