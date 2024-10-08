import React, { useState } from 'react';
import '../css/profile.css';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Kiểm tra nếu mật khẩu mới và xác nhận mật khẩu không khớp
    if (newPassword !== confirmPassword) {
      setErrorMessage('Mật khẩu mới và xác nhận mật khẩu không khớp.');
      setSuccessMessage('');
      return;
    }
    //Lấy token xác định user
    const token = localStorage.getItem('token');
    const action = "changePassword";

    const response = await fetch('http://localhost:4000/updateUserInfo', {
      method: "POST",
      body: JSON.stringify({ action,oldPassword, newPassword }),
      headers: { 
        "Content-Type": "application/json", 
        "Authorization": `Bearer ${token}`,
      },
    });
    
    const responseData = await response.json(); // Lấy thông báo từ server

    if (response.ok) {
      setSuccessMessage(responseData.message || 'Đổi mật khẩu thành công!');
      setErrorMessage('');
    } else {
      setErrorMessage(responseData.error || 'Đổi mật khẩu thất bại.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="change-password-page">
      <h2>Đổi mật khẩu</h2>
      <form onSubmit={handleSubmit} className="change-password-form">
        <div className="form-group">
          <label>Mật khẩu cũ:</label>
          <input 
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Mật khẩu mới:</label>
          <input 
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Xác nhận mật khẩu mới:</label>
          <input 
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <button type="submit">Đổi mật khẩu</button>
      </form>
    </div>
  );
};

export default ChangePassword;
