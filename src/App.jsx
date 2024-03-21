import { useState } from 'react';
import './App.css';
import logo from '../public/gaspface-logo.png';

// Helper function to safely format messages to include HTML
function createMarkup(content) {
  // Ideally, you'd want to sanitize this content to prevent XSS if it includes user-generated content
  return { __html: content };
}

// A component to render individual messages
function Message({ msg }) {
  return (
    <div
      className={`message ${msg.sender === "ChatGPT" ? 'incoming' : 'outgoing'}`}
      // If the message is from ChatGPT, it will render HTML content
      dangerouslySetInnerHTML={msg.sender === "ChatGPT" ? createMarkup(msg.message) : { __html: msg.message }}
    />
  );
}

const systemMessage = {
  role: "system",
  content: `...` // System message content is truncated for brevity
};

const API_KEY = import.meta.env.VITE_API_KEY; // Ensure the API key is set in your environment variables

function App() {
  const [messages, setMessages] = useState([systemMessage]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessageToAPI = async (apiRequestBody) => {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiRequestBody)
      });
      const data = await response.json();
      if (response.ok) {
        setMessages(prevMessages => [...prevMessages, {
          message: data.choices[0].message.content,
          sender: "ChatGPT"
        }]);
      } else {
        // Handle API error
        setMessages(prevMessages => [...prevMessages, {
          message: "Oops! There was an error processing your request (API ERROR).",
          sender: "ChatGPT"
        }]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle fetch error
      setMessages(prevMessages => [...prevMessages, {
        message: "Oops! There was an error processing your request.",
        sender: "ChatGPT"
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    // Format the message to replace new lines with HTML <br> tags
    const formattedMessage = newMessage.replace(/\n/g, '<br>');

    const outgoingMessage = {
      message: formattedMessage,
      sender: 'user'
    };

    setMessages(prevMessages => [...prevMessages, outgoingMessage]);

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        systemMessage,
        ...messages.map(msg => ({
          role: msg.sender === "ChatGPT" ? "assistant" : "user",
          content: msg.message
        })),
        { role: 'user', content: newMessage }
      ]
    };

    setIsTyping(true);
    setNewMessage(''); // Clear the text area
    await sendMessageToAPI(apiRequestBody);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent the default action of the Enter key
      handleSendMessage();
    }
  };

  const handleOnChange = (event) => {
    setNewMessage(event.target.value);
  };

  return (
    <div id="root">
      <header className="app-header">
        <a href="/"><img src={logo} alt="GimmyAI Logo" className="app-logo" /></a>
        <h1>GimmyAI</h1>
      </header>
      <div className="app-body">
        {messages.map((msg, index) => (
          <Message key={index} msg={msg} />
        ))}
        {isTyping && (
          <div className="typing-indicator">
            <span></span><span></span><span></span> GimmyAI is typing...
          </div>
        )}
      </div>
      <div className="input-container">
        <textarea
          placeholder="Type a message..."
          value={newMessage}
          onChange={handleOnChange}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
