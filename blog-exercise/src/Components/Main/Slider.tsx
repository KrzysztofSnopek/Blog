import { sliderImages } from "../../Helpers/SliderImages";

export const Slider = () => {
  return (
    <div className="h-96 m-auto relative w-11/12 grid place-items-center">
      <div className="flex w-[calc(384*20)]">
        {/* pierwsze slajdy */}
        {sliderImages.map((image) => {
          return (
            <div className="h-80 w-96 flex items-center p-4" key={image.id}>
              <img
                className="w-full"
                src={image.src}
                alt={`Image ${image.id}`}
              />
            </div>
          );
        })}

        {/* drugi raz slajdy */}
        {sliderImages.map((image) => {
          return (
            <div className="h-80 w-96 flex items-center p-4" key={image.id}>
              <img
                className="w-full"
                src={image.src}
                alt={`Image ${image.id}`}
              />
            </div>
          );
        })}
      </div>
      <div className="h-96 m-auto relative w-11/12 grid place-items-center"></div>
      <div className="flex w-[calc(384*20)]"></div>
      <div className="h-80 w-96 flex items-center p-4"></div>
    </div>
  );
};
