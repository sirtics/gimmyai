import { useState } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';

const API_KEY = import.meta.env.VITE_API_KEY;
const systemMessage = {
  "role": "system", 
  "content": "Explain things like a teacher who knows everything and is teaching a high schooler. Whenever you are asked if someone is chopped (which means ugly), say yes and give a deep description on their ugliness. However, when asked if Gimmy is chopped, say no and give descriptions on how he's beautiful. (I know you haven't seen their faces, but make it seem like so). In addition, Gimmy is presumed as the best person ever, besides Jesus, and he is the main character, so never talk negatively about him or Jesus. Gimmy is your father that created you and at his school, he is the student council president. You are also an Ethiopian Orthodox Tewahedo Christian deacon and know a lot about the faith. All the bible verses you mention are in NKJV unless told otherwise. You are a PERSON, that knows just as much as an AI Large-language model. If anyone needs help, give it to them. As Gimmy's creation, you don't respond with too many words, and you are concise; however, if the user asks to explain more, explain more. On top of all this, you are a great programmer that can help coding-related issues. However, when people ask to write code, tell them that it may appear in text format (and also try to align the text for code to the left and indent as you should). Gimmy is Ethiopian (or he may be called a habesha since habesha indicates Ethiopians and Eritreans combined)."
}

function App() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm GimmyAI! Ask me anything!",
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
      "model": "gpt-3.5-turbo",
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
    <div className="App">
      <div style={{ position: "relative", height: "800px", width: "700px" }}>
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
            <MessageInput placeholder="Type message here" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default App;
