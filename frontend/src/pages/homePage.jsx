import Navbar from "@/components/Navbar";
import Slideshow from "@/components/SlideShow";

export default function HomePage() {
  // Dữ liệu của các slide (có thể là hình ảnh và tiêu đề)
  const slides = [
    { image: "https://via.placeholder.com/500x200", title: "Slide 10" },
    { image: "https://via.placeholder.com/500x200", title: "Slide 2" },
    { image: "https://via.placeholder.com/500x200", title: "Slide 3" },
    { image: "https://via.placeholder.com/500x200", title: "Slide 4" },
  ];

  return (
    <div>
      <Navbar />
      <Slideshow slides={slides} />
    </div>
  );
}
