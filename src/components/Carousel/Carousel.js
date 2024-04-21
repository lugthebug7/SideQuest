import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import './Carousel.css';


function DisplayImage({ imageData }) {
  const src = `data:image/png;base64,${imageData}`;
  return <img src={src} alt="From Database" className="d-block w-100" />;
}


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
                setQuests(data.quests_for_genre);
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
            <h2>{genreName} Quests</h2>
            <Carousel>
                {quests.map((item, index) => (
                    <Carousel.Item key={index}>
                        <div className="quest-container">
                            <img src={directory + item.image} alt="Quest"></img>
                            {/* <h3>{item.title}</h3>
                            <p>{item.description}</p> 8*/}
                        </div>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
};

export default GenreCarousel;