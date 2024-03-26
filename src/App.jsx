import 'katex/dist/katex.min.css';
import { useState, useEffect } from 'react';
import './App.css';
import logo from '../public/gaspface-logo.png'; // Adjust the path if necessary

const systemMessage = {
  role: "system",
  content: `...` // Truncated for brevity
};

const API_KEY = import.meta.env.VITE_API_KEY;

function App() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm GimmyAI! Ask me anything! To support and continue your use of me, cashapp $girmmy!",
      sender: "ChatGPT"
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [modelIdentifier, setModelIdentifier] = useState("gpt-3.5-turbo");
  const [inputContainerHeight, setInputContainerHeight] = useState(0);

  useEffect(() => {
    const updateInputContainerHeight = () => {
      const inputContainerElement = document.querySelector('.input-container');
      if (inputContainerElement) {
        setInputContainerHeight(inputContainerElement.offsetHeight);
      }
    };

    updateInputContainerHeight();
    window.addEventListener('resize', updateInputContainerHeight);
    return () => window.removeEventListener('resize', updateInputContainerHeight);
  }, []);

  const checkForKeywordAndSendMessage = async (message) => {
    let skipNextResponse = false;
    if (message.includes("grizz123") && modelIdentifier !== "gpt-4-0125-preview") {
      setModelIdentifier("gpt-4-0125-preview"); // Update the model identifier
      // Add a system message indicating the model switch without sending an additional message
      setMessages(prevMessages => [...prevMessages, {
        message: "Switched model to GimmyAI+",
        sender: "ChatGPT"
      }]);
      skipNextResponse = true;
    }
    
    if (!skipNextResponse) {
      await sendMessageToAPI(message);
    } else {
      setIsTyping(false); // Stop the typing indicator as no further message will be sent
    }
  };
  
  

  const sendMessageToAPI = async (userMessage) => {
    const apiRequestBody = {
      model: modelIdentifier, // Use the modelIdentifier state
      messages: [
        systemMessage,
        ...messages.map(msg => ({
          role: msg.sender === "ChatGPT" ? "assistant" : "user",
          content: msg.message
        })),
        { role: 'user', content: userMessage }
      ]
    };

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
        setMessages(prevMessages => [...prevMessages, {
          message: "Oops! There was an error processing your request (API ERROR).",
          sender: "ChatGPT"
        }]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessages(prevMessages => [...prevMessages, {
        message: "Oops! There was an error processing your request.",
        sender: "ChatGPT"
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Modify handleSendMessage to use the new checkForKeywordAndSendMessage function
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const outgoingMessage = {
      message: newMessage,
      sender: 'user'
    };

    setMessages(prevMessages => [...prevMessages, outgoingMessage]);
    setIsTyping(true);
    setNewMessage('');
    await checkForKeywordAndSendMessage(newMessage);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent the default behavior of Enter key in a textarea
      handleSendMessage();
    } else if (event.key === 'Enter' && event.shiftKey) {
      // Allow the Shift + Enter behavior to create a new line
      const value = newMessage;
      const cursorPos = event.target.selectionStart;
      setNewMessage(
        value.slice(0, cursorPos) + "\n" + value.slice(cursorPos)
      );
    }
  };

  const handlePaste = (event) => {
    event.preventDefault(); // Prevent the default paste action
    const pasteText = event.clipboardData.getData('text'); // Get the text content from the clipboard
    setNewMessage(pasteText); // Set the new message state with the pasted text
  };
  

  const handleTextareaChange = (e) => {
    const target = e.target;
    setNewMessage(target.value);
  
    // Reset the height to auto to get the correct scrollHeight
    target.style.height = 'auto';
    // Set the height to scrollHeight to accommodate all the content
    target.style.height = `${target.scrollHeight}px`;
  };

  return (
    <div id="root">
      <header className="app-header">
        <a href="/"><img src={logo} alt="GimmyAI Logo" className="app-logo" /></a>
        <h1>GimmyAI</h1>
      </header>
      <div className="app-body" style={{ marginBottom: `${inputContainerHeight}px`}}>
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
        onChange={handleTextareaChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        autoFocus
        style={{ height: 'auto', overflowY: 'hidden' }} // Inline styles for initial state
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
    </div>
  );
}

export default App;