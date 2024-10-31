import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../css/profile.css";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newPassword.length < 6) {
      setErrorMessage("Mật khẩu mới cần có ít nhất 6 ký tự.");
      setSuccessMessage("");
      return;
    }

    if (newPassword === oldPassword) {
      setErrorMessage("Mật khẩu mới không được trùng với mật khẩu cũ.");
      setSuccessMessage("");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      setSuccessMessage("");
      return;
    }

    const token = localStorage.getItem("token");
    const action = "changePassword";

    const response = await fetch("http://localhost:4000/updateUserInfo", {
      method: "POST",
      body: JSON.stringify({ action, oldPassword, newPassword }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const responseData = await response.json();

    // if (response.ok) {
    //   setSuccessMessage(responseData.message || "Đổi mật khẩu thành công!");
    //   setErrorMessage("");
    // } else {
    //   setErrorMessage(responseData.error || "Đổi mật khẩu thất bại.");
    //   setSuccessMessage("");
    // }

    if (response.ok) {
      setSuccessMessage("Đổi mật khẩu thành công!");
      setErrorMessage("");
    } else {
      setErrorMessage("Đổi mật khẩu thất bại.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="change-password-page">
      <h2>Đổi mật khẩu</h2>
      <form onSubmit={handleSubmit} className="change-password-form">
        <div className="form-group">
          <label>Mật khẩu cũ:</label>
          <div className="password-input">
            <input
              type={showOldPassword ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <span onClick={() => setShowOldPassword(!showOldPassword)}>
              {showOldPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <div className="form-group">
          <label>Mật khẩu mới (cần ít nhất 6 ký tự):</label>
          <div className="password-input">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <span onClick={() => setShowNewPassword(!showNewPassword)}>
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <div className="form-group">
          <label>Xác nhận mật khẩu mới:</label>
          <div className="password-input">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <button type="submit" className="confirm-button">
          Đổi mật khẩu
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
