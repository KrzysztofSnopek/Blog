import { useState, useEffect } from "react";
import { storage } from "../../firebase";
import { ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { doc, onSnapshot } from "@firebase/firestore";
import { auth, db } from "../../firebase";
import { Loader } from "../../Helpers/Loader";
import { UploadedImage, LikedPhotos } from "../../Helpers/PhotoRepository";
import DisabledByDefaultOutlinedIcon from "@mui/icons-material/DisabledByDefaultOutlined";
import { BsSuitHeartFill } from "react-icons/bs";

export function Leaderboards() {
  const [pictureList, setPictureList] = useState<UploadedImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isImgFullScreen, setIsImgFullScreen] = useState<boolean>(false);
  const [tempImgURL, setTempImgURL] = useState<string>("");
  const [likeNumber, setLikeNumber] = useState<number>(0);
  const pictureListRef = ref(storage, `projectFiles`);
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

  useEffect(() => {
    const imageData: UploadedImage[] = [];

    listAll(pictureListRef).then((response) => {
      const promises = response.items.map((item) =>
        Promise.all([getDownloadURL(item), getMetadata(item)])
      );

      Promise.all(promises).then((results) => {
        results.forEach(([url, metadata]) => {
          const alt = metadata?.customMetadata?.imageName ?? "";
          const likeCount = metadata.customMetadata.likeCount;
          const storagePathElement = metadata.customMetadata.storagePathElement;
          imageData.push({ url, alt, storagePathElement, likeCount });
        });

        setPictureList(imageData);
        setIsLoading(false);
      });
    });
  }, [likeNumber]);

  pictureList.sort(function (a, b) {
    return b.likeCount - a.likeCount;
  });
  if (pictureList.length > 5) {
    setPictureList(pictureList.slice(0, 5));
  }

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
        {pictureList.map((item, index) => {
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
                  <span>{item.likeCount}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
