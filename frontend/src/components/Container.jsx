import "../css/app.css";
import Button from "./Button";

export default function Container({ image, rotate, colorbg, onClick }) {
  // Xác định hướng của hình ảnh và tiêu đề dựa trên rotate
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
          alignItems: "flex-end", // Căn bắt đầu để margin hoạt động
          justifyContent: "flex-start", // Căn bắt đầu để margin hoạt động
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
