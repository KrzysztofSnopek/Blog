import { useState, useEffect } from "react";
import { storage } from "../../firebase";
import { ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { Loader } from "../../Helpers/Loader";
import { UploadedImage } from "../ViewYours/ViewYours";

export function Main() {
  const [pictureList, setPictureList] = useState<UploadedImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const pictureListRef = ref(storage, `projectFiles`);

  useEffect(() => {
    const imageData: UploadedImage[] = [];

    listAll(pictureListRef).then((response) => {
      const promises = response.items.map((item) =>
        Promise.all([getDownloadURL(item), getMetadata(item)])
      );

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
    <div>
      <div className="flex flex-wrap flex-row-3 bg-slate-400 justify-center gap-6">
        {pictureList.map((item, index) => {
          return (
            <div
              className="w-1/4 p-8 flex justify-center max-h-96 bg-slate-600 bg-opacity-20 backdrop-blur-md shadow-xl"
              key={`${index}-${item.url}`}
            >
              <img
                className="object-contain max-w-full h-auto cursor-pointer hover:opacity-70"
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
