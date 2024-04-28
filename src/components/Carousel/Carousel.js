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


function Modal({ show, onClose, item }) {
    if (!show) {
        return null;
    }
    return ReactDOM.createPortal(
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>

                <div className="modal-header">
                    {item.title}
                </div>
                <div className="modal-body-left">
                    {item.objectives ? item.objectives.map((objective, index) => (
                        <div key={index}>
                            <p>{objective}</p>
                        </div>
                    )) : null}
                </div>
                <div className="modal-body-right">
                    <img src={directory + item.image} alt={item.title}/>
                    <p>{item.description}</p>
                </div>
                <button className="close-modal-button" onClick={onClose}>X</button>
            </div>
        </div>,
        document.getElementById('modal-root')
    );
}


function QuestContainer({item, index}) {
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
                <Modal show={isModalOpen} onClose={toggleModal} item={item} />
            )}
        </div>
    );
}


const GenreCarousel = ({genre}) => {
    const [quests, setQuests] = useState([]);
    const [genreName, setGenreName] = useState("");

    useEffect(() => {
        const fetchQuests = async () => {
            console.log(JSON.stringify({genre}));

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
                        <div className="quest-group-container">
                            {group.map((item, subIndex) => (
                                <QuestContainer item={item} index={subIndex} />
                            ))}
                        </div>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
};

export default GenreCarousel;