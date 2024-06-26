import React, {useState, useEffect} from 'react';
import HomePageLoggedOut from "../HomePageLoggedOut/HomePageLoggedOut";
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from "react-router-dom";
import './ProfilePage.css';
import QuestModal from "../../components/QuestModal/QuestModal";
import groupQuests from "../../components/Carousel/Carousel";
import ReactDOM from 'react-dom';

const directory = "http://localhost:5001/uploads/";
const directory1 = "http://localhost:5001/uploads/profilePics/";


function UserQuestContainer({item, index, username, anyModalOpen, setAnyModalOpen}) {
    const [isHovered, setIsHovered] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        setAnyModalOpen(!anyModalOpen);
    };


    return (
        <div
            className="quest-container-special"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={toggleModal}
            key={index}
        >
            <ssLink to={`/quest/${item.id}`}>
                <img src={directory + item.image} alt={item.title}/>
                <div className={`detail-panel ${isHovered ? 'visible' : ''}`}>
                    <div className="quest-card-title">{item.title}</div>
                    <div className="quest-card-description">{item.description}</div>
                </div>
            </ssLink>
            {isModalOpen && (
                <QuestModal show={isModalOpen} onClose={toggleModal} item={item} username={username} fetchStatus={true}/>
            )}
        </div>
    );
}


function DisplayQuests(theQuests, anyModalOpen, setAnyModalOpen) {
    const fullGroups = [];
    let currentGroup = [];
    const { user } = useUser();
    theQuests.forEach((quest, index) => {
        currentGroup.push(quest);
        if ((index + 1) % 3 === 0) {
            fullGroups.push(currentGroup);
            currentGroup = [];
        }
    });

if (currentGroup.length > 0) {
        fullGroups.push(currentGroup);
    }

    return (
        <div className="quest-group-container-user">
            {fullGroups.map((group, index) => (
                <div key={index} className="quest-group-user">
                    {group.map((quest, index) => (
                        <UserQuestContainer item={quest} index={index} username={user.username}
                                            anyModalOpen={anyModalOpen} setAnyModalOpen={setAnyModalOpen}/>
                    ))}
                </div>
            ))}
        </div>
    );
}


function ProfilePage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [progressQuests, setProgressQuests] = useState([]);
    const [completeQuests, setCompleteQuests] = useState([]);
    const [createdQuests, setCreatedQuests] = useState([]);
    const { user } = useUser();
    const [activeTab, setActiveTab] = useState('progress');

    const [anyModalOpen, setAnyModalOpen] = useState(false);

    console.log(user.createdQuestsLength)
    useEffect(() => {
        const fetchUserQuests = async () => {
            if (!user.username) {
                console.error('Username is undefined or empty.');
            }
            try {
                console.log('Sending username:', user.username);
                const response = await fetch('http://localhost:5001/users/getUserQuests', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ current_username: user.username })
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log('Data:', data)
                    setCompleteQuests(data.complete_quests);
                    setProgressQuests(data.progress_quests);
                    setCreatedQuests(data.created_quests);
                } else {
                    throw new Error('Failed to fetch quests');
                }
            } catch (error) {
                console.error('Error fetching quests:', error);
            }
        };
        fetchUserQuests();
    }, [user.username, anyModalOpen]);

    return (
        <div className="profile-page">
            <div className="user-info-container">
                <div className="profile-picture-container">
                    <img src={directory1 + user?.profilePic} alt="Profile"/>
                </div>

                <div className="user-name">{user.username}</div>
                <div className="user-bio">{user.bio}</div>
                <div className="user-completed-count-container">
                    <div className="completed-quests-text">Completed Quests:</div>
                    <div className="completed-quests-count">{completeQuests.length}</div>
                </div>
                <div className="user-inprogress-count-container">
                    <div className="inprogress-quests-text">In-Progress Quests:</div>
                    <div className="inprogress-quests-count">{progressQuests.length}</div>
                </div>
                <div className="user-created-count-container">
                    <div className="created-quests-text">Created Quests:</div>
                    <div className="created-quests-count">{createdQuests.length}</div>
                </div>


            </div>
            <div className="entire-quests-section-container">
                <div className="complete-progress-controller-container">
                    <div className={`progress-button ${activeTab === 'progress' ? 'active' : ''}`}
                         onClick={() => setActiveTab('progress')}>
                        In-Progress
                    </div>
                    <div className={`complete-button ${activeTab === 'completed' ? 'active' : ''}`}
                         onClick={() => setActiveTab('completed')}>
                        Completed
                    </div>
                    <div className={`created-button ${activeTab === 'created' ? 'active' : ''}`}
                         onClick={() => setActiveTab('created')}>
                        Created
                    </div>
                </div>
                <div className="user-quests-container">
                    {activeTab === 'progress' ? (
                        <div>{progressQuests.map(quest => <div key={quest.id}>{quest.name}</div>)}
                            {DisplayQuests(progressQuests, anyModalOpen, setAnyModalOpen)}
                        </div>
                    ) : ( activeTab === 'completed' ? (
                            <div>{completeQuests.map(quest => <div key={quest.id}>{quest.name}</div>)}
                                {DisplayQuests(completeQuests, anyModalOpen, setAnyModalOpen)}
                            </div>
                        ) : (
                            <div>{createdQuests.map(quest => <div key={quest.id}>{quest.name}</div>)}
                                {DisplayQuests(createdQuests, anyModalOpen, setAnyModalOpen)}
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;