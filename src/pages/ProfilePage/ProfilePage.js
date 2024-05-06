import React, {useState, useEffect} from 'react';
import HomePageLoggedOut from "../HomePageLoggedOut/HomePageLoggedOut";
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import Carousel from "../../components/Carousel/Carousel";
import './ProfilePage.css';
import QuestModal from "../../components/QuestModal/QuestModal";

const directory = "http://localhost:5001/uploads/";


function ProfilePage() {
    const [quests, setQuests] = useState([]);
    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuests = async () => {
            try {
                const response = await fetch('http://localhost:5001/populate/getUserQuests', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: user.username })
                });
                if (response.ok) {
                    const data = await response.json();
                    setQuests(data.user_quests);
                } else {
                    throw new Error('Failed to fetch quests');
                }
            } catch (error) {
                console.error('Error fetching quests:', error);
            }
        };

        fetchQuests();
    }, [user.username]);

    return (
        <div className="profile-page">
            <div className="user-info-container">
            </div>
            <div className="user-quests-container">
            </div>
        </div>
    );
}

export default ProfilePage;