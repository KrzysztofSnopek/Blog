import { useState } from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

export const ScrollArrow = () => {
  const [showButton, setShowButton] = useState<boolean>(false);

  const checkIfScrollTop = (): void => {
    if (window.scrollY > 200) {
      setShowButton(true);
    } else if (window.scrollY <= 200) {
      setShowButton(false);
    }
  };

  const scrollTop = (): void => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  window.addEventListener("scroll", checkIfScrollTop);

  return (
    <div>
      {showButton && (
        <ArrowUpwardIcon
          className="fixed bottom-8 right-6 z-10 hover:cursor-pointer text-blue-500 bg-blue-50 rounded-full outline hover:text-blue-700 hover:bg-blue-100"
          fontSize="large"
          color="inherit"
          onClick={scrollTop}
        />
      )}
    </div>
  );
};
