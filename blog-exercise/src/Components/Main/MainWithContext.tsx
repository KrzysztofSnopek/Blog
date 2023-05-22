import { useState, useEffect, useContext } from "react";
import { storage } from "../../firebase";
import { listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { doc, onSnapshot } from "@firebase/firestore";
import { auth, db } from "../../firebase";
import { Loader } from "../../Helpers/Loader";
import { useDebounce } from "../../Helpers/useDebounce";
import { LikedPhotos } from "../../Helpers/PhotoRepository";
import DisabledByDefaultOutlinedIcon from "@mui/icons-material/DisabledByDefaultOutlined";
import { usePhotoStore } from "../../Helpers/PhotoStore";
import { observer } from "mobx-react";

export const MainWithContext = observer(() => {
  const photoStore = usePhotoStore();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isImgFullScreen, setIsImgFullScreen] = useState<boolean>(false);
  const [tempImgURL, setTempImgURL] = useState<string>("");

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
        photoStore.setLikedPhotos(likedPhotos[0]);
      }
    });

    return () => unsubscribe();
  }, [photoStore]);

  useEffect(() => {
    listAll(photoStore.pictureListRef).then((response) => {
      const promises = response.items.map((item) =>
        Promise.all([getDownloadURL(item), getMetadata(item)])
      );

      Promise.all(promises).then((results) => {
        results.forEach(([url, metadata]) => {
          const alt = metadata?.customMetadata?.imageName ?? "";
          const likeCount = metadata.customMetadata.likeCount;
          const storagePathElement = metadata.customMetadata.storagePathElement;
          photoStore?.imageData?.push({
            url,
            alt,
            storagePathElement,
            likeCount,
          });
        });
        photoStore.setPictureList(photoStore.imageData);
        setIsLoading(false);
      });
    });
  }, [photoStore]);

  if (isLoading) {
    return <Loader />;
  }

  const getImg = (imgUrl: string) => {
    setTempImgURL(imgUrl);
    setIsImgFullScreen(true);
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
        {photoStore.pictureList?.map((item, index) => {
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
                  <span className="">{photoStore.isPhotoURLLiked(item)}</span>
                  <span>{item.likeCount}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
