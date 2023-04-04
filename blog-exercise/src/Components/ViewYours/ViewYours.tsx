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

export interface UploadedImage {
  url: string;
  imageALT: string;
}

export function ViewYours() {
  const [pictureList, setPictureList] = useState<UploadedImage[]>([]);
  const [imageAlt, setImageAlt] = useState<FullMetadata>();

  const userName = auth.currentUser?.displayName;
  const pictureListRef = ref(storage, `projectFiles`);

  // const regex = /\/([^\/-]+)\//;
  const regex = /\/([^\/-]+)_/;
  const altRegex = /%([^\/-]+)%/;

  useEffect(() => {
    let subscribed = true;
    listAll(pictureListRef).then((response) => {
      response.items.forEach((item) => {
        if (item.fullPath.match(regex)?.at(1) === userName) {
          getDownloadURL(item).then((url) => {
            if (subscribed) {
              setPictureList((prev): any => {
                getMetadata(item).then((metadata) => {
                  setImageAlt(metadata);
                });
                console.log("imageALT:", imageAlt);
                return [...prev, { url, imageAlt }];
              });
            }
          });
        }
      });
    });
    return () => {
      subscribed = false;
    };
  }, []);

  console.log(imageAlt);

  return (
    <div>
      {userName}

      {pictureList.map((item) => {
        return (
          <div>
            <div>{item.imageALT}</div>
            <img src={item.url} key={item.url} alt={item.imageALT} />
          </div>
        );
      })}
    </div>
  );
}
