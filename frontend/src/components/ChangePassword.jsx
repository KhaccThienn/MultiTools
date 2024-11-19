import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../css/profile.css";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isNewPasswordValid, setIsNewPasswordValid] = useState(null);
  const [newPasswordError, setNewPasswordError] = useState("");

  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Kiểm tra mật khẩu mới real-time
  useEffect(() => {
    if (newPassword.trim() === "") {
      setIsNewPasswordValid(null);
      setNewPasswordError("");
    } else {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
      if (!passwordRegex.test(newPassword)) {
        setIsNewPasswordValid(false);
        setNewPasswordError(
          "Mật khẩu mới phải có tối thiểu 6 ký tự bao gồm cả chữ và số."
        );
      } else if (newPassword === oldPassword) {
        setIsNewPasswordValid(false);
        setNewPasswordError("Mật khẩu mới không được trùng với mật khẩu cũ.");
      } else {
        setIsNewPasswordValid(true);
        setNewPasswordError("");
      }
    }
  }, [newPassword, oldPassword]);

  // Kiểm tra xác nhận mật khẩu real-time
  useEffect(() => {
    if (confirmPassword.trim() === "") {
      setIsConfirmPasswordValid(null);
      setConfirmPasswordError("");
    } else {
      if (confirmPassword !== newPassword) {
        setIsConfirmPasswordValid(false);
        setConfirmPasswordError("Xác nhận mật khẩu không khớp.");
      } else {
        setIsConfirmPasswordValid(true);
        setConfirmPasswordError("");
      }
    }
  }, [confirmPassword, newPassword]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!oldPassword || !isNewPasswordValid || !isConfirmPasswordValid) {
      setErrorMessage("Vui lòng nhập đầy đủ và chính xác thông tin.");
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

    if (response.ok) {
      setSuccessMessage("Đổi mật khẩu thành công!");
      setErrorMessage("");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsNewPasswordValid(null);
      setIsConfirmPasswordValid(null);
    } else {
      setErrorMessage(responseData.error || "Đổi mật khẩu thất bại.");
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
              placeholder="Nhập mật khẩu cũ"
            />
            <span onClick={() => setShowOldPassword(!showOldPassword)}>
              {showOldPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <div className="form-group">
          <label>Mật khẩu mới (cần ít nhất 6 ký tự bao gồm cả chữ và số):</label>
          <div className="password-input">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="Nhập mật khẩu mới"
              className={
                isNewPasswordValid === false
                  ? "invalid"
                  : isNewPasswordValid === true
                  ? "valid"
                  : ""
              }
            />
            <span onClick={() => setShowNewPassword(!showNewPassword)}>
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {newPasswordError && (
            <p className="error-message">{newPasswordError}</p>
          )}
        </div>

        <div className="form-group">
          <label>Xác nhận mật khẩu mới:</label>
          <div className="password-input">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Xác nhận mật khẩu mới"
              className={
                isConfirmPasswordValid === false
                  ? "invalid"
                  : isConfirmPasswordValid === true
                  ? "valid"
                  : ""
              }
            />
            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {confirmPasswordError && (
            <p className="error-message">{confirmPasswordError}</p>
          )}
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
