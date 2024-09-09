import Navbar from "@/components/Navbar";
import Slideshow from "@/components/SlideShow";
import '../css/app.css'; // Import CSS từ file

export default function HomePage() {
  // Dữ liệu của các slide (có thể là hình ảnh và tiêu đề)
  const slides = [
    { image: "https://via.placeholder.com/640x250", title: "Slide 1" },
    { image: "https://via.placeholder.com/640x250", title: "Slide 2" },
    { image: "https://via.placeholder.com/640x250", title: "Slide 3" },
    { image: "https://via.placeholder.com/640x250", title: "Slide 4" },
  ];

  return (
    < > 
    <div className="head">
      <Navbar />
    </div>
    <div className="content">
      <Slideshow slides={slides} />
    </div>
    </>
  );
}
