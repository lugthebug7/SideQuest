import React from 'react';
import './App.css';
import './pages/HomePageLoggedOut/HomePageLoggedOut.css';
import HomePageLoggedOut from "./pages/HomePageLoggedOut/HomePageLoggedOut";
import HomePageLoggedIn from "./pages/HomePageLoggedIn/HomePageLoggedIn";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider, useUser } from './contexts/UserContext';


function AppWrapper() {
    return (
        <UserProvider>
            <div className="App">
                <App />
            </div>
        </UserProvider>
    );
}

function App() {
    return (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePageLoggedOut />} />
            <Route path="/home" element={<HomePageLoggedIn />} />
          </Routes>
        </BrowserRouter>
    );
}

export default AppWrapper;
