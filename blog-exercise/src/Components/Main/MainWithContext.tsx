import { useState, useEffect } from "react";
import { listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { onSnapshot } from "@firebase/firestore";
import { Loader } from "../../Helpers/Loader";
import { LikedPhotos, UploadedImage } from "../../Helpers/PhotoRepository";
import { usePhotoStore } from "../../Helpers/PhotoStore";
import { observer } from "mobx-react";
import {
  likedPhotosCollectionRef,
  pictureListRef,
} from "../../Helpers/StorageReferences";
import Masonry from "@mui/lab/Masonry";
import { SinglePhotoPanel } from "./SinglePhotoPanel";
import ZoomInMapIcon from "@mui/icons-material/ZoomInMap";
import { Slider } from "./Slider";

export const MainWithContext = observer(() => {
  const photoStore = usePhotoStore();

  const [isLoading, setIsLoading] = useState<boolean>(true);

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
    listAll(pictureListRef).then((response) => {
      const promises = response.items.map((item) =>
        Promise.all([getDownloadURL(item), getMetadata(item)])
      );

      Promise.all(promises).then((results) => {
        const imageData: UploadedImage[] = [];

        results.forEach(([url, metadata]) => {
          const alt = metadata?.customMetadata?.imageName ?? "";
          const likeCount = metadata.customMetadata.likeCount;
          const storagePathElement = metadata.customMetadata.storagePathElement;
          imageData.push({
            url,
            alt,
            storagePathElement,
            likeCount,
          });
        });

        photoStore.setPictureList(imageData);
        setIsLoading(false);
      });
    });
  }, [photoStore]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex justify-center bg-blue-50 flex-col">
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
                  <SinglePhotoPanel index={index} item={item} />
                </div>
              );
            })}
          </Masonry>
        </div>
      </div>
    </div>
  );
});
