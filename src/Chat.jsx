import katex from 'katex';
import 'katex/dist/katex.min.css';
import { useState, useEffect, useRef } from 'react';
import './Chat.css';
import logo from '../public/gaspface-logo.png'; // Adjust the path if necessary
import attach from '../public/attach-file.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import content from "./aicontent.js";

const systemMessage = {
  role: "system",
  content: content // Context for AI with background knowledge of me and some rules and stuff

};

const API_KEY = import.meta.env.VITE_API_KEY;
const GAIPLUS = import.meta.env.VITE_GIMMYAIPLUSKEY;



function Chat() {
  const [messages, setMessages] = useState([
    {
      message: `Hello, I'm **GimmyAI**! What can I help you with?`,
      sender: "ChatGPT"
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [modelIdentifier, setModelIdentifier] = useState("gpt-4o-mini-2024-07-18");
  const [inputContainerHeight, setInputContainerHeight] = useState(0);
  const [isGimmyAIPlusActive, setIsGimmyAIPlusActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [originalInputContainerHeight, setOriginalInputContainerHeight] = useState(null);
  const lastMessageRef = useRef(null);

  useEffect(() => {
    const inputContainerElement = document.querySelector('.input-container');
    if (inputContainerElement) {
      setOriginalInputContainerHeight(inputContainerElement.offsetHeight);
    }
  }, []);
  

  useEffect(() => {
    if (lastMessageRef.current && !isMobileDevice()) {
      const chatContainer = document.querySelector('.app-body');
      const observer = new IntersectionObserver(entries => {
        const lastEntry = entries[0];
        if (!lastEntry.isIntersecting && chatContainer.scrollTop + chatContainer.offsetHeight >= chatContainer.scrollHeight) {
          lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, {
        threshold: 1.0
      });
  
      observer.observe(lastMessageRef.current);
      return () => observer.disconnect(); // Clean up the observer when the component unmounts or updates
    }
  }, [messages]);
  
  
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  
  const handleImagePreviewClick = () => {
    setSelectedImage(null);
  };

  const handleFileSelect = (event) => {
    const imageFile = event.target.files[0];
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(imageFile);
    }
  };
  

  const displayImageMessage = (base64Image) => {
    setMessages(prevMessages => [...prevMessages, {
      message: base64Image,
      sender: 'user',
      image: true
    }]);
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
  
  const MAX_IMAGE_SIZE_MB = 1; // Set a maximum size limit for images (in MB)

const sendImageToAPI = async (base64Image) => {
  setIsTyping(true);
  try {
    // Validate image size
    const imageSize = base64Image.length * (3 / 4) / (1024 * 1024); // Convert base64 length to MB
    if (imageSize > MAX_IMAGE_SIZE_MB) {
      displayErrorMessage(`The image is too large (${imageSize.toFixed(2)} MB). Please upload an image smaller than ${MAX_IMAGE_SIZE_MB} MB.`);
      setIsTyping(false);
      return;
    }

    // Display the image sent by the user as a message in the chat
    displayImageMessage(base64Image);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini-2024-07-18', // Specify the desired model
        messages: [
          systemMessage,
          ...messages.map(msg => ({
            role: msg.sender === "ChatGPT" ? "assistant" : "user",
            content: msg.message
          })),
          { role: 'user', content: base64Image }
        ]
      })
    });

    const data = await response.json();
    if (response.ok) {
      // Display the AI's response as a message in the chat
      setMessages(prevMessages => [...prevMessages, {
        message: data.choices[0].message.content,
        sender: "ChatGPT"
      }]);
    } else {
      displayErrorMessage(`Error: ${data.error.message}`);
    }
  } catch (error) {
    console.error("Error sending image to API:", error);
    displayErrorMessage("An error occurred while sending the image to the API.");
  } finally {
    setIsTyping(false);
  }
};


  
  
  

  const checkForKeywordAndSendMessage = async (message) => {
    try {
      if (message.includes(GAIPLUS)) {
        setModelIdentifier("gpt-4o-2024-08-06");
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
    } catch (error) {
      console.error("Error sending message:", error);
      displayErrorMessage("Oops! There was an unexpected hiccup. Let's try again.");
    }
  };

  
  


  const sendMessageToAPI = async (userMessage) => {
    setIsTyping(true);
    let apiErrorOccurred = false;
    let friendlyErrorMessage = "Oops! There was an unexpected hiccup.";
  
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: modelIdentifier,
          messages: [
            systemMessage,
            ...messages.map(msg => ({
              role: msg.sender === "ChatGPT" ? "assistant" : "user",
              content: msg.message
            })),
            { role: 'user', content: userMessage }
          ]
        })
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
      friendlyErrorMessage = "Looks like GimmyAI's got too excited and needs a moment. Let's give it some space and try again after a short break.";
    } finally {
      setIsTyping(false);
      if (apiErrorOccurred) {
        displayErrorMessage(friendlyErrorMessage);
      }
    }
  };
  
  
  
  const handleSendMessage = async () => {
    const chatContainer = document.querySelector('.app-body');
    const isScrollingUp = chatContainer.scrollTop < chatContainer.scrollHeight - chatContainer.offsetHeight;

    if (!newMessage.trim() && selectedImage === null) return;
    const outgoingMessage = {
      message: newMessage,
      sender: 'user'
    };
    const isDuplicateMessage = messages.length > 0 && messages[messages.length - 1].message.trim() === outgoingMessage.message.trim();
    if (isDuplicateMessage) {
      return;
    }
    setNewMessage(''); // Clear the textarea immediately
    setIsTyping(true);
    try {
      if (newMessage.trim()) {
        setMessages(prevMessages => [...prevMessages, outgoingMessage]);
      }
  
      if (selectedImage) {
        await sendImageToAPI(selectedImage);
        setSelectedImage(null);
      } else if (outgoingMessage.message.trim()) {
        await checkForKeywordAndSendMessage(outgoingMessage.message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      displayErrorMessage("GimmyAI ran out of juice, come back later!");
    } finally {
      setIsTyping(false);
      setInputContainerHeight(originalInputContainerHeight);
    }
  
    if (!isScrollingUp) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  
    const textarea = document.querySelector('textarea');
    textarea.style.height = `${originalInputContainerHeight}px`;
  };
  
  
  
  
  
  const formatMathEquation = (equation) => {
    try {
      return katex.renderToString(equation, {
        throwOnError: false,
        displayMode: equation.startsWith('$$') && equation.endsWith('$$')
      });
    } catch (error) {
      console.error('Error formatting equation:', error);
      return equation;
    }
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
    if (message.image) {
      return {
        __html: `<img src="data:image/png;base64,${message.message}" alt="User upload" style="max-width: 100%; max-height: 400px;" />`,
      };
    }
  
    // Convert Markdown headings to bold tags
    let formattedMessage = message.replace(/###\s?(.*)/g, '<strong>$1</strong>');
  
    // Convert bold Markdown to strong tags
    formattedMessage = formattedMessage.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
    // Convert italic Markdown to em tags
    formattedMessage = formattedMessage.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
    // Convert Markdown links to anchor tags
    formattedMessage = formattedMessage.replace(/\[([^\]]+)\]\((http[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  
    // Convert plain text URLs to anchor tags, but skip ones already in anchor tags
    formattedMessage = formattedMessage.replace(/(\bhttps?:\/\/[^\s<]+)(?![^<]*>)(?!<\/a>)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
  
    // Format mathematical equations
    formattedMessage = formattedMessage.replace(/\$\$(.*?)\$\$/g, (match, equation) => {
      return `<span>${formatMathEquation(`$$${equation}$$`)}</span>`;
    });
  
    formattedMessage = formattedMessage.replace(/\$(.*?)\$/g, (match, equation) => {
      return `<span>${formatMathEquation(`$${equation}$`)}</span>`;
    });
  
    return { __html: formattedMessage };
  };
  
  

  const handleTextareaChange = (e) => {
    const target = e.target;
    setNewMessage(target.value);
  
    if (target.value.trim()) {
      target.style.height = 'auto';
      target.style.height = `${target.scrollHeight}px`;
    } else {
      target.style.height = `${originalInputContainerHeight}px`;
    }
  };
  

  return (
    <div id="root">
      <header className="app-header">
      <a href="/"><img src={logo} width="50px" height="60px" alt="GimmyAI Logo" className="app-logo" /></a>
        <h1>GimmyAI</h1>
        <div className="tooltip-container">
          <FontAwesomeIcon className="info-icon" icon={faCircleInfo} />
          <span className="tooltip w3-animate-opacity">GimmyAI is powered by better models of GPT</span>
        </div>
      </header>
      <div className="app-body" style={{ marginBottom: `${inputContainerHeight}px`}}>
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`message ${msg.sender === "ChatGPT" ? 'incoming' : 'outgoing'}`}
        >
          {msg.image ? (
            <img src={msg.message} alt="User upload" style={{ maxWidth: '100%', maxHeight: '400px' }} />
          ) : (
            <div
              className={`message-content ${msg.sender}`}
              dangerouslySetInnerHTML={formatMessage(msg.message.replace(new RegExp(GAIPLUS, 'g'), '**KEYWORD USED**'))}
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
        <div className="image-preview-container" onClick={handleImagePreviewClick}>
          <img src={selectedImage} alt="Selected Image" className="image-preview" />
        </div>
      )}
              
      <textarea
        type="text"
        placeholder="Type a message..."
        value={newMessage} 
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
