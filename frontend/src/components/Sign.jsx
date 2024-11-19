"use client"; 

import "@fortawesome/fontawesome-free/css/all.min.css";
import { useEffect, useState } from "react";
import "../css/sign.css";
import images from "@/constants/images";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { signInWithPopup } from "firebase/auth";
import { googleProvider, auth } from "@/auth/firebase";

const Sign = ({ isSignin, closeModal, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(isSignin);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const defaultAvatars = [
    images.dog,
    images.fox,
    images.lion,
    images.gorrila,
    images.koala,
    images.rabbit,
    images.tiger,
    images.otter,
  ];

  const [isUsernameValid, setIsUsernameValid] = useState(null);
  const [usernameError, setUsernameError] = useState("");

  const [isEmailValid, setIsEmailValid] = useState(null);
  const [emailError, setEmailError] = useState("");

  const [isPasswordValid, setIsPasswordValid] = useState(null);
  const [passwordError, setPasswordError] = useState("");

  const resetInputs = () => {
    setUsername("");
    setPassword("");
    setEmail("");
    setIsUsernameValid(null);
    setUsernameError("");
    setIsEmailValid(null);
    setEmailError("");
    setIsPasswordValid(null);
    setPasswordError("");
  };

  const toggleToSignup = () => {
    resetInputs(); 
    setIsLogin(false); 
  };

  const toggleToSignin = () => {
    resetInputs();
    setIsLogin(true); 
  };

  //Random Avt
  const getRandomAvatar = () => {
    const randomIndex = Math.floor(Math.random() * defaultAvatars.length);
    return defaultAvatars[randomIndex];
  };

  // Logic for sign-in
  const handleSignin = async () => {
    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        // Lưu token và username vào localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", username);
        localStorage.setItem("avatar", data.avatar);
        alert("Đăng nhập thành công!");
        onLoginSuccess();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi khi đăng nhập:", error);
    }
  };

  // Logic for sign-up
  const handleSignup = async () => {
    if (!isUsernameValid || !isEmailValid || !isPasswordValid) {
      alert("Vui lòng nhập đầy đủ và chính xác thông tin.");
      return;
    }
    const randomAvatar = getRandomAvatar();
    try {
      const response = await fetch("http://localhost:4000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          avatar: randomAvatar.src,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.");
        toggleToSignin(); // Chuyển sang trang đăng nhập
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi khi đăng ký:", error);
    }
  };

  useEffect(() => {
    const closeSigninBtn = document.getElementById("close-signin-btn");
    const closeSignupBtn = document.getElementById("close-signup-btn");

    if (closeSigninBtn) {
      closeSigninBtn.addEventListener("click", () => {
        closeModal();
      });
    }

    if (closeSignupBtn) {
      closeSignupBtn.addEventListener("click", () => {
        closeModal();
      });
    }

    // Cleanup event listeners on component unmount
    return () => {
      if (closeSigninBtn) closeSigninBtn.removeEventListener("click", () => {});
      if (closeSignupBtn) closeSignupBtn.removeEventListener("click", () => {});
    };
  }, [closeModal]);

  // Kiểm tra tên đăng nhập real-time
  useEffect(() => {
    if (!isLogin) {
      const delayDebounceFn = setTimeout(async () => {
        if (username.trim() === "") {
          setIsUsernameValid(null);
          setUsernameError("");
        } else {
          try {
            const response = await fetch(
              "http://localhost:4000/check-username",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ username }),
              }
            );

            const data = await response.json();
            if (response.ok) {
              if (data.exists) {
                setIsUsernameValid(false);
                setUsernameError("Tên đăng nhập đã tồn tại.");
              } else {
                setIsUsernameValid(true);
                setUsernameError("");
              }
            } else {
              setIsUsernameValid(false);
              setUsernameError("Có lỗi xảy ra khi kiểm tra tên đăng nhập.");
            }
          } catch (error) {
            console.error("Error checking username:", error);
            setIsUsernameValid(false);
            setUsernameError("Có lỗi xảy ra khi kiểm tra tên đăng nhập.");
          }
        }
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [username, isLogin]);

  // Kiểm tra email real-time
  useEffect(() => {
    if (!isLogin) {
      const delayDebounceFn = setTimeout(async () => {
        if (email.trim() === "") {
          setIsEmailValid(null);
          setEmailError("");
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            setIsEmailValid(false);
            setEmailError("Email không hợp lệ.");
          } else {
            try {
              const response = await fetch(
                "http://localhost:4000/check-email",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ email }),
                }
              );

              const data = await response.json();
              if (response.ok) {
                if (data.exists) {
                  setIsEmailValid(false);
                  setEmailError("Email đã được sử dụng.");
                } else {
                  setIsEmailValid(true);
                  setEmailError("");
                }
              } else {
                setIsEmailValid(false);
                setEmailError("Có lỗi xảy ra khi kiểm tra email.");
              }
            } catch (error) {
              console.error("Error checking email:", error);
              setIsEmailValid(false);
              setEmailError("Có lỗi xảy ra khi kiểm tra email.");
            }
          }
        }
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [email, isLogin]);

  // Kiểm tra mật khẩu
  useEffect(() => {
    if (!isLogin) {
      if (password.trim() === "") {
        setIsPasswordValid(null);
        setPasswordError("");
      } else {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        if (!passwordRegex.test(password)) {
          setIsPasswordValid(false);
          setPasswordError(
            "Mật khẩu phải có tối thiểu 6 ký tự bao gồm cả chữ và số."
          );
        } else {
          setIsPasswordValid(true);
          setPasswordError("");
        }
      }
    }
  }, [password, isLogin]);

  const signInWithGoogle = async () => {
    try {
      // Sign in with Google
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google sign-in result:", result); // Debugging

      const user = result.user;

      // Get the Firebase ID token for the current user
      const token = await auth.currentUser.getIdToken();

      if (!token) {
        console.error("Failed to retrieve Firebase ID token.");
        alert("Đã xảy ra lỗi trong quá trình xác thực.");
        return;
      }

      console.log("Firebase ID token:", token); // Debugging

      // Store token and user info in localStorage
      localStorage.setItem("token", token); // Store Firebase token
      localStorage.setItem("username", user.displayName); // Store username
      localStorage.setItem("avatar", user.photoURL); // Store avatar URL
      alert("Đăng nhập thành công với Google!");
      onLoginSuccess();
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      alert("Đã xảy ra lỗi khi đăng nhập với Google.");
    }
  };

  return (
    <>
      {isLogin ? (
        <div id="signin-modal" className="signin-modal active">
          <div className="large-signin-box">
            <button id="close-signin-btn" className="close-btn">
              X
            </button>
            <div className="signin">
              <div className="signinBox">
                <h2>
                  <i className="fa-solid fa-right-to-bracket"></i>
                  Đăng nhập
                  <i className="fa-solid fa-heart"></i>
                </h2>
                <input
                  type="text"
                  placeholder="Tên đăng nhập/Email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)} // update input value
                />
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {showPassword ? (
                    <AiFillEyeInvisible
                      className="show-pass-icon"
                      onClick={() => setShowPassword(false)}
                    />
                  ) : (
                    <AiFillEye
                      className="show-pass-icon"
                      onClick={() => setShowPassword(true)}
                    />
                  )}
                </div>
                <input type="submit" value="Đăng nhập" onClick={handleSignin} />
                <div className="signin-group">
                  <a href="#" id="forgot-pass-link">
                    Quên mật khẩu
                  </a>
                  <a href="#" id="signup-link" onClick={toggleToSignup}>
                    Đăng ký
                  </a>
                </div>
                <div className="separator">
                  <span>Hoặc</span>
                </div>
                <div className="social-signin">
                  <button className="google-signin" onClick={signInWithGoogle}>
                    <i className="fab fa-google"></i> Đăng nhập với Google
                  </button>
                  {/* <button className="facebook-signin">
                    <i className="fab fa-facebook"></i> Đăng nhập với Facebook
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div id="signup-modal" className="signup-modal active">
          <div className="large-signup-box">
            <button id="close-signup-btn" className="close-btn">
              X
            </button>
            <div className="signup">
              <div className="signupBox">
                <h2>
                  <i className="fa-solid fa-right-to-bracket"></i>
                  Đăng ký
                  <i className="fa-solid fa-heart"></i>
                </h2>
                <div className="input-with-icon">
                  <input
                    type="text"
                    placeholder="Tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={
                      isUsernameValid === false
                        ? "invalid"
                        : isUsernameValid === true
                        ? "valid"
                        : ""
                    }
                  />
                  {isUsernameValid === true && (
                    <i className="fa fa-check-circle valid-icon"></i>
                  )}
                  {isUsernameValid === false && (
                    <i className="fa fa-times-circle invalid-icon"></i>
                  )}
                </div>
                {usernameError && (
                  <p className="error-message">{usernameError}</p>
                )}

                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={
                      isPasswordValid === false
                        ? "invalid"
                        : isPasswordValid === true
                        ? "valid"
                        : ""
                    }
                  />
                  {showPassword ? (
                    <AiFillEyeInvisible
                      className="show-pass-icon"
                      onClick={() => setShowPassword(false)}
                    />
                  ) : (
                    <AiFillEye
                      className="show-pass-icon"
                      onClick={() => setShowPassword(true)}
                    />
                  )}
                </div>
                {passwordError && (
                  <p className="error-message">{passwordError}</p>
                )}

                <div className="input-with-icon">
                  <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    className={
                      isEmailValid === false
                        ? "invalid"
                        : isEmailValid === true
                        ? "valid"
                        : ""
                    }
                  />
                  {isEmailValid === true && (
                    <i className="fa fa-check-circle valid-icon"></i>
                  )}
                  {isEmailValid === false && (
                    <i className="fa fa-times-circle invalid-icon"></i>
                  )}
                </div>
                {emailError && <p className="error-message">{emailError}</p>}

                <input type="submit" value="Đăng ký" onClick={handleSignup} />
                <div className="signup-group">
                  <p>
                    <span>Đã có tài khoản? </span>
                    <a href="#" id="signin-link" onClick={toggleToSignin}>
                      {" "}
                      Đăng nhập
                    </a>
                  </p>
                </div>
                <div className="separator">
                  <span>Hoặc</span>
                </div>
                <div className="social-signup">
                  <button className="google-signup">
                    <i className="fab fa-google"></i> Đăng ký với Google
                  </button>
                  {/* <button className="facebook-signup">
                    <i className="fab fa-facebook"></i> Đăng ký với Facebook
                  </button> */}
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
