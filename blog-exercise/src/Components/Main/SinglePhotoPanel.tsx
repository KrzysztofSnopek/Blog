import { useState } from "react";
import { UploadedImage } from "../../Helpers/PhotoRepository";
import { usePhotoStore } from "../../Helpers/PhotoStore";

interface ImageProps {
  item: UploadedImage;
  index: number;
}

export const SinglePhotoPanel = (props: ImageProps) => {
  const photoStore = usePhotoStore();

  const [display, setDisplay] = useState("hidden");

  const showButton = (e: any) => {
    e.preventDefault();
    setDisplay("block");
  };

  const hideButton = (e: any) => {
    e.preventDefault();
    setDisplay("hidden");
  };

  const getImg = (imgUrl: string) => {
    photoStore.setTempImgURL(imgUrl);
    photoStore.setIsImgFullScreen(true);
  };

  const isPhotoURLLiked = (item: UploadedImage): JSX.Element => {
    if (
      Array.isArray(photoStore.likedPhotos) &&
      photoStore.likedPhotos.includes(item.url)
    ) {
      return <div>{photoStore.ClickToDislike(item)}</div>;
    } else {
      return <div>{photoStore.ClickToLike(item)}</div>;
    }
  };

  return (
    <div
      className="w-1/4 p-8 flex justify-center flex-col max-h-96 bg-slate-600 bg-opacity-20 backdrop-blur-md shadow-xl "
      key={`${props.index}-${props.item.url}`}
      onMouseEnter={(e) => showButton(e)}
      onMouseLeave={(e) => hideButton(e)}
    >
      <div className={display}>{props.item.alt}</div>
      <img
        className="object-contain max-h-full max-w-full p-6 hover:opacity-70 cursor-pointer"
        src={props.item.url}
        alt={props.item.alt}
        // loading="lazy"
        onClick={() => getImg(props.item.url)}
      />
      <div className="pb-8 text-xl text-slate-950 fixed -right-4 flex flex-col items-center">
        <span className="p-2 cursor-pointer">
          <span className="">{isPhotoURLLiked(props.item)}</span>
          <span>{props.item.likeCount}</span>
        </span>
      </div>
    </div>
  );
};
