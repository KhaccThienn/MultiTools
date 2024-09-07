'use client'; // Đảm bảo rằng component này chạy trên client side

import '@fortawesome/fontawesome-free/css/all.min.css';
import { useEffect } from 'react';
import '../css/sign.css'; // Đảm bảo đường dẫn chính xác tới file CSS

const Sign = ({ isSignin, closeModal }) => {
  useEffect(() => {
    const closeSigninBtn = document.getElementById("close-signin-btn");
    const closeSignupBtn = document.getElementById("close-signup-btn");

    if (closeSigninBtn) {
      closeSigninBtn.addEventListener("click", () => {
        closeModal(); // Đóng modal khi nhấn nút đóng
      });
    }

    if (closeSignupBtn) {
      closeSignupBtn.addEventListener("click", () => {
        closeModal(); // Đóng modal khi nhấn nút đóng
      });
    }

    // Cleanup event listeners on component unmount
    return () => {
      if (closeSigninBtn) closeSigninBtn.removeEventListener("click", () => {});
      if (closeSignupBtn) closeSignupBtn.removeEventListener("click", () => {});
    };
  }, [closeModal]);

  return (
    <>
      {isSignin ? (
        <div id="signin-modal" className="signin-modal active">
          <div className="large-signin-box">
            <button id="close-signin-btn" className="close-btn">X</button>
            <div className="signin">
              <div className="signinBox">
                <h2>
                  <i className="fa-solid fa-right-to-bracket"></i>
                  Đăng nhập
                  <i className="fa-solid fa-heart"></i>
                </h2>
                <input type="text" placeholder="Tên đăng nhập/Email" />
                <input type="password" placeholder="Mật khẩu" />
                <input type="submit" value="Đăng nhập" />
                <div className="signin-group">
                  <a href="#" id="forgot-pass-link">Quên mật khẩu</a>
                  <a href="#" id="signup-link">Đăng ký</a>
                </div>
                <div className="separator">
                  <span>Hoặc</span>
                </div>
                <div className="social-signin">
                  <button className="google-signin">
                    <i className="fab fa-google"></i> Đăng nhập với Google
                  </button>
                  <button className="facebook-signin">
                    <i className="fab fa-facebook"></i> Đăng nhập với Facebook
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div id="signup-modal" className="signup-modal active">
          <div className="large-signup-box">
            <button id="close-signup-btn" className="close-btn">X</button>
            <div className="signup">
              <div className="signupBox">
                <h2>
                  <i className="fa-solid fa-right-to-bracket"></i>
                  Đăng ký
                  <i className="fa-solid fa-heart"></i>
                </h2>
                <input type="text" placeholder="Tên đăng nhập" />
                <input type="password" placeholder="Mật khẩu" />
                <input type="text" placeholder="Email" />
                <input type="submit" value="Đăng ký" />
                <div className="signup-group">
                  <p>
                    <span>Đã có tài khoản? </span>
                    <a href="#" id="signin-link"> Đăng nhập</a>
                  </p>
                </div>
                <div className="separator">
                  <span>Hoặc</span>
                </div>
                <div className="social-signup">
                  <button className="google-signup">
                    <i className="fab fa-google"></i> Đăng ký với Google
                  </button>
                  <button className="facebook-signup">
                    <i className="fab fa-facebook"></i> Đăng ký với Facebook
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sign;
