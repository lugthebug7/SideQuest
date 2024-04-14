import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from '../../contexts/UserContext';
import homeImage from "../../images/home_page2.png";
import NavBar from "../../components/NavBar/NavBar";
import './CreateQuestAdmin.css';


function CreateQuestAdmin() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [objectives, setObjectives] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
    console.log(event.target.files[0])
  };

  const convertImageToBinary = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      console.log("Did I make it this far?")
      reader.readAsBinaryString(file);
    });
  };

  const handleSubmitClick = async (event) => {
    event.preventDefault();

    try {
      const title = document.querySelector('input[type="text"]').value;
      const description = document.querySelector('input[type="text"]').value;
      const objectives = document.querySelector('input[type="text"]').value;
      const binaryData = await convertImageToBinary(image);


      // Example API call (you'll need to implement the server-side):
       const response = await fetch('http://localhost:5001/createAdminQuest/', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({ title, description, objectives, image: binaryData })
       });

       if (!response.ok) {
        setErrorMessage('Invalid Quest Input');
        throw new Error('Failed to create quest.');
      }
       navigate('/home');
    } catch (err) {
      setError('Failed to process image.');
      console.error(err);
    }
  };

  return (
      <>
        <NavBar />
        <div className="CreateQuestAdmin">
          <div>
            <form onSubmit={handleSubmitClick}>
              <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)}/>
              <input type="text" placeholder="Description" value={description}
                     onChange={e => setDescription(e.target.value)}/>
              <input type="text" placeholder="Objectives" value={objectives} onChange={e => setObjectives(e.target.value)}/>
              <input type="file" onChange={handleImageChange} accept="image/*"/>
              <button type="submit">Create Quest</button>
            </form>
            {error && <p style={{color: 'red'}}>{error}</p>}
          </div>
        </div>
      </>
  );
}


export default CreateQuestAdmin;