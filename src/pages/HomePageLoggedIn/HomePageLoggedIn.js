import React from 'react';
import HomePageLoggedOut from "../HomePageLoggedOut/HomePageLoggedOut";
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import './HomePageLoggedIn.css';


function HomePageLoggedIn() {
    const { logout } = useUser();
    const navigate = useNavigate();
    const{ user } = useUser();

    const handleLogoutClick = async(event) => {
        event.preventDefault();
        logout();
        navigate('/');
    }



    return (
        <>
            <NavBar />
            <div className="HomePageLoggedIn">
                <button onClick={handleLogoutClick}>{user.username}</button>
            </div>
        </>
    );
}

export default HomePageLoggedIn;