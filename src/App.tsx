import { ImageCarousel } from "./components/ImageCarousel/ImageCarousel";
import { CarouselSkeleton } from "./components/ImageCarousel/CarouselSkeleton";
import { useImages } from "./hooks/useImages";
import "./index.css";

function App() {
  const { images, loading } = useImages(30);

  return (
    <div className="app">
      <h1 className="title">Image Carousel</h1>
      {loading ? <CarouselSkeleton /> : <ImageCarousel images={images} />}
    </div>
  );
}

export default App;
