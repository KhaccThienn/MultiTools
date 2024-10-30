import React, { useState, useEffect } from "react";

const UserInfo = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [initialData, setInitialData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    getUserInfo();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setInitialData({ name, email, phone });
  };

  const handleBack = () => {
    if (isDataChanged()) {
      const confirmLeave = window.confirm(
        "Các thay đổi vẫn chưa được lưu. Xác nhận trở về?"
      );
      if (confirmLeave) {
        setIsEditing(false);
        resetData();
      }
    } else {
      setIsEditing(false);
    }
  };

  const isDataChanged = () => {
    return (
      name !== initialData.name ||
      email !== initialData.email ||
      phone !== initialData.phone
    );
  };

  const resetData = () => {
    setName(initialData.name);
    setEmail(initialData.email);
    setPhone(initialData.phone);
  };

  const getUserInfo = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:4000/getUserInfo", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (response.ok) {
      const { email, username } = data;
      setName(username);
      setEmail(email);
      setInitialData({ name: username, email: email, phone: "" });
    } else {
      console.error("Error:", data.error);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:4000/updateUserInfo", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "updateUserInfo",
        newEmail: email,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Thông tin đã được cập nhật!");
      setIsEditing(false);
      setInitialData({ name, email, phone });
    } else {
      console.error("Error:", data.error);
      alert("Cập nhật thất bại, vui lòng thử lại.");
    }
  };

  return (
    <div>
      <h2 className="user-info-title">Thông tin cá nhân</h2>
      <div className="user-info-container">
        <div className="user-info-field">
          <label className="user-info-label">Tên:</label>
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="user-info-input"
            />
          ) : (
            <p className="user-info-value">{name}</p>
          )}
        </div>

        <div className="user-info-field">
          <label className="user-info-label">Email:</label>
          {isEditing ? (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="user-info-input"
            />
          ) : (
            <p className="user-info-value">{email}</p>
          )}
        </div>

        <div className="user-info-field">
          <label className="user-info-label">Số điện thoại:</label>
          {isEditing ? (
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="user-info-input"
            />
          ) : (
            <p className="user-info-value">{phone}</p>
          )}
        </div>
      </div>

      {isEditing ? (
        <>
          <div className="group-button">
            <button className="confirm-button" onClick={handleSave}>
              Xác nhận
            </button>
            <button className="back-button" onClick={handleBack}>
              Quay lại
            </button>
          </div>
        </>
      ) : (
        <button className="confirm-button" onClick={handleEditToggle}>
          Sửa
        </button>
      )}
    </div>
  );
};

export default UserInfo;
