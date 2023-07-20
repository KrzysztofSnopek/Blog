import { useEffect, useState } from "react";
import DisabledByDefaultOutlinedIcon from "@mui/icons-material/DisabledByDefaultOutlined";
import { usePhotoStore } from "../../Helpers/PhotoStore";
import { fetchPictureList } from "../../Helpers/fetchPictureList";
import { Loader } from "../../Helpers/Loader";
import { UploadedImage } from "../../Helpers/PhotoRepository";

export function ViewYours() {
  const photoStore = usePhotoStore();

  const [isImgFullScreen, setIsImgFullScreen] = useState<boolean>(false);
  const [tempImgURL, setTempImgURL] = useState<string>("");
  const [currentUserPictureList, setCurrentUserPictureList] = useState<
    UploadedImage[]
  >([]);

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

  console.log("first", photoStore.pictureList[0].storagePathElement);

  const getYourImg = (imgUrl: string) => {
    setTempImgURL(imgUrl);
    setIsImgFullScreen(true);
  };

  return (
    <div className="bg-slate-400">
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
      <div className="flex flex-wrap flex-row-3 bg-slate-400 justify-center gap-6">
        {photoStore.pictureList.map((item, index) => {
          return (
            <div
              className="w-1/4 p-8 flex justify-center flex-col max-h-96 bg-slate-600 bg-opacity-20 backdrop-blur-md shadow-xl hover:opacity-70 cursor-pointer"
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
}
