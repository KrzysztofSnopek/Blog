import { makeAutoObservable } from "mobx";
import React, { useEffect, useRef } from "react";
import { UploadedImage } from "./PhotoRepository";
import { getDownloadURL, getMetadata, listAll, ref } from "firebase/storage";
import { storage } from "../firebase";

export default class PhotoStore {
  constructor() {
    makeAutoObservable(this, {});
  }
  pictureListRef = ref(storage, `projectFiles`);
  likeNumber: number = 0;
  pictureList: UploadedImage[] = [];
  imageData: UploadedImage[] = [];

  setPictureList = (pictureList: UploadedImage[]) => {
    this.pictureList = pictureList;
  };

  setLikeNumber = (likeNumber: number) => {
    this.likeNumber = likeNumber;
  };

  listAllPictures() {
    listAll(this.pictureListRef).then((response) => {
      const promises = response.items.map((item) =>
        Promise.all([getDownloadURL(item), getMetadata(item)])
      );

      Promise.all(promises).then((results) => {
        results.forEach(([url, metadata]) => {
          const alt = metadata?.customMetadata?.imageName ?? "";
          const likeCount = metadata.customMetadata.likeCount;
          const storagePathElement = metadata.customMetadata.storagePathElement;
          this.imageData.push({ url, alt, storagePathElement, likeCount });
        });

        this.setPictureList(this.imageData);
      });
    });
  }
}

export const PhotoStoreContext = React.createContext<Partial<PhotoStore>>({});

type PhotoProviderProps = {
  children: React.ReactNode;
};

export function PhotoStoreProvider({ children }: PhotoProviderProps) {
  const store = useRef(new PhotoStore());

  return (
    <PhotoStoreContext.Provider value={store.current}>
      {children}
    </PhotoStoreContext.Provider>
  );
}
