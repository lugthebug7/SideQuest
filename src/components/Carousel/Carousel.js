import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';


function DisplayImage({ imageData }) {
  const src = `data:image/png;base64,${imageData}`;
  return <img src={src} alt="From Database" className="d-block w-100" />;
}


const GenreCarousel = ({ genre }) => {
    const [quests, setQuests] = useState([]);

    useEffect(() => {
        const fetchQuests = async () => {
            const response = await fetch('http://localhost:5001/populate/', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({genre}),
            });
            const data = await response.json();
            if (data.quests_for_genre) {
                setQuests(data.quests_for_genre);
            }
        };
        fetchQuests();
    }, [genre]);


    return (
        <div className="container">
            <h2>{genre} Quests</h2>
            <Carousel>
                {quests.map((item, index) => (
                    <Carousel.Item key={index}>
                        <DisplayImage imageData={item.image} />
                        <Carousel.Caption>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
};

export default GenreCarousel;