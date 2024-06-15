import 'katex/dist/katex.min.css';
import { useState, useEffect, useRef } from 'react';
import './Chat.css';
import logo from '../public/gaspface-logo.png'; // Adjust the path if necessary
import attach from '../public/attach-file.png';
import axios from 'axios';
import content from "./aicontent.js";

const systemMessage = {
  role: "system",
  content: content // Context for AI with background knowledge of me and some rules and stuff

};

const API_KEY = import.meta.env.VITE_API_KEY;




function Chat() {
  const [messages, setMessages] = useState([
    {
      message: `Hello, I'm **GimmyAI**! What can I help you with?`,
      sender: "ChatGPT"
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [modelIdentifier, setModelIdentifier] = useState("gpt-3.5-turbo-0125");
  const [inputContainerHeight, setInputContainerHeight] = useState(0);
  const [isGimmyAIPlusActive, setIsGimmyAIPlusActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const lastMessageRef = useRef(null);

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

  useEffect(() => {
    if (lastMessageRef.current) {
      const observer = new IntersectionObserver(entries => {
        const lastEntry = entries[0];
        if (!lastEntry.isIntersecting) {
          lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, {
        threshold: 1.0 // Adjust this value based on how much of the item needs to be visible
      });

      observer.observe(lastMessageRef.current);
      return () => observer.disconnect(); // Clean up the observer when the component unmounts or updates
    }
  }, [messages]);

  const handleFileSelect = (event) => {
    const imageFile = event.target.files[0];
    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);

      // Upload the image to the server or cloud storage
      axios.post('https://gimmyai.com/interpret-images', formData)
        .then(response => {
          const imageUrl = response.data.imageUrl; // Assuming the server response includes the image URL
          setSelectedImage(imageUrl);
        })
        .catch(error => {
          console.error("Error uploading image:", error);
          displayErrorMessage("An error occurred while uploading the image.");
        });
    }
  };
  
  

  const displayImageMessage = (imageUrl) => {
    setMessages(prevMessages => [...prevMessages, { message: imageUrl, sender: 'user', image: true }]);
  };

  const displayErrorMessage = (errorMessage) => {
    setMessages(prevMessages => [...prevMessages, { message: errorMessage, sender: 'ChatGPT' }]);
  };


  // const toBase64 = (file) => new Promise((resolve, reject) => {
  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onload = () => resolve(reader.result);
  //   reader.onerror = error => reject(error);
  // });
  
  const sendImageToAPI = async (imageUrl) => {
    setIsTyping(true);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageUrl,
          model: 'gpt-4o' // Specify the desired model (e.g., davinci, curie, babbage)
        })
      });
  
      const data = await response.json();
      if (response.ok) {
        const interpretation = data.data.objects.map(obj => obj.description).join(', ');
        setMessages(prevMessages => [...prevMessages, {
          message: `AI interpretation: ${interpretation}`,
          sender: "ChatGPT"
        }]);
      } else {
        displayErrorMessage(`Error: ${data.error.message}`);
      }
    } catch (error) {
      displayErrorMessage("An error occurred while sending the image to the API.");
    } finally {
      setIsTyping(false);
    }
  };
  
  
  

  const checkForKeywordAndSendMessage = async (message) => {
    if (message.includes("mooseAnkle")) { 
      setModelIdentifier("gpt-4o");
      setIsGimmyAIPlusActive(true);
      setMessages(prevMessages => [
        ...prevMessages,
        {
          message: "Switched model to GimmyAI+",
          sender: "ChatGPT"
        }
      ]);
    } else {
      // Send the text message to the API
      await sendMessageToAPI(message);
    }
  };
  
  


  const sendMessageToAPI = async (userMessage) => {
    setIsTyping(true);
    let apiErrorOccurred = false;
    let friendlyErrorMessage = "Oops! There was an unexpected hiccup.";

    const apiRequestBody = {
      model: modelIdentifier,
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
        apiErrorOccurred = true;
        if (data.error) {
          friendlyErrorMessage = `Error: ${data.error.message}`;
        } else {
          friendlyErrorMessage = "GimmyAI might be on maintenance right now. Please check back in a bit.";
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      apiErrorOccurred = true;
      if (error.message.includes('quota')) {
        friendlyErrorMessage = "Looks like GimmyAI's got too excited and needs a moment. Let's give it some space and try again after a short break.";
      } else {
        friendlyErrorMessage = "GimmyAI might be on maintenance right now. Please check back in a bit.";
      }
    } finally {
      setIsTyping(false);
      if (apiErrorOccurred) {
        displayErrorMessage(friendlyErrorMessage);
      }
    }
  };
  
  
  
  

  // Modify handleSendMessage to use the new checkForKeywordAndSendMessage function
  const handleSendMessage = async () => {
    if (!newMessage.trim() && selectedImage === null) return;

    const outgoingMessage = {
      message: newMessage,
      sender: 'user'
    };
  
    const isDuplicateMessage = messages.some(msg =>
      msg.sender === 'user' && msg.message.trim() === outgoingMessage.message.trim()
    );
  
    if (isDuplicateMessage) {
      return;
    }
  
    setIsTyping(true);

    if (newMessage.trim()) {
      setMessages(prevMessages => [...prevMessages, outgoingMessage]);
    }

    setNewMessage('');

    if (selectedImage) {
      await sendImageToAPI(selectedImage);
      setSelectedImage(null);
    } else if (outgoingMessage.message.trim()) {
      await checkForKeywordAndSendMessage(outgoingMessage.message);
    }

    setIsTyping(false);
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
    // Prevent the default paste action
    event.preventDefault();
    // Use the Clipboard API to access the data directly
    const items = event.clipboardData.items;
  
    // Find items of the type 'image'
    const imageItem = Array.from(items).find(item => item.type.indexOf('image') === 0);
  
    if (imageItem && isGimmyAIPlusActive) {
      // If there's an image and GimmyAI+ is active, read it and send to the API
      const blob = imageItem.getAsFile();
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        displayImageMessage(base64Image); // Display it in the UI
        sendImageToAPI(base64Image); // Send it to the API
      };
      reader.readAsDataURL(blob);
    } else {
      // If it's not an image or GimmyAI+ isn't active, handle as a regular text paste
      const pasteText = event.clipboardData.getData('text/plain');
      setNewMessage(prevMessage => prevMessage + pasteText); // Append the pasted text
    }
  };
  

  const formatMessage = (message) => {
    // Convert Markdown headings to bold tags
    let formattedMessage = message.replace(/###\s?(.*)/g, '<strong>$1</strong>');
    // Convert bold Markdown to strong tags
    formattedMessage = formattedMessage.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Convert Markdown links to anchor tags
    formattedMessage = formattedMessage.replace(/\[([^\]]+)\]\((http[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Convert plain text URLs to anchor tags, but skip ones already in anchor tags
    formattedMessage = formattedMessage.replace(/(\bhttps?:\/\/[^\s<]+)(?![^<]*>)(?!<\/a>)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
  
    if (message.image) {
      return {
        __html: `<img src="data:image/png;base64,${message.message}" alt="User upload" style="max-width: 100%; max-height: 400px;" />`,
      };
    }
  
    return { __html: formattedMessage };
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
      <a href="/"><img src={logo} width="50px" height="60px" alt="GimmyAI Logo" className="app-logo" /></a>
        <h1>GimmyAI</h1>
      </header>
      <div className="app-body" style={{ marginBottom: `${inputContainerHeight}px`}}>
      {messages.map((msg, index) => (
        <div
        key={index}
        className={`message ${msg.sender === "ChatGPT" ? 'incoming' : 'outgoing'}`}
      >
        {msg.image ? (
          <img src={`data:image/png;base64,${msg.message}`} alt="User upload" style={{ maxWidth: '100%', maxHeight: '400px' }} />
        ) : (
          <div
            className={`message-content ${msg.sender}`}
            dangerouslySetInnerHTML={formatMessage(msg.message.replace(/mooseAnkle/g, '**KEYWORD USED**'))}
          />
        )}
      </div>
      
      ))}
        <div ref={lastMessageRef} />
        {isTyping && (
          <div className="typing-indicator">
            <span></span><span></span><span></span> GimmyAI is typing...
          </div>
        )}
      </div>
      <div className="input-container">
      {isGimmyAIPlusActive && (
        <>
          <input
            type="file"
            id="imageInput"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
          <label htmlFor="imageInput" className="attachment-button">
            <img src={attach} alt="Attach File" />
          </label>
        </>
      )}
       {selectedImage && (
          <div className="image-preview-container">
            <img src={selectedImage} alt="Selected Image" className="image-preview" />
          </div>
        )}
      <textarea
        type="text"
        placeholder="Type a message..."
        value={newMessage} // This should be the state variable
        onChange={handleTextareaChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        autoFocus
        style={{ height: 'auto', overflowY: 'auto' }}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  </div>

  );
}

export default Chat;