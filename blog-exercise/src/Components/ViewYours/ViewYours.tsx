import { useEffect, useState } from "react";
import DisabledByDefaultOutlinedIcon from "@mui/icons-material/DisabledByDefaultOutlined";
import { usePhotoStore } from "../../Helpers/PhotoStore";
import { fetchPictureList } from "../../Helpers/fetchPictureList";
import { Loader } from "../../Helpers/Loader";
import { LikedPhotos, UploadedImage } from "../../Helpers/PhotoRepository";
import { onSnapshot, doc } from "@firebase/firestore";
import { observer } from "mobx-react";
import { db } from "../../firebase";

export const ViewYours = observer(() => {
  const photoStore = usePhotoStore();

  const [isImgFullScreen, setIsImgFullScreen] = useState<boolean>(false);
  const [tempImgURL, setTempImgURL] = useState<string>("");

  const currentUserMail: string =
    window.localStorage.getItem("user")?.replace(/"/g, "") ?? "no current user";

  const likedPhotosCollectionRef = doc(db, "Photos", currentUserMail);

  useEffect(() => {
    const unsubscribe = onSnapshot(likedPhotosCollectionRef, (doc) => {
      const likedPhotos = Object.values(doc.data() as LikedPhotos);

      photoStore.setLikedPhotos(likedPhotos[0]);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    photoStore.setIsLoading(true);

    const fetchData = async () => {
      try {
        await fetchPictureList(photoStore);
      } catch (error) {
        console.error("Could not fetch picture list:", error);
      } finally {
        photoStore.setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const currentUserPictureList: UploadedImage[] = photoStore.pictureList.filter(
    (picture) => picture.storagePathElement.split("_")[0] === currentUserMail
  );

  const getYourImg = (imgUrl: string) => {
    setTempImgURL(imgUrl);
    setIsImgFullScreen(true);
  };

  if (photoStore.isLoading) {
    return <Loader />;
  }

  return (
    <div className="bg-blue-50 min-h-[calc(100vh-5rem)]">
      <div
        className={
          isImgFullScreen
            ? "w-full min-h-screen fixed top-0 left-0 flex justify-center items-center bg-slate-900 bg-opacity-20 backdrop-blur-xl shadow-xl z-10"
            : "hidden"
        }
      >
        <img
          src={tempImgURL}
          className="cursor-pointer max-h-screen"
          alt=""
          onClick={() => setIsImgFullScreen(false)}
        />
        <div
          className="cursor-pointer text-slate-600 hover:text-orange-500 fixed top-4 right-4"
          onClick={() => setIsImgFullScreen(false)}
        >
          <DisabledByDefaultOutlinedIcon fontSize="large" color="inherit" />
        </div>
      </div>
      <div className="flex flex-wrap flex-row-3 bg-blue-50 justify-center gap-6 h-full p-4">
        {currentUserPictureList.map((item, index) => {
          return (
            <div
              className="w-1/4 p-8 flex justify-center flex-col max-h-96 bg-blue-50 bg-opacity-20 backdrop-blur-md shadow-xl hover:opacity-70 cursor-pointer"
              onClick={() => getYourImg(item.url)}
              key={`${index}-${item.url}`}
            >
              <div className="px-6 pt-6 text-center">{item.alt}</div>
              <img
                className="object-contain max-h-full max-w-full p-6"
                src={item.url}
                alt={item.alt}
              />
              <div className="pb-4 text-center">{}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
