import React, {useState, useEffect} from 'react';
import HomePageLoggedOut from "../HomePageLoggedOut/HomePageLoggedOut";
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import Carousel from "../../components/Carousel/Carousel";
import './ProfilePage.css';
import QuestModal from "../../components/QuestModal/QuestModal";

const directory = "http://localhost:5001/uploads/";


function displayProgressQuests() {

}

function displayCompleteQuests() {

}

function ProfilePage() {
    const [progressQuests, setProgressQuests] = useState([]);
    const [completeQuests, setCompleteQuests] = useState([]);
    const { user } = useUser();
    const [activeTab, setActiveTab] = useState('progress');

    useEffect(() => {
        const fetchQuests = async () => {
            try {
                const response = await fetch('http://localhost:5001/users/getUserQuests', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: user.username })
                });
                if (response.ok) {
                    const data = await response.json();
                    setCompleteQuests(data.complete_quests);
                    setProgressQuests(data.progress_quests);
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
                <div className={`progress-button ${activeTab === 'progress' ? 'active' : ''}`}
                     onClick={() => setActiveTab('progress')}>
                    In-Progress
                </div>
                <div className={`complete-button ${activeTab === 'completed' ? 'active' : ''}`}
                     onClick={() => setActiveTab('completed')}>
                    Completed
                </div>
                <div className="quest-content">
                    {activeTab === 'progress' ? (
                        <div>{progressQuests.map(quest => <div key={quest.id}>{quest.name}</div>)}</div>
                    ) : (
                        <div>{completeQuests.map(quest => <div key={quest.id}>{quest.name}</div>)}</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;