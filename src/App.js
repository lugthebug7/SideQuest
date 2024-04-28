import React from 'react';
import './App.css';
import './pages/HomePageLoggedOut/HomePageLoggedOut.css';
import HomePageLoggedOut from "./pages/HomePageLoggedOut/HomePageLoggedOut";
import HomePageLoggedIn from "./pages/HomePageLoggedIn/HomePageLoggedIn";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider, useUser } from './contexts/UserContext';
import ProtectedRoutes from './ProtectedRoutes';
import 'bootstrap/dist/css/bootstrap.min.css';
import CreateQuestAdmin from "./pages/CreateQuestAdmin/CreateQuestAdmin";
import NavBar from "./components/NavBar/NavBar";


function AppWrapper() {
    return (
        <UserProvider>
            <div className="App">
                <App/>
            </div>
        </UserProvider>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePageLoggedOut/>}/>
                <Route path="/home" element={
                    <ProtectedRoutes>
                        <NavBar/>
                        <div id="modal-root">
                            <HomePageLoggedIn/>
                        </div>
                    </ProtectedRoutes>
                }/>
                <Route path="/createquestadmin" element={
                    <ProtectedRoutes>
                        <NavBar/>
                        <CreateQuestAdmin/>
                    </ProtectedRoutes>
                }/>

            </Routes>

        </BrowserRouter>

    );
}

export default AppWrapper;
