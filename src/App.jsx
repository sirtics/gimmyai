import { useState } from 'react';
import './App.css';
import logo from '../public/gaspface-logo.png'; // Make sure this is the correct relative path to the logo image

const systemMessage = {
  role: "system",
  content: `...` // System message content is truncated for brevity
};

const API_KEY = import.meta.env.VITE_API_KEY; // Ensure the API key is set in your environment variables

function App() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm GimmyAI! Ask me anything! To support and continue your use of me, cashapp $girmmy!",
      sender: "ChatGPT"
    }
  ]);
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

    const outgoingMessage = {
      message: newMessage,
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
    setNewMessage(''); // Clear input field after sending the message
    await sendMessageToAPI(apiRequestBody);
  };

const handleKeyDown = (event) => {
  if (event.key === 'Enter' && event.shiftKey) {
    event.preventDefault(); // Prevent the default action of the Enter key
    setNewMessage(prevMessage => prevMessage + '\n');
  } else if (event.key === 'Enter') {
    handleSendMessage();
  }
};

const handlePaste = (event) => {
  setNewMessage(event.clipboardData.getData('text'));
};

const processApiResponse = (apiResponse) => {
  // Split the response into lines based on certain patterns, such as bullet points or new lines
  const splitRegex = /[\n-]\s*/;
  return apiResponse.split(splitRegex).map((line, index) => ({
    message: line,
    id: index, // unique key for React
    sender: "ChatGPT"
  }));
};

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
      const processedMessages = processApiResponse(data.choices[0].message.content);
      setMessages(prevMessages => [...prevMessages, ...processedMessages]);
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

return (
  <div id="root">
    <header className="app-header">
      <a href="/"><img src={logo} alt="GimmyAI Logo" className="app-logo" /></a>
      <h1>GimmyAI</h1>
    </header>
    <div className="app-body">
      {messages.map((msg, index) => (
        <div key={index} className={`message ${msg.sender === "ChatGPT" ? 'incoming' : 'outgoing'}`}>
          {msg.message}
        </div>
      ))}
      {isTyping && (
        <div className="typing-indicator">
          <span></span><span></span><span></span> GimmyAI is typing...
        </div>
      )}
    </div>
    <div className="input-container">
      <textarea
        type="text"
        placeholder="Type a message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        autoFocus
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  </div>
);
}

export default App;
