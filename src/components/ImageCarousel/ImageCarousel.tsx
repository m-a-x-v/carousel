import { useEffect, useMemo, useRef } from "react";
import styles from "./ImageCarousel.module.css";

const HEIGHT = 250;
const GAP = 16;
const CLONE_PX = 2000;

export interface ImageItem {
  id: string;
  download_url: string;
  width: number;
  height: number;
}

const imgW = (img: ImageItem) => (img.width / img.height) * HEIGHT;

const imgSrc = (img: ImageItem) => {
  const w = Math.round(imgW(img) * 2);
  const h = HEIGHT * 2;
  return `https://picsum.photos/id/${img.id}/${w}/${h}`;
};

export function ImageCarousel({ images }: { images: ImageItem[] }) {
  const ref = useRef<HTMLDivElement>(null);

  const { all, cloneStartW, realW } = useMemo(() => {
    if (!images.length) return { all: [], cloneStartW: 0, realW: 0 };

    const endClones: ImageItem[] = [];
    let w = 0;
    for (let i = images.length - 1; i >= 0 && w < CLONE_PX; i--) {
      endClones.unshift(images[i]);
      w += imgW(images[i]) + GAP;
    }

    const startClones: ImageItem[] = [];
    w = 0;
    for (let i = 0; i < images.length && w < CLONE_PX; i++) {
      startClones.push(images[i]);
      w += imgW(images[i]) + GAP;
    }

    return {
      all: [...endClones, ...images, ...startClones],
      cloneStartW: endClones.reduce((s, img) => s + imgW(img) + GAP, 0),
      realW: images.reduce((s, img) => s + imgW(img) + GAP, 0),
    };
  }, [images]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !realW) return;

    el.scrollLeft = cloneStartW;

    const onScroll = () => {
      if (el.scrollLeft < cloneStartW) el.scrollLeft += realW;
      else if (el.scrollLeft >= cloneStartW + realW) el.scrollLeft -= realW;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      el.scrollLeft += e.deltaX || e.deltaY;
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("wheel", onWheel);
    };
  }, [cloneStartW, realW]);

  if (!all.length) return null;

  return (
    <div ref={ref} className={styles.track}>
      {all.map((img, i) => (
        <img
          key={i}
          src={imgSrc(img)}
          loading="lazy"
          decoding="async"
          draggable={false}
          style={{ height: HEIGHT, width: imgW(img), flexShrink: 0, borderRadius: 12, objectFit: "cover" }}
        />
      ))}
    </div>
  );
}
