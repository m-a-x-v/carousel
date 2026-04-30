import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./ImageCarousel.module.css";

interface ImageItem {
  id: string;
  download_url: string;
  width: number;
  height: number;
}

interface Props {
  images: ImageItem[];
}

const ITEM_HEIGHT = 250;

export const ImageCarousel = ({ images }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [virtualX, setVirtualX] = useState(0);
  const isDragging = useRef(false);
  const lastX = useRef(0);

  const widths = useMemo(() => {
    return images.map((img) => (img.width / img.height) * ITEM_HEIGHT);
  }, [images]);

  const totalWidth = useMemo(() => {
    return widths.reduce((a, b) => a + b, 0);
  }, [widths]);

  const visibleItems = useMemo(() => {
    if (!containerRef.current) return [];

    const viewportWidth = containerRef.current.clientWidth;
    const items: {
      img: ImageItem;
      x: number;
      width: number;
      key: string;
    }[] = [];

    let x = -virtualX;

    let i = 0;
    while (x < viewportWidth) {
      const index = i % images.length;
      const width = widths[index];

      items.push({
        img: images[index],
        x,
        width,
        key: `${images[index].id}-${i}`,
      });

      x += width;
      i++;
    }

    return items;
  }, [virtualX, images, widths]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onDown = (e: MouseEvent) => {
      isDragging.current = true;
      lastX.current = e.clientX;
    };

    const onMove = (e: MouseEvent) => {
      if (!isDragging.current) return;

      const dx = e.clientX - lastX.current;
      lastX.current = e.clientX;

      setVirtualX((prev) => {
        let next = prev - dx;

        if (next < 0) next += totalWidth;
        if (next > totalWidth) next -= totalWidth;

        return next;
      });
    };

    const onUp = () => {
      isDragging.current = false;
    };

    container.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    return () => {
      container.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [totalWidth]);

  return (
    <div ref={containerRef} className={styles.wrapper}>
      <div className={styles.track}>
        {visibleItems.map(({ img, x, width, key }) => (
          <div
            key={key}
            className={styles.item}
            style={{
              transform: `translateX(${x}px)`,
              width: `${width}px`,
              height: `${ITEM_HEIGHT}px`,
            }}
          >
            <img
              src={img.download_url}
              alt=""
              draggable={false}
              className={styles.image}
            />
          </div>
        ))}
      </div>
    </div>
  );
};