import Navbar from "@/components/Navbar";
import Slideshow from "@/components/SlideShow";
import "../css/app.css"; // Import CSS từ file
import Container from "@/components/Container";
import Button from "@/components/Button";
import Footer from "@/components/Footer";

export default function HomePage() {

  // Dữ liệu của các slide (có thể là hình ảnh và tiêu đề)
  const slides = [
    { image: "https://via.placeholder.com/500x160", title: "Slide 1" },
    { image: "https://via.placeholder.com/500x160", title: "Slide 2" },
    { image: "https://via.placeholder.com/500x160", title: "Slide 3" },
    { image: "https://via.placeholder.com/500x160", title: "Slide 4" },
  ];

  const onClick = () => {
    console.log("Clicked");
  };

  return (
    <>
      <div className="head">
        <Navbar />
      </div>
      <div className="content">
        <Slideshow slides={slides} />
        <Container
          image="https://via.placeholder.com/500x500"
          rotate={0}
          colorbg="#6EE7B7"
          onClick={() => {
            window.location.href = "/EditImagePage"; // Điều hướng tới trang editImagePage
          }}
        />
        <Container
          image="https://via.placeholder.com/500x500"
          rotate={1}
          colorbg="#fff"
          onClick={onClick}
        />
        <Container
          image="https://via.placeholder.com/500x500"
          rotate={0}
          colorbg="#FCA5A5"
          onClick={onClick}
        />
        <Container
          image="https://via.placeholder.com/500x500"
          rotate={1}
          colorbg="#fff"
          onClick={onClick}
        />
        <Container
          image="https://via.placeholder.com/500x500"
          rotate={0}
          colorbg="#67E8F9"
          onClick={onClick}
        />
        <Container
          image="https://via.placeholder.com/500x500"
          rotate={1}
          colorbg="#fff"
          onClick={onClick}
        />
        <div
          style={{
            height: "200px",
            backgroundColor: "#5EEAD4",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button label="XEM CHI TIẾT" onClick={onClick} />
        </div>
        <div style={{ height: "20px", backgroundColor: "#D9D9D9" }}></div>
      </div>
      <Footer />
    </>
  );
}
