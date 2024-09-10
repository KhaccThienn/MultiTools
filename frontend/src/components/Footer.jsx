import React from "react";
import Image from "next/image";
import "../css/app.css";
import images from "@/constants/images";
import "@fortawesome/fontawesome-free/css/all.min.css";
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer1">
        <div className="logo-section">
          <Image
            src={images.logo}
            alt="logo"
            width={60}
            height={60}
            className="navbar-logo"
          />
          <h1 className="tommorrow_font">MULTITOOLS</h1>
        </div>
        <div className="links-section"></div>
        <div className="links-section"></div>
        <div className="contact-section">
          <div className="contact-info">
            <p>Liên Hệ với chúng tôi</p>
            <i className="fab fa-facebook"></i>
            <i className="fab fa-google-plus"></i>
          </div>
        </div>
      </div>
      <div className="footer2">
        <div className="copy-right">
          <p>Copyright 2024 MultiTools. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// const styles = {
//   footer: {
//     height: '600px',
//     fontSize: "16px",
//   },
//   footer1: {
//     margin: '20px',
//     height: '400px',
//     paddingTop: '10px',
//     display: 'flex',
//     justifyContent: 'space-around',

//   },
//   logoSection: {
//     width:"20%",
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'flex-start',
//     position: 'relative',
//   },
//   linksSection: {
//     width:"250px",
//     backgroundColor: '#D3D3D3',
//   },
//   contactSection: {
//     width:"310px",
//     backgroundColor: '#D3D3D3',
//     height: '175px',
//   },
//   footer2: {
//     height: '200px',
//     display: 'flex',
//     margin: '0 auto',
//     backgroundColor: '#fff',
//     color: '#333',
//     borderTop: '3px solid #333',
//   },
//   copyRight: {
//     textAlign: 'center',
//     flex: '1',
//     fontWeight: 'bold',
//   },
//   logoImg: {
//     width: '60%',
//   },
//   contactInfo: {
//       margin: '10px',
//   }
// };

export default Footer;
