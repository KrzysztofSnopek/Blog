import { useState } from "react";
import { UploadedImage } from "../../Helpers/PhotoRepository";
import { usePhotoStore } from "../../Helpers/PhotoStore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import ZoomInMapIcon from "@mui/icons-material/ZoomInMap";

interface ImageProps {
  item: UploadedImage;
  index: number;
}

export const SinglePhotoPanel = (props: ImageProps) => {
  const photoStore = usePhotoStore();

  const [display, setDisplay] = useState("hidden");

  const showButton = (e: any) => {
    e.preventDefault();
    setDisplay("absolute");
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
      className="m-4 bg-blue-100"
      key={`${props.index}-${props.item.url}`}
      onMouseEnter={(e) => showButton(e)}
      onMouseLeave={(e) => hideButton(e)}
    >
      <div className="relative">
        <img
          className="w-full h-auto min-h-1/5 hover:opacity-75 "
          src={props.item.url}
          alt={props.item.alt}
          // loading="lazy"
          onClick={() => getImg(props.item.url)}
        />

        <div
          className={`${display} flex-col content-between inset-0 font-bold text-xl h-full shadow-inner-top-bottom`}
        >
          <div className="text-blue-100 absolute top-1 right-1 flex">
            <span className="font-bold pr-1">{props.item.likeCount}</span>
            <FavoriteIcon fontSize="inherit" className="mt-1" />
          </div>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl text-slate-950">
            <span className="p-2 cursor-pointer flex">
              <span>{isPhotoURLLiked(props.item)}</span>
            </span>
          </div>

          <div className="absolute bottom-1 left-2 text-blue-100">
            {props.item.alt}
          </div>

          <div className="absolute bottom-1 right-2 text-blue-100">
            click to max
          </div>
        </div>
      </div>
    </div>
  );
};
