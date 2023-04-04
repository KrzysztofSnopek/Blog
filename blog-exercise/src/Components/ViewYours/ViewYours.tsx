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
  alt: string;
}

export function ViewYours() {
  const [pictureList, setPictureList] = useState<UploadedImage[]>([]);
  const [imageAlt, setImageAlt] = useState<FullMetadata>();

  const userName = auth.currentUser?.displayName;
  const pictureListRef = ref(storage, `projectFiles`);

  const regex = /\/([^\/-]+)_/;

  useEffect(() => {
    let subscribed = true;
    listAll(pictureListRef).then((response) => {
      response.items.forEach((item) => {
        if (item.fullPath.match(regex)?.at(1) === userName) {
          getMetadata(item).then((metadata) => {
            setImageAlt(metadata);
          });
          const alt = imageAlt?.customMetadata?.imageName;
          getDownloadURL(item).then((url) => {
            if (subscribed) {
              setPictureList((prev): any => {
                return [...prev, { url, alt }];
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

  return (
    <div>
      {userName}

      {pictureList.map((item) => {
        return (
          <div>
            <div>{item.alt}</div>
            <img src={item.url} key={item.url} alt={item.alt} />
          </div>
        );
      })}
    </div>
  );
}
