import "../css/app.css";
import Button from "./Button";
import Image from "next/image";

export default function Container({ image, rotate, colorbg, onClick }) {
  const flexDirection = rotate === 0 ? "row" : "row-reverse";

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${colorbg}, #fff)`,
        height: 600,
        padding: "50px 0",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          flexDirection: flexDirection,
          alignItems: "flex-end",
          justifyContent: "flex-start",
        }}
      >
        <Image
          src={image}
          alt="Hình ảnh"
          width={450} 
          height={450}
          style={{
            marginRight: rotate === 0 ? "450px" : "0",
            marginLeft: rotate === 1 ? "450px" : "0",
            borderRadius: "2em",
          }}
        />
        <Button label="TRẢI NGHIỆM NGAY" onClick={onClick} />
      </div>
    </div>
  );
}
