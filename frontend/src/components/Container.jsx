import "../css/app.css";
import Button from "./Button";
import Image from "next/image";

export default function Container({
  image,
  rotate,
  colorbg,
  onClick,
  children,
}) {
  const flexDirection = rotate === 0 ? "row" : "row-reverse";

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${colorbg}, #fff)`,
        padding: "4em 0",
      }}
    >
      <div
        className="container"
        style={{
          flexDirection: flexDirection,
        }}
      >
        <div
          style={{
            width: "40%",
            position: "relative",
          }}
        >
          <Image
            className="container-image"
            src={image}
            alt="Hình ảnh"
          />
        </div>
        <div
          style={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "8em",
          }}
        >
          {children}
          <Button
            className="container-button"
            label="KHÁM PHÁ NGAY !"
            onClick={onClick}
          />
        </div>
      </div>
    </div>
  );
}
