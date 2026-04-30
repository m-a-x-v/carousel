import { ImageCarousel } from "./components/ImageCarousel/ImageCarousel";
import { useImages } from "./hooks/useImages";
import "./index.css";

function App() {
  const { images, loading } = useImages(30);

  if (loading) {
    return <div className="center">Loading...</div>;
  }

  return (
    <div className="app">
      <h1 className="title">Image Carousel</h1>
      <ImageCarousel images={images} />
    </div>
  );
}

export default App;