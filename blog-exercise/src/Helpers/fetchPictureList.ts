import { listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { UploadedImage } from "./PhotoRepository";
import { pictureListRef } from "./StorageReferences";
import PhotoStore, { usePhotoStore } from "./PhotoStore";

export const fetchPictureList = async (store: PhotoStore) => {
  const imageData: UploadedImage[] = [];

  try {
    const response = await listAll(pictureListRef);

    const promises = response.items.map((item) =>
      Promise.all([getDownloadURL(item), getMetadata(item)])
    );

    const results = await Promise.all(promises);

    const newImageData = results.map(([url, metadata]) => ({
      url,
      alt: metadata?.customMetadata?.imageName ?? "",
      storagePathElement: metadata.customMetadata.storagePathElement,
      likeCount: metadata.customMetadata.likeCount,
    }));

    store.setPictureList([...imageData, ...newImageData]);
  } catch (error) {
    console.error("Error fetching or listing pictures:", error);
  }
};
