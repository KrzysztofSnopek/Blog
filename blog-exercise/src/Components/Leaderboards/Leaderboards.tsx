import { useState, useEffect } from "react";
import { doc, onSnapshot } from "@firebase/firestore";
import { db } from "../../firebase";
import { Loader } from "../../Helpers/Loader";
import { UploadedImage, LikedPhotos } from "../../Helpers/PhotoRepository";
import { usePhotoStore } from "../../Helpers/PhotoStore";
import { fetchPictureList } from "../../Helpers/fetchPictureList";
import { useAuthStore } from "../Auth/AuthStore";
import { LeadPhotoPanel } from "./LeadPhotoPanel";
import FavoriteIcon from "@mui/icons-material/Favorite";

export function Leaderboards() {
  const photoStore = usePhotoStore();
  const authStore = useAuthStore();

  const [likedPhotos, setLikedPhotos] = useState<LikedPhotos>();
  const [leadingPictureList, setLeadingPictureList] = useState<UploadedImage[]>(
    []
  );
  const [tempImgURL, setTempImgURL] = useState<string>("");

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
    setTempImgURL(leadingPictureList[0]?.url);
  }

  const getImgURLToDisplay = (imgUrl: string): void => {
    setTempImgURL(imgUrl);
  };

  return (
    <div className="flex flex-col content-end pt-6 bg-blue-50 h-[calc(100vh-5rem)]">
      <div className="flex max-w-[90vw] w-auto h-full m-auto">
        <div
          className="h-[65vh] w-[90vw] bg-contain bg-no-repeat bg-center relative"
          style={{ backgroundImage: `url(${tempImgURL}` }}
        >
          <div className="text-blue-100 absolute bottom-2 right-1/2 transform translate-x-1/2 flex z-10 bg-black p-4 opacity-80 rounded-full">
            <span className="font-bold text-4xl pr-1">
              {leadingPictureList[0]?.likeCount}
            </span>
            <FavoriteIcon fontSize="large" className="mt-1" />
          </div>
        </div>
      </div>
      <div className="bg-blue-50 flex m-auto p-4">
        {leadingPictureList.map((item, index) => {
          return (
            <div className="hover:cursor-pointer" key={`${index}-${item.url}`}>
              <div
                key={item.url}
                className="bg-blue-100"
                onClick={() => getImgURLToDisplay(item.url)}
              >
                <LeadPhotoPanel
                  index={index}
                  item={item}
                  currentUserMail={authStore.currentUserMail}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
