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
    setDisplay("flex");
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
      className="p-4 relative bg-blue-100"
      key={`${props.index}-${props.item.url}`}
      onMouseEnter={(e) => showButton(e)}
      onMouseLeave={(e) => hideButton(e)}
    >
      <div
        className={`${display} absolute inset-0 items-center justify-center z-10 font-bold text-xl`}
      >
        {props.item.alt}
        <div className="pb-8 text-xl text-slate-950 flex flex-col items-center">
          <span className="p-2 cursor-pointer">
            <span>{isPhotoURLLiked(props.item)}</span>
            <span className="font-bold">{props.item.likeCount}</span>
          </span>
        </div>
      </div>

      <img
        className="w-full h-auto hover:opacity-75"
        src={props.item.url}
        alt={props.item.alt}
        // loading="lazy"
        onClick={() => getImg(props.item.url)}
      />
    </div>
  );
};
