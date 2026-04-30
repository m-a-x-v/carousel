import { useEffect, useState } from "react";

export interface ImageItem {
  id: string;
  download_url: string;
  width: number;
  height: number;
}

export const useImages = (count: number = 20) => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(
          `https://picsum.photos/v2/list?page=1&limit=${count}`
        );
        const data = await res.json();
        setImages(data);
      } catch (err) {
        console.error("Failed to fetch images", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [count]);

  return { images, loading };
};