import { useState, useEffect } from "react";
import { storage } from "../../firebase";
import { ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { doc, onSnapshot } from "@firebase/firestore";
import { auth, db } from "../../firebase";
import { Loader } from "../../Helpers/Loader";
import { UploadedImage, LikedPhotos } from "../../Helpers/PhotoRepository";
import { usePhotoStore } from "../../Helpers/PhotoStore";
import { fetchPictureList } from "../../Helpers/fetchPictureList";

export function Leaderboards() {
  const photoStore = usePhotoStore();

  const [isImgFullScreen, setIsImgFullScreen] = useState<boolean>(false);
  const [tempImgURL, setTempImgURL] = useState<string>("");
  const [likedPhotos, setLikedPhotos] = useState<LikedPhotos>();
  const [leadingPictureList, setLeadingPictureList] = useState<UploadedImage[]>(
    []
  );
  const [likeNumber, setLikeNumber] = useState<number>(0);

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

  useEffect(() => {
    photoStore.setIsLoading(true);

    const fetchData = async () => {
      try {
        await fetchPictureList(photoStore);
        setLeadingPictureList(photoStore.pictureList);
      } catch (error) {
        console.error("Could not fetch picture list:", error);
      } finally {
        photoStore.setIsLoading(false);
      }
    };
    fetchData();
  }, [photoStore]);

  if (photoStore.isLoading) {
    return <Loader />;
  }

  leadingPictureList.sort(function (a, b) {
    return b.likeCount - a.likeCount;
  });
  if (leadingPictureList.length > 6) {
    setLeadingPictureList(leadingPictureList.slice(0, 6));
  }

  const getImg = (imgUrl: string) => {
    setTempImgURL(imgUrl);
    setIsImgFullScreen(true);
  };

  return (
    <div className="flex flex-row content-end">
      <div className="grid grid-cols-6 grid-rows-3 bg-slate-400">
        {leadingPictureList.map((item, index) => {
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
            src={leadingPictureList[0]?.url}
            alt=""
          />
        </div>
      </div>
    </div>
  );
}
