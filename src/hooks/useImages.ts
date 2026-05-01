import { useEffect, useState } from "react";

export interface ImageItem {
  id: string;
  download_url: string;
  width: number;
  height: number;
}

const fetchImages = (count: number) =>
  fetch(`https://picsum.photos/v2/list?page=1&limit=${count}`).then(
    (r) => r.json() as Promise<ImageItem[]>
  );

export const useImages = (count: number = 30) => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        // Small initial batch renders the carousel fast
        const initial = await fetchImages(Math.min(10, count));
        if (!alive) return;
        setImages(initial);
        setLoading(false);

        // Full set loads quietly in the background
        if (count > 10) {
          const full = await fetchImages(count);
          if (!alive) return;
          setImages(full);
        }
      } catch (err) {
        console.error(err);
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [count]);

  return { images, loading };
};
