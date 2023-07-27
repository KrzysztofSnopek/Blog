import { useState, useEffect } from "react";
import { doc, onSnapshot } from "@firebase/firestore";
import { db } from "../../firebase";
import { Loader } from "../../Helpers/Loader";
import { UploadedImage, LikedPhotos } from "../../Helpers/PhotoRepository";
import { usePhotoStore } from "../../Helpers/PhotoStore";
import { fetchPictureList } from "../../Helpers/fetchPictureList";
import { SinglePhotoPanel } from "../Main/SinglePhotoPanel";
import { useAuthStore } from "../Auth/AuthStore";

export function Leaderboards() {
  const photoStore = usePhotoStore();
  const authStore = useAuthStore();

  const [isImgFullScreen, setIsImgFullScreen] = useState<boolean>(false);
  const [tempImgURL, setTempImgURL] = useState<string>("");
  const [likedPhotos, setLikedPhotos] = useState<LikedPhotos>();
  const [leadingPictureList, setLeadingPictureList] = useState<UploadedImage[]>(
    []
  );
  const [likeNumber, setLikeNumber] = useState<number>(0);

  const currentUserMail: string =
    window.localStorage.getItem("user")?.replace(/"/g, "") ?? "no current user";

  const likedPhotosCollectionRef = doc(db, "Photos", currentUserMail);

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
    <div className="flex flex-row content-end p-2 bg-blue-50">
      <div className="grid grid-cols-6 grid-rows-3 bg-blue-50">
        {leadingPictureList.map((item, index) => {
          return (
            <div
              className="flex justify-center items-center bg-blue-50 backdrop-blur-md"
              key={`${index}-${item.url}`}
            >
              {/* <img
                className="hover:opacity-70 object-cover cursor-pointer rounded-2xl h-[calc((100vh-11rem)/3)]"
                src={item.url}
                alt={item.alt}
                onClick={() => getImg(item.url)}
              /> */}

              <div key={item.url} className=" bg-blue-100">
                <SinglePhotoPanel
                  index={index}
                  item={item}
                  currentUserMail={authStore.currentUserMail}
                />
              </div>
            </div>
          );
        })}
        <div className="order-4 col-start-2 col-end-6 row-start-1 row-end-4 flex">
          <img
            className="m-auto max-h-[calc(100vh-6rem)]"
            src={leadingPictureList[0]?.url}
            alt=""
          />
        </div>
      </div>
    </div>
  );
}
