import React, { useContext, useState } from 'react';
import './main.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';
import AiwithImage from '../../context/image';
import { useUser } from '@clerk/clerk-react'; // Import Clerk's useUser hook

const Main = () => {
  const { onSent, recentPrompt, showResult, loading, resultData, setInput, input } = useContext(Context);
  const { user } = useUser(); // Get the logged-in user's data from Clerk
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // Function to handle card clicks
  const handleCardClick = (prompt) => {
    setInput(prompt); // Set the input to the card's prompt
    onSent(prompt); // Trigger the onSent function with the card's prompt
  };

  // Function to toggle the dropdown menu
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Function to handle "Use ImageAI" click
  const handleUseImageAI = () => {
    setShowPopup(true); // Show the popup
    setShowDropdown(false); // Close the dropdown
  };

  // Function to close the popup
  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className='main'>
      <div className="nav">
        <p>Gemini</p>
        <div className="user-icon-container" onClick={toggleDropdown}>
          <img src={assets.user_icon} alt="icon" />
          {showDropdown && (
            <div className="dropdown-menu">
              <button onClick={handleUseImageAI}>Use ImageAI</button>
            </div>
          )}
        </div>
      </div>
      <div className="main-container">
        {!showResult ? (
          <>
            <div className="greet">
              <p><span>Hello, {user?.username || 'Dev'}.</span></p>
              <p>How can I help you today?</p>
            </div>
            <div className="cards">
              <div className="card" onClick={() => handleCardClick("Suggest beautiful places to see on an upcoming road trip")}>
                <p>Suggest beautiful places to see on an upcoming road trip</p>
                <img src={assets.compass_icon} alt="compass" />
              </div>
              <div className="card" onClick={() => handleCardClick("Briefly summarize this concept: urban planning")}>
                <p>Briefly summarize this concept: urban planning</p>
                <img src={assets.bulb_icon} alt="compass" />
              </div>
              <div className="card" onClick={() => handleCardClick("Brainstorm team bonding activities for our work retreat")}>
                <p>Brainstorm team bonding activities for our work retreat</p>
                <img src={assets.message_icon} alt="compass" />
              </div>
              <div className="card" onClick={() => handleCardClick("Tell me about React js and React native")}>
                <p>Tell me about React js and React native</p>
                <img src={assets.code_icon} alt="compass" />
              </div>
            </div>
          </>
        ) : (
          <div className='result'>
            <div className="result-title">
              <img src={assets.user_icon} alt="" />
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              <img src={assets.gemini_icon} alt="" />
              {loading
                ? <div className='loader'>
                    <hr />
                    <hr />
                    <hr />
                  </div>
                : <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
              }
            </div>
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder='Enter your prompt here' />
            <div>
              {/* <img src={assets.gallery_icon} alt="" />
              <img src={assets.mic_icon} alt="" /> */}
              {input && 
                <img onClick={() => onSent(input)} src={assets.send_icon} alt="" />
              }
            </div>
          </div>
          <p className="bottom-info">
            Gemini may display inaccurate info, including about people, so double-check its responses. Your privacy and Gemini Apps
          </p>
        </div>
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="close-popup" onClick={closePopup}>&times;</span>
            <AiwithImage /> {/* Include the AiwithImage component in the popup */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
