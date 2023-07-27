import { useEffect } from "react";
import { onSnapshot, doc } from "@firebase/firestore";
import { Loader } from "../../Helpers/Loader";
import { LikedPhotos } from "../../Helpers/PhotoRepository";
import { usePhotoStore } from "../../Helpers/PhotoStore";
import { observer } from "mobx-react";
import Masonry from "@mui/lab/Masonry";
import { SinglePhotoPanel } from "./SinglePhotoPanel";
import ZoomInMapIcon from "@mui/icons-material/ZoomInMap";
import { Slider } from "./Slider";
import { fetchPictureList } from "../../Helpers/fetchPictureList";
import { useAuthStore } from "../Auth/AuthStore";
import { db } from "../../firebase";
import { ScrollArrow } from "./ScrollArrow";

export const Main = observer(() => {
  const photoStore = usePhotoStore();
  const authStore = useAuthStore();

  const currentUserMail: string =
    window.localStorage.getItem("user") ?? "no current user";

  const likedPhotosCollectionRef = doc(db, "Photos", currentUserMail);

  useEffect(() => {
    const unsubscribe = onSnapshot(likedPhotosCollectionRef, (doc) => {
      if (doc.data() !== undefined) {
        const newPhotoData = doc.data() as LikedPhotos;
        const likedPhotos = Object.values(newPhotoData);
        photoStore.setLikedPhotos(likedPhotos[0]);
      }
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
  }, [photoStore]);

  if (photoStore.isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex justify-center bg-blue-50 flex-col">
      <ScrollArrow />

      <div className="flex justify-end h-[15vh] items-center flex-col">
        <h1 className="font-body font-bold text-7xl italic drop-shadow-4xl text-blue-500 leading-4 z-10">
          ShowYourPicture
        </h1>
        <h1 className="font-body font-bold text-7xl italic drop-shadow-4xl rotate-180 -scale-x-1 bg-gradient-to-b from-blue-50 via-blue-200 to-blue-300 bg-clip-text text-transparent">
          ShowYourPicture
        </h1>
      </div>

      <div>
        <Slider />
      </div>

      <div className="flex justify-center">
        <div
          className={
            photoStore.isImgFullScreen
              ? "w-full min-h-screen fixed top-0 left-0 flex justify-center items-center bg-slate-900 bg-opacity-50 backdrop-blur-2xl shadow-xl z-10"
              : "hidden"
          }
        >
          <div className="h-5/6 relative">
            <img
              src={photoStore.tempImgURL}
              className="cursor-pointer max-h-screen"
              alt=""
              onClick={() => photoStore.setIsImgFullScreen(false)}
            />
            <div
              className="cursor-pointer text-blue-100 hover:text-blue-200 absolute top-2 right-2"
              onClick={() => photoStore.setIsImgFullScreen(false)}
            >
              <ZoomInMapIcon fontSize="large" color="inherit" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap bg-blue-50 justify-center w-11/12">
          <Masonry columns={4} spacing={2}>
            {photoStore.pictureList?.map((item, index) => {
              return (
                <div key={item.url} className=" bg-blue-100">
                  <SinglePhotoPanel
                    index={index}
                    item={item}
                    currentUserMail={authStore.currentUserMail}
                  />
                </div>
              );
            })}
          </Masonry>
        </div>
      </div>
    </div>
  );
});
