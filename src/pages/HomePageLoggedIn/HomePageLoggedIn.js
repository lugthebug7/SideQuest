import React from 'react';
import HomePageLoggedOut from "../HomePageLoggedOut/HomePageLoggedOut";
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import Carousel from "../../components/Carousel/Carousel";
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
        <div className="HomePageLoggedIn">
            <button onClick={handleLogoutClick}>{user.username}</button>
            <Carousel genre={1}/>
            <Carousel genre={2}/>
            <Carousel genre={3}/>
            <Carousel genre={4}/>
            <Carousel genre={5}/>
            <Carousel genre={6}/>
            <Carousel genre={7}/>
            <Carousel genre={8}/>
            <Carousel genre={9}/>
            <Carousel genre={10}/>
        </div>
    );
}

export default HomePageLoggedIn;