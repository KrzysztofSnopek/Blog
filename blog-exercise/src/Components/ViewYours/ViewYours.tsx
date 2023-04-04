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
    listAll(pictureListRef).then((response) => {
      response.items.forEach((item) => {
        if (item.fullPath.match(regex)?.at(1) === userName) {
          getMetadata(item).then((metadata) => {
            setImageAlt(metadata);
          });
          const alt = imageAlt?.customMetadata?.imageName;
          getDownloadURL(item).then((url) => {
            setPictureList((prev): any => {
              return [...prev, { url, alt }];
            });
          });
        }
      });
    });
  }, []);

  return (
    <div className="bg-slate-400">
      {userName}
      <div className="flex flex-wrap flex-row-3 bg-slate-400 justify-center gap-6">
        {pictureList.map((item) => {
          return (
            <div className="w-1/4 p-8 flex justify-center flex-col max-h-96 bg-slate-600 bg-opacity-20 backdrop-blur-md shadow-xl">
              <div className="px-6 pt-6 text-center">{item.alt}</div>
              <img
                className="object-contain max-h-full max-w-full p-6"
                src={item.url}
                key={item.url}
                alt={item.alt}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
