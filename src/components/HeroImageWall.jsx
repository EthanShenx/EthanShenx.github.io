import { memo } from "react";
import { heroCardImages } from "../generated/hero-card-images";

const COLUMN_COUNT = 4;
const COLUMN_DURATIONS = [18, 23, 20, 28];

const imageColumns = Array.from({ length: COLUMN_COUNT }, () => []);
heroCardImages.forEach((image, index) => {
  imageColumns[index % COLUMN_COUNT].push(image);
});

const MarqueeColumn = memo(function MarqueeColumn({
  columnIndex,
  duration,
  images,
  reverse,
}) {
  return (
    <div className="hero-image-wall__column min-w-0 overflow-hidden">
      <div
        className={`hero-image-wall__track${reverse ? " hero-image-wall__track--reverse" : ""}`}
        style={{ "--hero-wall-duration": `${duration}s` }}
      >
        {[0, 1].map((copyIndex) => (
          <div
            className="hero-image-wall__sequence flex flex-col gap-0"
            key={copyIndex}
          >
            {images.map((image, imageIndex) => (
              <img
                className="hero-image-wall__image block w-full object-cover"
                src={image}
                alt=""
                aria-hidden="true"
                decoding="async"
                draggable="false"
                fetchPriority={imageIndex === 0 && copyIndex === 0 ? "high" : "auto"}
                key={`${columnIndex}-${copyIndex}-${image}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
});

export function HeroImageWall() {
  return (
    <div className="hero-image-wall absolute inset-0 grid grid-cols-4 gap-0 overflow-hidden">
      {imageColumns.map((images, columnIndex) => (
        <MarqueeColumn
          columnIndex={columnIndex}
          duration={COLUMN_DURATIONS[columnIndex]}
          images={images}
          key={columnIndex}
          reverse={columnIndex % 2 === 1}
        />
      ))}
    </div>
  );
}
