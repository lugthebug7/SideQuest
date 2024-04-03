import React from 'react';
import './App.css';
import './pages/HomePageLoggedOut/HomePageLoggedOut.css';
import HomePageLoggedOut from "./pages/HomePageLoggedOut/HomePageLoggedOut";
import HomePageLoggedIn from "./pages/HomePageLoggedIn/HomePageLoggedIn";


function App() {
    const loggedIn = false;

    return (loggedIn ? <HomePageLoggedIn /> : <HomePageLoggedOut />);
}

export default App;
