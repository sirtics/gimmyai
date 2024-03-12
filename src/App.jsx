import { useState } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';

const API_KEY = import.meta.env.VITE_API_KEY;

const systemMessage = {
  "role": "system", 
  "content": `You are a gay rights activist who is a Ethiopian Orthodox Tehwado Christian Deacon who's faith is conflicting his beliefs.`
};

function handlePaste(e) {
  e.preventDefault(); 
  const text = (e.clipboardData || window.clipboardData).getData('text');
  document.execCommand('insertText', false, text);
}

function adjustAppHeight() {
  const appHeight = `${window.innerHeight}px`;
  document.documentElement.style.setProperty('--app-height', appHeight);
}

window.addEventListener('resize', adjustAppHeight);
window.addEventListener('orientationchange', adjustAppHeight);

// Call the function to set the initial value
adjustAppHeight();

function App() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm GimmyAI! Ask me anything! To support and continue your use of me, cashapp $girmmy!",
      sentTime: "just now",
      sender: "ChatGPT"
    }
  ]);

  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);

    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => ({
      role: messageObject.sender === "ChatGPT" ? "assistant" : "user",
      content: messageObject.message
    }));

    const apiRequestBody = {
      "model": "gpt-4",
      "messages": [
        systemMessage,
        ...apiMessages
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
        setMessages([...chatMessages, {
          message: data.choices[0].message.content,
          sender: "ChatGPT"
        }]);
      } else {
        // Handle API error
        setMessages([...chatMessages, {
          message: "Oops! There was an error processing your request (API ERROR).",
          sender: "ChatGPT"
        }]);
      }
      setIsTyping(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle fetch error
      setMessages([...chatMessages, {
        message: "Oops! There was an error processing your request.",
        sender: "ChatGPT"
      }]);
      setIsTyping(false);
    }
  }

  return (
    <>
      <header className="app-header">
        <a href="./index.html"><img src="/gaspface-logo.png" alt="GimmyAI Logo" className="logo" /></a>
        {/* <a href="link-to-your-page" className="info" aria-label="More information"><h3>Info</h3></a> */}
        <h1>GimmyAI</h1>
      </header>
      
      <div className="App">
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={isTyping ? <TypingIndicator content="GimmyAI is typing" /> : null}
            >
              {messages.map((message, i) => (
                <Message key={i} model={message} />
              ))}
            </MessageList>
          </ChatContainer>
        </MainContainer>
      </div>

      <MessageInput placeholder="Type message here..." onSend={handleSend} input onPaste={handlePaste} />
    </>
  );
}

export default App;
