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
  const [activePhoto, setActivePhoto] = useState<boolean[]>();

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
  if (pictureList.length > 6) {
    setPictureList(pictureList.slice(0, 6));
  }

  if (isLoading) {
    return <Loader />;
  }

  const getImg = (imgUrl: string) => {
    setTempImgURL(imgUrl);
    setIsImgFullScreen(true);
  };

  console.log(tempImgURL);

  const displayPhoto = (index: number) => {
    setActivePhoto([false]);
  };

  return (
    <div className="max-h-screen">
      <div className="rounded-2xl">
        <img className="object-cover m-auto p-8 " src={tempImgURL} alt="" />
      </div>

      <div className="grid grid-cols-6 bg-slate-400">
        {pictureList.map((item, index) => {
          return (
            <div
              className="w-1/8 flex justify-center items-center bg-slate-600 bg-opacity-20 backdrop-blur-md shadow-xl p-4"
              key={`${index}-${item.url}`}
            >
              <img
                className="min-h-full min-w-full hover:opacity-70 cursor-pointer object-cover rounded-2xl"
                src={item.url}
                alt={item.alt}
                onClick={() => getImg(item.url)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
