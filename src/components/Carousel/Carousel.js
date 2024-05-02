import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import './Carousel.css';
import {Link} from "react-router-dom";
import ReactDOM from 'react-dom';

const directory = "http://localhost:5001/uploads/";


const groupQuests = (quests, groupSize) => {
    const fullGroups = [];
    let currentGroup = [];

    quests.forEach((quest, index) => {
        currentGroup.push(quest);
        if ((index + 1) % groupSize === 0) {
            fullGroups.push(currentGroup);
            currentGroup = [];
        }
    });

    if (currentGroup.length > 0) {
        while (currentGroup.length < groupSize) {
            currentGroup.push(...quests.slice(0, groupSize - currentGroup.length));
        }
        fullGroups.push(currentGroup);
    }

    return fullGroups;
};


function Modal({ show, onClose, item, username, fetchStatus }) {
    const [completionStatus, setCompletionStatus] = useState(false);
    const [inProgressStatus, setInProgressStatus] = useState(false);

    const handleTrackQuest = async () => {
    const response = await fetch('http://localhost:5001/populate/track', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username: username, quest_id: item.id })
    });
    if (response.ok) {
        setInProgressStatus(true);
    }
};

const handleUntrackQuest = async () => {
    const response = await fetch('http://localhost:5001/populate/untrack', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username: username, quest_id: item.id })
    });
    if (response.ok) {
        setInProgressStatus(false);
    }
};

    useEffect(() => {
        if (show && fetchStatus) {
            const fetchUserQuestStatus = async () => {
                const response = await fetch('http://localhost:5001/populate/userstatus', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({username: username, quest_id: item.id})
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log(data.user_quest_status);
                    if (data.user_quest_status === "completed") {
                        setCompletionStatus(true);
                    }
                    if (data.user_quest_status === "in_progress") {
                        setInProgressStatus(true);
                    }
                } else {
                    console.error("Failed to fetch user quest status:", response.statusText);
                }
            };

            fetchUserQuestStatus();
        }
    }, [show, item.id, fetchStatus]);

    if (!show) {
        return null;
    }


    return ReactDOM.createPortal(
        <div className="my-modal-backdrop" onClick={onClose}>
            <div className="my-modal-content" onClick={e => e.stopPropagation()}>
                <div className="my-modal-header">
                    {item.title}
                </div>
                <div className="my-modal-body-container">
                    <div className="modal-body-left">

                        <img src={directory + item.image} alt={item.title}/>
                        <p>{item.description}</p>

                    </div>
                    <div className="modal-body-right">
                        <ul className="objectives-list">
                            {item.objective1 ? <li>{item.objective1}</li> : null}
                            {item.objective2 ? <li>{item.objective2}</li> : null}
                            {item.objective3 ? <li>{item.objective3}</li> : null}
                            {item.objective4 ? <li>{item.objective4}</li> : null}
                            {item.objective5 ? <li>{item.objective5}</li> : null}
                        </ul>
                        {completionStatus ? <button className="completed-quest-button">Completed</button> :
                            (inProgressStatus ? <button onClick={handleUntrackQuest} className="untrack-quest-button">Untrack Quest</button> :
                                <button onClick={handleTrackQuest} className="track-quest-button">Track Quest</button>)
                        }
                    </div>
                </div>
                <button className="close-modal-button" onClick={onClose}>X</button>
            </div>
        </div>
            ,
            document.getElementById('modal-root')
    );
}


function QuestContainer({item, index, username}) {
    const [isHovered, setIsHovered] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);  // Toggle the state to show/hide the modal
    };



    return (
        <div
            className="quest-container"
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
                <Modal show={isModalOpen} onClose={toggleModal} item={item} username={username} fetchStatus={true} />
            )}
        </div>
    );
}


const GenreCarousel = ({genre, user}) => {
    const [quests, setQuests] = useState([]);
    const [genreName, setGenreName] = useState("");
    const [username, setUsername] = useState("");

    useEffect(() => {
        const fetchQuests = async () => {
            console.log(JSON.stringify({genre}));
            setUsername(user.username);
            console.log(username)
            const response = await fetch('http://localhost:5001/populate/populate', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({genre_id: genre})
            });
            if (response.ok) {
                const data = await response.json();
                setQuests(groupQuests(data.quests_for_genre, 5));
                if (data.quests_for_genre.length > 0) {
                    setGenreName(data.quests_for_genre[0].genre);
                }
            } else {
                console.error("Failed to fetch quests:", response.statusText);
            }
        };
        fetchQuests();
    }, [genre]);



    return (
        <div className="container">
            <h2 className="quest-genre-name">{genreName}</h2>
            <Carousel interval={null} wrap={true}>
                {quests.map((group, index) => (
                    <Carousel.Item key={index}>
                        <div className="quest-group-container" >
                            {group.map((item, subIndex) => (
                                <QuestContainer item={item} index={subIndex} username={username}/>
                            ))}
                        </div>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
};

export default GenreCarousel;