import React, {useState, useEffect} from 'react';
import HomePageLoggedOut from "../HomePageLoggedOut/HomePageLoggedOut";
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import Carousel from "../../components/Carousel/Carousel";
import './HomePageLoggedIn.css';
import QuestModal from "../../components/QuestModal/QuestModal";

const directory = "http://localhost:5001/uploads/";



function GetFeaturedQuests() {
    const [quests, setQuests] = useState([]);

    useEffect(() => {
        const fetchQuests = async () => {
            try {
                const response = await fetch('http://localhost:5001/populate/get3FeaturedQuests', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });
                if (response.ok) {
                    const data = await response.json();
                    setQuests(data.featured_quests);
                } else {
                    throw new Error('Failed to fetch quests');
                }
            } catch (error) {
                console.error('Error fetching featured quests:', error);
            }
        };

        fetchQuests();
    }, []);

    return quests;
}


function FeaturedQuest({item, index, username}) {
    const [isHovered, setIsHovered] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };
    console.log(directory + item.image)

    return (

        <div key={index} className={`feature-quest-${index}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={toggleModal}>
            <ssLink to={`/quest/${item.id}`}>
                <div className="feature-title">{item.title}</div>
                <div className="feature-image-container">
                    <img className="feature-image" src={directory + item.image} alt={item.title}/>
                </div>
                <div className="feature-description">{item.description}</div>
            </ssLink>
            {isModalOpen && (
                <QuestModal show={isModalOpen} onClose={toggleModal} item={item} username={username} fetchStatus={true} />
            )}
        </div>
    );
}


function HomePageLoggedIn() {
    const{ user } = useUser();
    const quests = GetFeaturedQuests();

    return (
        <div className="HomePageLoggedIn">
            <div className="feature-container-full">
                <div className="featured-header">Featured Quests</div>
                <div className="featured-quests-container">
                    {quests.map((quest, index) => (
                        <FeaturedQuest item={quest} index={index + 1} username={user.username} />
                    ))}
                </div>
            </div>
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

            <div className="footer">
                <p>SIDEQUEST 2024</p>
            </div>
        </div>
    );
}

export default HomePageLoggedIn;