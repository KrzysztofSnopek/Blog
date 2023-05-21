import { useState, useEffect } from "react";
import { observer } from "mobx-react";
import PhotoStore2 from "./Photostore2";
import { storage } from "../firebase";
import { ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { auth } from "../firebase";
import { Loader } from "../Helpers/Loader";
import { UploadedImage } from "../Helpers/PhotoRepository";

export const DataFetcher = observer(({ PhotoStore2 }: any) => {
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
          const storagePathElement = metadata.customMetadata.storagePathElement;
          const likeCount = metadata.customMetadata.likeCount;
          imageData.push({ url, alt, storagePathElement, likeCount });
        });

        PhotoStore2.setData(imageData);
        setIsLoading(false);
      });
    });
  }, []);
  return <></>;
});
