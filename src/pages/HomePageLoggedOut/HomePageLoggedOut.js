import React from "react";
import HomePageLoggedIn from "../HomePageLoggedIn/HomePageLoggedIn";

function HomePageLoggedOut() {
  return (
      <div className="HomePageLoggedOut">
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
                      <button className="buttons" type="submit" onClick={handleLoginClick}>Login</button>
                      <button className="buttons" type="button">Create Account</button>
                      <button className="buttons" type="button" >Learn More</button>
                  </div>
              </div>
          </div>
      </div>
  );
}

async function handleLoginClick() {
  const username = document.querySelector('input[type="text"]').value;
  const password = document.querySelector('input[type="password"]').value;

  try {
    const response = await fetch('/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    console.log('Login successful', data);
    // Here, you might want to redirect the user or save the login state

  } catch (error) {
    console.error(error.message);
    // Here, handle the error (e.g., show an error message to the user)
  }
}

export default HomePageLoggedOut;