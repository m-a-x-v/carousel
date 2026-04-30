import { ImageCarousel } from "./components/ImageCarousel/ImageCarousel";
import { useImages } from "./hooks/useImages";

function App() {
  const { images, loading } = useImages(30);

  if (loading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  return (
    <div>
      <h1 style={{ padding: "20px" }}>Image Carousel</h1>
      <ImageCarousel images={images} />
    </div>
  );
}

export default App;