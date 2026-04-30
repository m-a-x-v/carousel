import styles from "./ImageCarousel.module.css";

export interface CarouselImage {
  id: string;
  download_url: string;
  width: number;
  height: number;
}

interface Props {
  images: CarouselImage[];
}

export const ImageCarousel = ({ images }: Props) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.carousel}>
        {images.map((img) => {
          const aspectRatio = img.width / img.height;

          return (
            <div
              key={img.id}
              className={styles.item}
              style={{
                flex: `0 0 ${aspectRatio * 250}px`,
              }}
            >
              <img
                src={img.download_url}
                alt=""
                loading="lazy"
                className={styles.image}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};