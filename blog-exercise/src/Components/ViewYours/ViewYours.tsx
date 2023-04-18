import { useState, useEffect } from "react";
import { storage } from "../../firebase";
import { ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { auth } from "../../firebase";
import { Loader } from "../../Helpers/Loader";

export interface UploadedImage {
  url: string;
  alt: string;
}

export function ViewYours() {
  const [pictureList, setPictureList] = useState<UploadedImage[]>([]);
  const [userName, setUserName] = useState<string | "unknown">("unknown");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const pictureListRef = ref(storage, `projectFiles`);

  const regex = /\/([^/-]+)_/;

  useEffect(() => {
    const imageData: UploadedImage[] = [];

    listAll(pictureListRef).then((response) => {
      const userName = auth.currentUser?.displayName ?? "unknown";
      setUserName(userName);

      const promises = response.items
        .filter((item) => item.fullPath.match(regex)?.at(1) === userName)
        .map((item) => Promise.all([getDownloadURL(item), getMetadata(item)]));

      Promise.all(promises).then((results) => {
        results.forEach(([url, metadata]) => {
          const alt = metadata?.customMetadata?.imageName ?? "";
          imageData.push({ url, alt });
        });

        setPictureList(imageData);
        setIsLoading(false);
      });
    });
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="bg-slate-400">
      {userName}
      <div className="flex flex-wrap flex-row-3 bg-slate-400 justify-center gap-6">
        {pictureList.map((item, index) => {
          return (
            <div
              className="w-1/4 p-8 flex justify-center flex-col max-h-96 bg-slate-600 bg-opacity-20 backdrop-blur-md shadow-xl"
              key={`${index}-${item.url}`}
            >
              <div className="px-6 pt-6 text-center">{item.alt}</div>
              <img
                className="object-contain max-h-full max-w-full p-6"
                src={item.url}
                alt={item.alt}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
