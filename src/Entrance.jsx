import { useState } from 'react';
import './Entrance.css';
import Chat from "./Chat";
import logo from '../public/gaspface-logo.png'; // Adjust the path if necessary
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope as faEnvelopeSolid } from '@fortawesome/free-solid-svg-icons';

const Entrance = () => {
  const [showChat, setShowChat] = useState(false);

  const handleStartChatting = () => {
    setShowChat(true);
  };

  if (showChat) {
    return (
      <div className={`chat-container ${showChat? 'fade-in' : ''}`}>
        <Chat />
      </div>
    );
  }

  return (
    <div className="entrance">
        <div className="container">
            <div className="logo-container">
                <a href="/" alt="GimmyAI logo"><img src={logo} alt="GimmyAI Logo" className="logo" /></a>
                <h1>GimmyAI</h1>
            </div>
        <div className="icon-links">
            <a href="https://instagram.com/@gimmified" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="mailto:gimmys943@gmail.com">
                <FontAwesomeIcon icon={faEnvelopeSolid} />
            </a>
            <a href="https://github.com/sirtics" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faGithub} />
            </a>
        </div>
        <button className="start-button" onClick={handleStartChatting}>Start Chatting</button>
        </div>
      
    </div>
  );
};

export default Entrance;