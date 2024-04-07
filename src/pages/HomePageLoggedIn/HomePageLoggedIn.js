import React from 'react';
import HomePageLoggedOut from "../HomePageLoggedOut/HomePageLoggedOut";
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";


function HomePageLoggedIn() {
    const { logout } = useUser();
    const navigate = useNavigate();

    const handleLogoutClick = async(event) => {
        event.preventDefault();
        logout();
        navigate('/');
    }


    return (
        <>
            <NavBar />
            <button onClick={handleLogoutClick}>Banana</button>
        </>
    );
}

export default HomePageLoggedIn;