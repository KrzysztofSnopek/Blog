import { makeAutoObservable } from "mobx";
import React, { useContext, useState } from "react";
import { UploadedImage } from "./PhotoRepository";
import { ref, updateMetadata } from "firebase/storage";
import { storage } from "../firebase";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { doc, setDoc, arrayRemove, arrayUnion } from "@firebase/firestore";
import { db } from "../firebase";

export default class PhotoStore {
  constructor() {
    makeAutoObservable(this);
  }
  likeNumber: number = 0;
  isLoading: boolean = true;
  pictureList: UploadedImage[] = [];
  imageData: UploadedImage[] = [];
  likedPhotos: string[] = [];
  isImgFullScreen: boolean = false;
  tempImgURL: string = "";

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

  setIsImgFullScreen = (isImgFullScreen: boolean) => {
    this.isImgFullScreen = isImgFullScreen;
  };

  setTempImgURL = (tempImgURL: string) => {
    this.tempImgURL = tempImgURL;
  };

  pushToImageData = (imgData: UploadedImage) => {
    this.imageData = [...this.imageData, imgData];
  };

  handleLikeDataCreation = async (
    url: string,
    addOrRem: (item: UploadedImage) => number,
    currentUserMail: string
  ) => {
    await setDoc(
      doc(db, "Photos", currentUserMail),
      { likedPhotos: arrayUnion(url) },
      { merge: true }
    );
    this.changedLikeCountPictureList(url, addOrRem);
  };

  handleLikeDataRemoval = async (
    url: string,
    addOrRem: (item: UploadedImage) => number,
    currentUserMail: string
  ) => {
    await setDoc(
      doc(db, "Photos", currentUserMail),
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
      this.setLikeNumber(Number(metadata?.customMetadata?.likeCount));
    });
  };

  debounce = <T extends any[]>(
    cb: (...args: T) => void,
    delay = 1000
  ): ((...args: T) => void) => {
    let timeout: NodeJS.Timeout;

    return (...args: T) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        cb(...args);
      }, delay);
    };
  };

  debouncedClickToDislike = this.debounce(
    (item: UploadedImage, currentUserMail: string) => {
      this.changeLikeStatus(item, this.subtractive);
      this.handleLikeDataRemoval(item.url, this.subtractive, currentUserMail);
      const filteredLikedPhotos = this.likedPhotos.filter(
        (photoURL) => photoURL !== item.url
      );
      this.setLikedPhotos(filteredLikedPhotos);
    },
    1000
  );

  debouncedClicktoLike = this.debounce(
    (item: UploadedImage, currentUserMail: string) => {
      this.changeLikeStatus(item, this.additive);
      this.handleLikeDataCreation(item.url, this.additive, currentUserMail);
      this.setLikedPhotos([...this.likedPhotos, item.url]);
    }
  );

  ClickToLike = (item: UploadedImage, mail: string) => {
    return (
      <FavoriteBorderIcon
        fontSize="large"
        onClick={() => {
          this.debouncedClicktoLike(item, mail);
        }}
      />
    );
  };

  ClickToDislike = (item: UploadedImage, mail: string) => {
    return (
      <FavoriteIcon
        fontSize="large"
        onClick={() => {
          this.debouncedClickToDislike(item, mail);
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
