import { sliderImages } from "../../Helpers/SliderImages";

export const Slider = () => {
  return (
    <div className="h-96 m-auto relative w-11/12 grid place-items-center overflow-hidden before:bg-gradient-to-r before:from-blue-50 before:to-transparent before:h-full before:absolute before:w-1/6 before:z-10 before:left-0 before:top-0 after:bg-gradient-to-r after:from-blue-50 after:to-transparent after:h-full after:absolute after:w-1/6 after:z-10 after:top-0 after:-right-1 after:rotate-180">
      <div className="flex w-[calc(384*20)] animate-scrollToLeft hover:pause">
        {/* first set of slides */}
        {sliderImages.map((image) => {
          return (
            <div className="h-80 w-96 flex items-center p-4" key={image.id}>
              <img
                className="w-full hover:scale-125 transition duration-500"
                src={image.src}
                alt={`${image.id}`}
              />
            </div>
          );
        })}

        {/* second set of slides */}
        {sliderImages.map((image) => {
          return (
            <div className="h-80 w-96 flex items-center p-4" key={image.id}>
              <img
                className="w-full hover:scale-125"
                src={image.src}
                alt={`${image.id}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
