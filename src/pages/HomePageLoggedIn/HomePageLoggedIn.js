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
            <Carousel genre={1} user={user}/>
            <Carousel genre={2} user={user}/>
            <Carousel genre={3} user={user}/>
            <Carousel genre={4} user={user}/>
            <Carousel genre={5} user={user}/>
            <Carousel genre={6} user={user}/>
            <Carousel genre={7} user={user}/>
            <Carousel genre={8} user={user}/>
            <Carousel genre={9} user={user}/>
            <Carousel genre={10} user={user}/>
        </div>
    );
}

export default HomePageLoggedIn;