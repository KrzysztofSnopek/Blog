import { useState, useEffect } from "react";
import { storage } from "../../firebase";
import {
  ref,
  listAll,
  getDownloadURL,
  getMetadata,
  updateMetadata,
} from "firebase/storage";
import {
  doc,
  setDoc,
  arrayRemove,
  arrayUnion,
  onSnapshot,
} from "@firebase/firestore";
import { auth, db } from "../../firebase";
import { Loader } from "../../Helpers/Loader";
import { UploadedImage, LikedPhotos } from "../../Helpers/PhotoRepository";
import DisabledByDefaultOutlinedIcon from "@mui/icons-material/DisabledByDefaultOutlined";
import { BsSuitHeartFill, BsSuitHeart } from "react-icons/bs";

export function Main() {
  const [pictureList, setPictureList] = useState<UploadedImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isImgFullScreen, setIsImgFullScreen] = useState<boolean>(false);
  const [tempImgURL, setTempImgURL] = useState<string>("");
  const [likeNumber, setLikeNumber] = useState<number>(0);
  const pictureListRef = ref(storage, `projectFiles`);
  const likedPhotosRef = doc(db, "Photos", `${auth.currentUser?.email}`);
  const [likedPhotos, setLikedPhotos] = useState<LikedPhotos>();

  const likedPhotosCollectionRef = doc(
    db,
    "Photos",
    `${auth.currentUser?.email}`
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(likedPhotosCollectionRef, (doc) => {
      if (doc.data() !== undefined) {
        const newPhotoData = doc.data() as LikedPhotos;
        const likedPhotos = Object.values(newPhotoData);
        setLikedPhotos(likedPhotos[0]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
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

        setPictureList(imageData);
        setIsLoading(false);
      });
    });
  }, [likeNumber]);

  if (isLoading) {
    return <Loader />;
  }

  const getImg = (imgUrl: string) => {
    setTempImgURL(imgUrl);
    setIsImgFullScreen(true);
  };

  const handleLikeDataCreation = async (url: string) => {
    await setDoc(
      likedPhotosRef,
      { likedPhotos: arrayUnion(url) },
      { merge: true }
    );
  };

  const handleLikeDataRemoval = async (url: string) => {
    await setDoc(
      likedPhotosRef,
      { likedPhotos: arrayRemove(url) },
      { merge: true }
    );
  };

  const ClickToLike = (item: UploadedImage) => {
    return (
      <BsSuitHeart
        onClick={() => {
          changeLikeStatus(item, additive);
          handleLikeDataCreation(item.url);
        }}
      />
    );
  };

  const ClickToDislike = (item: UploadedImage) => {
    return (
      <BsSuitHeartFill
        onClick={() => {
          changeLikeStatus(item, subtractive);
          handleLikeDataRemoval(item.url);
        }}
      />
    );
  };

  const isPhotoURLLiked = (item: UploadedImage) => {
    if (Array.isArray(likedPhotos) && likedPhotos.includes(item.url)) {
      return <div>{ClickToDislike(item)}</div>;
    } else {
      return <div>{ClickToLike(item)}</div>;
    }
  };

  const additive = (item: UploadedImage) => {
    return Number(item.likeCount) + 1;
  };

  const subtractive = (item: UploadedImage) => {
    return Number(item.likeCount) - 1;
  };

  const changeLikeStatus = (
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
      setLikeNumber(metadata.customMetadata.likeCount);
    });
  };

  return (
    <div>
      <div
        className={
          isImgFullScreen
            ? "w-full min-h-screen fixed top-0 left-0 flex justify-center items-center bg-slate-900 bg-opacity-20 backdrop-blur-xl shadow-xl z-10"
            : "hidden"
        }
      >
        <div className="h-5/6">
          <img
            src={tempImgURL}
            className="cursor-pointer max-h-screen"
            alt=""
            onClick={() => setIsImgFullScreen(false)}
          />
        </div>
        <div
          className="cursor-pointer text-slate-600 hover:text-orange-500 fixed top-4 right-4"
          onClick={() => setIsImgFullScreen(false)}
        >
          <DisabledByDefaultOutlinedIcon fontSize="large" color="inherit" />
        </div>
      </div>

      <div className="flex flex-wrap flex-row-3 bg-slate-400 justify-center gap-6">
        {pictureList.map((item, index) => {
          return (
            <div
              className="w-1/4 p-8 flex justify-center flex-col max-h-96 bg-slate-600 bg-opacity-20 backdrop-blur-md shadow-xl "
              key={`${index}-${item.url}`}
            >
              <div className="px-6 pt-6 text-center">{item.alt}</div>
              <img
                className="object-contain max-h-full max-w-full p-6 hover:opacity-70 cursor-pointer"
                src={item.url}
                alt={item.alt}
                onClick={() => getImg(item.url)}
              />
              <div className="pb-8 text-xl text-slate-950 fixed -right-4 flex flex-col items-center">
                <span className="p-2 cursor-pointer">
                  <span className="">{isPhotoURLLiked(item)}</span>
                  <span>{item.likeCount}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
