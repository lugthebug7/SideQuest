import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import './Carousel.css';


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


const GenreCarousel = ({ genre }) => {
    const [quests, setQuests] = useState([]);
    const [genreName, setGenreName] = useState("");
    const directory = "http://localhost:5001/uploads/";


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
            <h2 className="quest-genre-name">{genreName} Quests</h2>
            <Carousel interval={null} wrap={true}>
                {quests.map((group, index) => (
                    <Carousel.Item key={index}>
                        <div className="quest-group-container">
                            {group.map((item, subIndex) => (
                                <div key={subIndex} className="quest-container">
                                        <img src={directory + item.image} alt="Quest" />
                                </div>
                            ))}
                        </div>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
};

export default GenreCarousel;