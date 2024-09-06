import React from 'react';
import '../css/app.css';

function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="navbar-logo">MyWebsite</h1>
      <ul className="navbar-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  );
}

function App() {
  return (
    <div className="App">
      <Navbar />
      <header className="App-header">
        <h2>Welcome to My Website!</h2>
      </header>
    </div>
  );
}

export default App;
