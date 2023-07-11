import { sliderImages } from "../../Helpers/SliderImages";

export const Slider = () => {
  return (
    <div className="slider">
      <div className="slide-track">
        {/* pierwsze slajdy */}
        {sliderImages.map((image) => {
          return (
            <div className="slide" key={image.id}>
              <img src={image.src} alt={`Image ${image.id}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
