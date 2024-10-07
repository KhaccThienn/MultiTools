import "../css/app.css";
import Button from "./Button";

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
        <img
          src={image}
          alt=""
          style={{
            marginRight: rotate === 0 ? "450px" : "0",
            marginLeft: rotate === 1 ? "450px" : "0",
            borderRadius: "10px",
          }}
        />
        <Button label="TRẢI NGHIỆM NGAY" onClick={onClick} />
      </div>
    </div>
  );
}
