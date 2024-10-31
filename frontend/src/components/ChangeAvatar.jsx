import React, { useState } from "react";
import "../css/profile.css";
import Image from "next/image";
import images from "@/constants/images";

const ChangeAvatar = ({ onAvatarChange, onBack }) => {
  const [avatar, setAvatar] = useState(localStorage.getItem("avatar"));
  const [initialAvatar, setInitialAvatar] = useState(
    localStorage.getItem("avatar")
  );

  // Danh sách các ảnh đại diện mặc định
  const defaultAvatars = [
    images.koala,
    images.dog,
    images.fox,
    images.lion,
    images.gorrila,
    images.rabbit,
    images.tiger,
    images.otter,
  ];

  // Hàm xử lý khi người dùng chọn ảnh mới
  const handleAvatarChange = (imageUrl) => {
    setAvatar(imageUrl);
  };

  // Lưu ảnh khi bấm confirm
  const handleConfirm = async () => {
    localStorage.setItem("avatar", avatar);
    setInitialAvatar(avatar);
    onAvatarChange(avatar);

    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:4000/updateUserInfo", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "changeAvatar",
          newAvatar: avatar,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Cập nhật avatar thành công!");
      } else {
        alert("Lỗi khi cập nhật avatar");
        console.error("Lỗi:", data.error);
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Đã xảy ra lỗi!");
    }
  };

  // Hàm xử lý khi người dùng nhấn "Trở về"
  const handleBack = () => {
    if (avatar !== initialAvatar) {
      const confirmLeave = window.confirm(
        "Các thay đổi vẫn chưa được lưu. Xác nhận trở về?"
      );
      if (confirmLeave) {
        onBack();
      }
    } else {
      onBack();
    }
  };

  return (
    <div>
      <div className="avatar-edit-options">
        <h3>Chọn ảnh đại diện:</h3>
        <Image
          src={avatar}
          alt="Selected Avatar"
          width={100}
          height={100}
          className="selected-avatar"
        />
        <div className="list-default-avatars">
          {defaultAvatars.map((src, index) => (
            <div key={index} style={{ display: "inline-block", margin: "5px" }}>
              <Image
                src={src}
                alt="Avatar Option"
                width={80}
                height={80}
                className="default-avatar"
                style={{ cursor: "pointer", borderRadius: "50%" }}
                onClick={() => handleAvatarChange(src.src)}
              />
            </div>
          ))}
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            handleAvatarChange(URL.createObjectURL(e.target.files[0]))
          }
        />
        <div className="group-button">
          <button className="confirm-button" onClick={handleConfirm}>
            Xác nhận
          </button>
          <button className="back-button" onClick={handleBack}>
            Trở về
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeAvatar;
