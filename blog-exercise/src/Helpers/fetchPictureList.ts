import { listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { UploadedImage } from "./PhotoRepository";
import { pictureListRef } from "./StorageReferences";

export const fetchPictureList = () => {
  const imageData: UploadedImage[] = [];

  listAll(pictureListRef).then((response) => {
    const promises = response.items.map((item) =>
      Promise.all([getDownloadURL(item), getMetadata(item)])
    );

    Promise.all(promises).then((results) => {
      results.forEach(([url, metadata]) => {
        const alt = metadata?.customMetadata?.imageName ?? "";
        const likeCount = metadata.customMetadata.likeCount;
        const storagePathElement = metadata.customMetadata.storagePathElement;
        imageData.push({ url, alt, storagePathElement, likeCount });
      });
    });
  });
  return imageData;
};
