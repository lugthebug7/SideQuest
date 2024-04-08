import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';




function DisplayImage({ imageData }) {
  // Assuming imageData is the Base64 string received from the backend
  const src = `data:image/png;base64,${imageData}`;

  return <img src={src} alt="From Database" />;
}


const CustomCarousel = ({ genre }) => {
    const [items, setItems] = useState([]);

/*
    const fetchItems = async (genre) => {
        // Fetch items based on the genre
        // This is just dummy data
        const fetchedItems = [
            { id: 1, title: 'Item 1', imageUrl: '/path/to/image1.png' },
            { id: 2, title: 'Item 2', imageUrl: '/path/to/image2.png' },
            // Add more items as needed
        ];
        setItems(fetchedItems);
    };
*/
    useEffect(() => {
        fetchItems(genre);
    }, [genre]);

    return (
        <div className="container">
            <h2>{genre}</h2>
            <Carousel>
                {items.map((item, index) => (
                    <Carousel.Item key={index}>
                        <img
                            className="d-block w-100"
                            src={DisplayImage(item.imageCode)}
                            alt={item.title}
                        />
                        <Carousel.Caption>
                            <h3>{item.title}</h3>
                        </Carousel.Caption>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
};

export default CustomCarousel;