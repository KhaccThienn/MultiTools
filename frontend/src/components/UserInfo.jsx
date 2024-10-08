import React, { useState, useEffect} from 'react';

const UserInfo = () => {
  // Giá trị mặc định ban đầu cho các thông tin cá nhân
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const [isEditing, setIsEditing] = useState(false); // Trạng thái để kiểm soát chế độ sửa

  useEffect(() => {
    getUserInfo();
  }, []);

  // Xử lý khi nhấn nút Sửa/Xác nhận
  const handleEditToggle = () => {
    if (isEditing) {
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  // Lấy thông tin từ server
  const getUserInfo = async () => {
    const token = localStorage.getItem('token'); // Lấy token từ localStorage
    console.log(token);
    const response = await fetch('http://localhost:4000/getUserInfo', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Gửi token qua header
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (response.ok) {
      const {email, username } = data;
      console.log(email, username)
      setName(username);
      setEmail(email);
    } else {
      console.error('Error:', data.error); // Hiển thị lỗi nếu có
    }
  }

  //Sửa thông tin 
  const handleSave = async () => {
    const token = localStorage.getItem('token'); // Lấy token từ localStorage

    const response = await fetch('http://localhost:4000/updateUserInfo', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'updateUserInfo', 
        //Các trường sửa, bổ sung nếu cần
        newEmail: email,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      alert('Thông tin đã được cập nhật!');
      setIsEditing(false); // Thoát khỏi chế độ sửa
    } else {
      console.error('Error:', data.error); // Hiển thị lỗi nếu có
      alert('Cập nhật thất bại, vui lòng thử lại.');
    }
  };

  return (
    <div>
      <h2>Thông tin cá nhân</h2>
      <div className="user-info-container">
        {/* Phần key */}
        <div className="user-info-key">
          <p>Tên:</p>
          <p>Email:</p>
          <p>Địa chỉ:</p>
        </div>
        
        {/* Phần value */}
        <div className="user-info-value">
          {isEditing ? (
            <input
              type="text"
              value={name}
            />
          ) : (
            <p>{name}</p>
          )}

          {isEditing ? (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          ) : (
            <p>{email}</p>
          )}

          {isEditing ? (
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          ) : (
            <p>Viet Nam</p>
          )}
        </div>
      </div>
      <button onClick={isEditing ? handleSave : handleEditToggle}>
        {isEditing ? 'Xác nhận' : 'Sửa'}
      </button>
    </div>
  );
};

export default UserInfo;
