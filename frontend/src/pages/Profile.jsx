import React, { useState, useEffect } from 'react';
import '../css/profile.css'
import UserInfo from '../components/UserInfo'; 
import ChangePassword from '../components/ChangePassword';
import ChangeAvatar from '../components/ChangeAvatar';
export default function Profile() {
  
  const [activeIndex, setActiveIndex] = useState(0); //Mặc định là vào trang thông tin 
  const [username, setUsername] = useState(''); 
  const [avatar, setAvatar] = useState(''); 

  useEffect(() => {
    loadInfo();
  }, []);

  const handleClick = (index) => {
    setActiveIndex(index); 
  };
  
  const loadInfo = () => {
    const avatarUrl = localStorage.getItem('avatar');
    setAvatar(avatarUrl);
    setUsername(localStorage.getItem('username'));
  };
  
  // Callback function để cập nhật avatar khi người dùng thay đổi trong ChangeAvatar
  const handleAvatarChange = (newAvatar) => {
    setAvatar(newAvatar); // Cập nhật avatar trong Profile
  };

  const handleHomeClick = () => {
    // Chuyển hướng về trang chủ
    window.location.href = '/'; 
  };

  return (
    <div className="profile-page">
      <div className="home-button" style={{ position: 'absolute', top: '10px', left: '10px' }}>
        <button onClick={handleHomeClick} style={{ cursor: 'pointer', padding: '5px 10px', fontSize: '16px' }}>
        🏠
        </button>
      </div>
      <div className="sidebar">
        <div className='user-section'>
          <img 
            src={avatar}
            alt="User Avatar"
            onClick={() => handleClick(4)} 
            style={{ cursor: 'pointer', borderRadius: '50%' }}
          />
           <div className="edit-icon" >🖉</div>
          <span>{username}</span>
        </div>
        <ul className="menu">
      {['📝 Cập nhật thông tin cá nhân', '🖼️ Ảnh của tôi', '🔒 Đổi mật khẩu'].map((item, index) => (
        <li 
          key={index}
          className={activeIndex === index ? 'active' : ''} 
          onClick={() => handleClick(index)} 
        >
          <span>{item}</span>
        </li>
      ))}
    </ul>
      </div>
      <div className='main-content'>
        {activeIndex === 0 && <UserInfo />}
        {activeIndex === 2 && <ChangePassword />}
        {activeIndex === 4 && <ChangeAvatar onAvatarChange={handleAvatarChange} />}
      </div>
    </div>
  );
};

