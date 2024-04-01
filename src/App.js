import React from 'react';
import './App.css';

function HomePage_LoggedOut() {
  return (
      <div className="App">
          <div className="vertical-rectangle-left-teal">
              <div className="rotated-side_quest">SideQuest</div>
          </div>
          <div className="vertical-rectangle-right-brown">
              <div className="wrapper-container">
                  <div className="upper-container">
                      <div className="upper-left-container">
                          <div className="upper-left-container-top">
                              <div className="logo-image-container">
                                  <img src={`${process.env.PUBLIC_URL}/images/home_page2.png`} alt="Scene"
                                       className="scene-image"/>
                              </div>
                          </div>
                          <div className="upper-left-container-bottom">
                              <div className="login-form-container">
                                  <form className="login-form">
                                      <input type="text" placeholder="Username/Email"/>
                                      <input type="password" placeholder="Password"/>
                                  </form>
                              </div>
                          </div>
                      </div>
                      <div className="upper-right-container">
                          <div className="slogan-rectangle">
                              <h1 className="slogan">live real stories</h1>
                          </div>
                      </div>
                  </div>
                  <div className="lower-container">
                      <button className="buttons" type="submit" onClick={VerifyCredentials}>Login</button>
                      <button className="buttons" type="button">Create Account</button>
                      <button className="buttons" type="button" >Learn More</button>
                  </div>
              </div>
          </div>
      </div>
  );
}

function VerifyCredentials() {
    // Get the username and password from the form
    const username = document.querySelector('input[type="text"]').value;
    const password = document.querySelector('input[type="password"]').value;

    // Check if the username and password are correct
    if (username === 'admin' && password === 'password') {
        // Redirect to the home page
        window.location.href = '/home';
    } else {
        // Display an error message
        alert('Invalid username or password');
    }
}

export default HomePage_LoggedOut;
