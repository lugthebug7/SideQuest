import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import { useUser } from '../../contexts/UserContext';

const directory1 = "http://localhost:5001/uploads/profilePics/";

const Navbar = () => {
  const { user } = useUser();
  console.log("Logged in user details:", user);
  console.log(directory1 + user?.profilePic)


  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/home" className="navbar-logo">
          SideQuest
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            {user?.admin ? (
            <Link to="/createquestadmin" className="nav-links">Create</Link> ) :
            (<Link to="/" className="nav-links">not admin</Link>)
            }
          </li>
          <li className="profile-pic-item">
            <Link to="/profilepage" className="nav-links">
              <img className="profile-pic" src={directory1 + user?.profilePic} alt="Profile Pic"/>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;