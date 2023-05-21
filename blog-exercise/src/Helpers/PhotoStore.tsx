import { makeAutoObservable } from "mobx";
import React, { useContext, useRef, useState } from "react";
import { UploadedImage } from "./PhotoRepository";
import { StorageReference, ref } from "firebase/storage";
import { storage } from "../firebase";
import { error } from "console";

export default class PhotoStore {
  constructor() {
    makeAutoObservable(this);
  }
  pictureListRef: StorageReference = ref(storage, `projectFiles`);
  likeNumber: number = 0;
  isLoading: boolean = true;
  pictureList: UploadedImage[] = [];
  imageData: UploadedImage[] = [];

  setPictureList = (pictureList: UploadedImage[]) => {
    this.pictureList = pictureList;
  };

  setLikeNumber = (likeNumber: number) => {
    this.likeNumber = likeNumber;
  };

  setIsLoading = (isLoading: boolean) => {
    this.isLoading = isLoading;
  };
}
type PhotoStoreContextValue = PhotoStore;
export const PhotoStoreContext =
  React.createContext<PhotoStoreContextValue | null>(null);

type PhotoProviderProps = {
  children: React.ReactNode;
};

export function PhotoStoreContextProvider({ children }: PhotoProviderProps) {
  const [store] = useState(() => new PhotoStore());

  return (
    <PhotoStoreContext.Provider value={store}>
      {children}
    </PhotoStoreContext.Provider>
  );
}

export function usePhotoStore(): PhotoStoreContextValue {
  const contextValue = useContext(PhotoStoreContext);
  if (contextValue === null) {
    throw new Error(
      "usePhotoStore must be used within PhotoStoreContextProvider"
    );
  }
  return contextValue;
}
