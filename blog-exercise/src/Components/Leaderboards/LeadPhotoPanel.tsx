import { useState } from "react";
import { UploadedImage } from "../../Helpers/PhotoRepository";
import FavoriteIcon from "@mui/icons-material/Favorite";

export interface ImageProps {
  item: UploadedImage;
  index: number;
  currentUserMail: string;
}

export const LeadPhotoPanel: React.FC<ImageProps> = ({ item, index }) => {
  const [display, setDisplay] = useState("hidden");

  const showButton = (e: any) => {
    e.preventDefault();
    setDisplay("absolute");
  };

  const hideButton = (e: any) => {
    e.preventDefault();
    setDisplay("hidden");
  };

  return (
    <div
      className="m-auto bg-blue-100 w-[15vw]"
      key={`${index}-${item.url}`}
      onMouseEnter={(e) => showButton(e)}
      onMouseLeave={(e) => hideButton(e)}
    >
      <div
        className="relative bg-cover bg-center w-full h-[20vh] hover:opacity-75 hover:cursor-pointer"
        style={{ backgroundImage: `url(${item.url}` }}
      >
        <div
          className={`${display} flex-col content-between inset-0 font-bold text-xl h-full shadow-inner-top-bottom`}
        >
          <div className="text-blue-100 absolute bottom-1 right-2 flex">
            <span className="font-bold pr-1">{item.likeCount}</span>
            <FavoriteIcon fontSize="inherit" className="mt-1" />
          </div>
        </div>
      </div>
    </div>
  );
};
