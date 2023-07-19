import { useState, useEffect } from "react";
import { storage } from "../../firebase";
import { ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { doc, onSnapshot } from "@firebase/firestore";
import { auth, db } from "../../firebase";
import { Loader } from "../../Helpers/Loader";
import { UploadedImage, LikedPhotos } from "../../Helpers/PhotoRepository";
import { usePhotoStore } from "../../Helpers/PhotoStore";

export function Leaderboards() {
  const photoStore = usePhotoStore();

  const [isImgFullScreen, setIsImgFullScreen] = useState<boolean>(false);
  const [tempImgURL, setTempImgURL] = useState<string>("");
  const [likedPhotos, setLikedPhotos] = useState<LikedPhotos>();

  const likedPhotosCollectionRef = doc(
    db,
    "Photos",
    `${auth.currentUser?.email}`
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(likedPhotosCollectionRef, (doc) => {
      const likedPhotos = Object.values(doc.data() as LikedPhotos);

      setLikedPhotos(likedPhotos[0]);
    });
    return () => unsubscribe();
  }, []);

  photoStore.pictureList.sort(function (a, b) {
    return b.likeCount - a.likeCount;
  });
  if (photoStore.pictureList.length > 6) {
    photoStore.setPictureList(photoStore.pictureList.slice(0, 6));
  }

  const leaderURL = (url: string) => {
    if (url === "") {
      return photoStore.pictureList[0].url;
    } else return tempImgURL;
  };

  const getImg = (imgUrl: string) => {
    setTempImgURL(imgUrl);
    setIsImgFullScreen(true);
  };

  return (
    <div className="flex flex-row content-end">
      <div className="grid grid-cols-6 grid-rows-3 bg-slate-400">
        {photoStore.pictureList.map((item, index) => {
          return (
            <div
              className="flex justify-center items-center bg-slate-600 bg-opacity-20 backdrop-blur-md shadow-xl p-4"
              key={`${index}-${item.url}`}
            >
              <img
                className="hover:opacity-70 object-cover cursor-pointer rounded-2xl h-[calc((100vh-11rem)/3)]"
                src={item.url}
                alt={item.alt}
                onClick={() => getImg(item.url)}
              />
            </div>
          );
        })}
        <div className="order-4 col-start-2 col-end-6 row-start-1 row-end-4 flex">
          <img
            className="m-auto max-h-[calc(100vh-5rem)]"
            src={leaderURL(tempImgURL)}
            alt=""
          />
        </div>
      </div>
    </div>
  );
}
