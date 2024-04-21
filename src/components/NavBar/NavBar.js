import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import { useUser } from '../../contexts/UserContext';

const Navbar = () => {

  const { user } = useUser();
  console.log("Logged in user details:", user);


  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/home" className="navbar-logo">
          SideQuest
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            {user?.admin ? (
            <Link to="/createquestadmin" className="nav-links">admin</Link> ) :
            (<Link to="/" className="nav-links">not admin</Link>)
            }
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