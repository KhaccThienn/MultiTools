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
        padding: "3em 0",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          flexDirection: flexDirection,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Image
          src={image}
          alt="Hình ảnh"
          width={450}
          height={450}
          style={{
            borderRadius: "2em",
            boxShadow: "8px 8px 16px rgba(0, 0, 0, 0.2)",
          }}
        />
        <div
          style={{
            width: "600px",
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
