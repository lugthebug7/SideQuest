import React from 'react';
import './App.css';

function HomePage_LoggedOut() {
  return (
      <div className="App">
          <div className="vertical-rectangle-left-teal">
              <div className="rotated-side_quest">SideQuest</div>
          </div>
          <div className="vertical-rectangle-right-brown">

              <img src={`${process.env.PUBLIC_URL}/images/home_page2.png`} alt="Scene" className="scene-image"/>
              <h1>live real stories</h1>
              <form className="login-form">
                  <input type="text" placeholder="Username/Email"/>
                  <input type="password" placeholder="Password"/>
                  <button type="submit" onClick={VerifyCredentials}>Login</button>
              </form>
              <button type="button">Create Account</button>
              <button type="button">Learn More</button>
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
