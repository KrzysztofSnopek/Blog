import { useState, useEffect } from "react";
import { storage } from "../../firebase";
import { ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { auth } from "../../firebase";
import { Loader } from "../../Helpers/Loader";
import DisabledByDefaultOutlinedIcon from "@mui/icons-material/DisabledByDefaultOutlined";
import { UploadedImage } from "../../Helpers/PhotoRepository";

export function ViewYours() {
  const [pictureList, setPictureList] = useState<UploadedImage[]>([]);
  const [userName, setUserName] = useState<string | "unknown">("unknown");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isImgFullScreen, setIsImgFullScreen] = useState<boolean>(false);
  const [tempImgURL, setTempImgURL] = useState<string>("");

  const pictureListRef = ref(storage, `projectFiles`);

  const regex = /\/([^/-]+)_/;

  useEffect(() => {
    const imageData: UploadedImage[] = [];

    listAll(pictureListRef).then((response) => {
      const userName = auth.currentUser?.displayName ?? "unknown";
      setUserName(userName);

      const promises = response.items
        .filter((item) => item.fullPath.match(regex)?.at(1) === userName)
        .map((item) => Promise.all([getDownloadURL(item), getMetadata(item)]));

      Promise.all(promises).then((results) => {
        results.forEach(([url, metadata]) => {
          const alt = metadata?.customMetadata?.imageName ?? "";
          const storagePathElement = metadata.customMetadata.storagePathElement;
          const likeCount = metadata.customMetadata.likeCount;
          imageData.push({ url, alt, storagePathElement, likeCount });
        });

        setPictureList(imageData);
        setIsLoading(false);
      });
    });
  }, []);

  if (isLoading) {
    return <Loader />;
  }

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
        {pictureList.map((item, index) => {
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
