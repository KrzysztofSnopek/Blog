import { makeAutoObservable, toJS } from "mobx";
import React, { useContext, useRef, useState } from "react";
import { UploadedImage } from "./PhotoRepository";
import { StorageReference, ref, updateMetadata } from "firebase/storage";
import { storage } from "../firebase";
import { BsSuitHeart, BsSuitHeartFill } from "react-icons/bs";
import { doc, setDoc, arrayRemove, arrayUnion } from "@firebase/firestore";
import { auth, db } from "../firebase";

export default class PhotoStore {
  constructor() {
    makeAutoObservable(this);
  }
  pictureListRef: StorageReference = ref(storage, `projectFiles`);
  likedPhotosRef = doc(db, "Photos", `${auth.currentUser?.email}`);
  likeNumber: number = 0;
  isLoading: boolean = true;
  pictureList: UploadedImage[] = [];
  imageData: UploadedImage[] = [];
  likedPhotos: string[] = [];

  setPictureList = (pictureList: UploadedImage[]) => {
    this.pictureList = pictureList;
  };

  setLikeNumber = (likeNumber: number) => {
    this.likeNumber = likeNumber;
  };

  setIsLoading = (isLoading: boolean) => {
    this.isLoading = isLoading;
  };

  setLikedPhotos = (likedPhotos: string[]) => {
    this.likedPhotos = likedPhotos;
  };

  pushToImageData = (imgData: UploadedImage) => {
    this.imageData = [...this.imageData, imgData];
  };

  handleLikeDataCreation = async (
    url: string,
    addOrRem: (item: UploadedImage) => number
  ) => {
    await setDoc(
      this.likedPhotosRef,
      { likedPhotos: arrayUnion(url) },
      { merge: true }
    );
    this.changedLikeCountPictureList(url, addOrRem);
  };

  handleLikeDataRemoval = async (
    url: string,
    addOrRem: (item: UploadedImage) => number
  ) => {
    await setDoc(
      this.likedPhotosRef,
      { likedPhotos: arrayRemove(url) },
      { merge: true }
    );
    this.changedLikeCountPictureList(url, addOrRem);
  };

  additive = (item: UploadedImage) => {
    return Number(item.likeCount) + 1;
  };

  subtractive = (item: UploadedImage) => {
    return Number(item.likeCount) - 1;
  };

  changedLikeCountPictureList = (
    url: string,
    addOrRem: (item: UploadedImage) => number
  ) => {
    const updatedPictureList = this.pictureList.map((item: UploadedImage) => {
      if (url === item.url) {
        return {
          ...item,
          likeCount: Number(`${addOrRem(item)}`),
        };
      }
      return item;
    });
    this.setPictureList(updatedPictureList);
    console.log(updatedPictureList);
  };

  changeLikeStatus = (
    item: UploadedImage,
    addOrRem: (item: UploadedImage) => number
  ) => {
    const newAddLikeMetadata = {
      customMetadata: {
        likeCount: `${addOrRem(item)}`,
      },
    };

    const countRef = ref(storage, `projectFiles/${item.storagePathElement}`);

    updateMetadata(countRef, newAddLikeMetadata).then((metadata) => {
      this.setLikeNumber(metadata.customMetadata.likeCount);
    });
  };

  ClickToLike = (item: UploadedImage) => {
    return (
      <BsSuitHeart
        onClick={() => {
          this.changeLikeStatus(item, this.additive);
          this.handleLikeDataCreation(item.url, this.additive);
          this.setLikedPhotos([...this.likedPhotos, item.url]);
        }}
      />
    );
  };

  ClickToDislike = (item: UploadedImage) => {
    return (
      <BsSuitHeartFill
        onClick={() => {
          this.changeLikeStatus(item, this.subtractive);
          this.handleLikeDataRemoval(item.url, this.subtractive);
          const filteredLikedPhotos = this.likedPhotos.filter(
            (photoURL) => photoURL !== item.url
          );
          this.setLikedPhotos(filteredLikedPhotos);
        }}
      />
    );
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
