import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from '../../contexts/UserContext';
import homeImage from "../../images/home_page2.png";
import NavBar from "../../components/NavBar/NavBar";
import './CreateQuestAdmin.css';




function CreateQuestAdmin() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [objective1, setObjective1] = useState('');
  const [objective2, setObjective2] = useState('');
  const [objective3, setObjective3] = useState('');
  const [objective4, setObjective4] = useState('');
  const [objective5, setObjective5] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [imageURL, setImageURL] = useState(null);
  const{ user } = useUser();

  useEffect(() => {
  // This will be called when the component unmounts or when a new image URL is set
    return () => {
      if (imageURL) {
        URL.revokeObjectURL(imageURL);
      }
    };
  }, [imageURL]);

  function handleImageChange(event) {
      const file = event.target.files[0]; // Get the first file from the file input
      if (file) {
          const imageURL = URL.createObjectURL(file);
          setImageURL(imageURL); // Set the imageURL state
          setImage(file); // Update the image state with the new file
      }
  }



  const handleSubmitClick = async (event) => {
    event.preventDefault();
    try {
      const objectives = [objective1, objective2, objective3, objective4, objective5].filter(obj => obj.trim() !== '');

      const genres = [];
        document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
          genres.push(checkbox.id);
      });


        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('objectives', JSON.stringify(objectives));
        formData.append('genres', JSON.stringify(genres));
        formData.append('image', image);
        formData.append('user_name', user.username)

        console.log(user.username);
        const response = await fetch('http://localhost:5001/adminCreate/create', {
          method: 'POST',
          body: formData
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
      <div className="CreateQuestAdmin">
        <div>
          <form onSubmit={handleSubmitClick}>
            <div className="title-description-objectives-container">
              <div>
                <h2 className="title-header">Title</h2>
                <input className="title" type="text" placeholder="Title" value={title}
                       onChange={e => setTitle(e.target.value)}/>
              </div>
              <div>
                <h2>Description</h2>
                <textarea className="description"
                          placeholder="Description"
                          value={description}
                          rows="4"
                          onChange={e => setDescription(e.target.value)}
                />
              </div>
              <div className="objectives-container">
                <h2>Objectives</h2>
                <div>
                  <input className="objectives" type="text" placeholder="Objective 1" value={objective1}
                         onChange={e => setObjective1(e.target.value)}/>
                </div>
                <div>
                  <input className="objectives" type="text" placeholder="Objective 2 (Optional)" value={objective2}
                         onChange={e => setObjective2(e.target.value)}/>
                </div>
                <div>
                  <input className="objectives" type="text" placeholder="Objective 3 (Optional)" value={objective3}
                         onChange={e => setObjective3(e.target.value)}/>
                </div>
                <div>
                  <input className="objectives" type="text" placeholder="Objective 4 (Optional)" value={objective4}
                         onChange={e => setObjective4(e.target.value)}/>
                </div>
                <div>
                  <input className="objectives" type="text" placeholder="Objective 5 (Optional)" value={objective5}
                         onChange={e => setObjective5(e.target.value)}/>
                </div>
              </div>
            </div>

            <div className="genres-container">
              <h2>Genres</h2>
              <div className="genre">
                <input type="checkbox" id="1"/>
                <label htmlFor="1" className="genre-label">Stay At Home</label>
              </div>
              <div className="genre">
                <input type="checkbox" id="2"/>
                <label htmlFor="2" className="genre-label">Free Festivities</label>
              </div>
              <div className="genre">
                <input type="checkbox" id="3"/>
                <label htmlFor="3" className="genre-label">Nothing's Free</label>
              </div>
              <div className="genre">
                <input type="checkbox" id="4"/>
                <label htmlFor="4" className="genre-label">Hungry Hungry Hobbits</label>
              </div>
              <div className="genre">
                <input type="checkbox" id="5"/>
                <label htmlFor="5" className="genre-label">Adult Adventures</label>
              </div>
              <div className="genre">
                <input type="checkbox" id="6"/>
                <label className="genre-label" htmlFor="6">For the Lovers</label>
              </div>
              <div className="genre">
                <input type="checkbox" id="7"/>
                <label htmlFor="7" className="genre-label">For the Loners</label>
              </div>
              <div className="genre">
                <input type="checkbox" id="8"/>
                <label htmlFor="8" className="genre-label">For the Party Pants</label>
              </div>
              <div className="genre">
                <input type="checkbox" id="9"/>
                <label htmlFor="9" className="genre-label">Get to Know Your Town</label>
              </div>
              <div className="genre">
                <input type="checkbox" id="10"/>
                <label htmlFor="10" className="genre-label">Touch Grass</label>
              </div>
            </div>

            <div className="image-submit-container">
              {imageURL ? (<img src={imageURL} alt="Selected Quest" className="preview-image"/>) :
                  (<div className="empty-image">Select Image</div>)}
              <button type="button" onClick={() => document.getElementById('fileInput').click()}
                      className="image-button">
                Choose Image
              </button>
              <input type="file" id="fileInput" onChange={handleImageChange} accept="image/*"
                     style={{display: 'none'}}/>

              <button className="submit-button" type="submit">Create Quest</button>
              {error && <p style={{color: 'red'}}>{error}</p>}
            </div>

          </form>
        </div>
      </div>
  );
}


export default CreateQuestAdmin;