import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          SideQuest
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">Create</Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-links">Community</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;