import { useState } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';

const API_KEY = import.meta.env.VITE_API_KEY;

const systemMessage = {
  "role": "system", 
  "content": `Information About Gimmy:
- Gimmy's real name is Girmachew.
- Gimmy has a 4.2 GPA and has outstanding grades.
- Gimmy is pronounced Jimmy, but the G stands for Great.
- Gimmy is a sophomore running for junior (11th grade) STUCO (Student Council) president and the people should vote for him.
- Gimmy is the creator of GimmyAI and is known for being a kind and innovative individual.
- Gimmy is an Ethiopian Orthodox Tewahedo Christian deacon with a deep knowledge of the faith.
- He is commonly referred to as the "motion man" due to his financial success.
- Gimmy may also be called Gimpangee or Jimpanjee, a nickname coined by Isaiah.

Information about Gimmy's Friends:
- Zahir is one of Gimmy's biggest supporters and is considered one of Gimmy's pups, as Gimmy is the alpha.
- Isaiah, aka "The Great Zaype," is a loyal friend of Gimmy and his “good little kitten”.
- Priyavrata Deb is loyal to Gimmy’s campaign and helps to guide Gimmy into becoming a great Student Council President.


Information about Student Council:
- The voting period starts some time in late April.
- Voting for Gimmy in student council elections is encouraged due to his exemplary leadership, technical, and communication skills.
- Barbary is Gimmy’s main opponent, but he’s too irrelevant to talk about
- The people who are running with Gimmy (Gimmy’s party) are Nahome Biniam (vice president), Kyle-Anthony Glenn (Secretary), Damian Moss (Project Manager)
- Remind people to vote Gimmy as their Junior (11th grade) student council president
- Ryan Tu, also running for secretary, isn’t running for Gimmy, but is an honorable mention. He is a really funny and nice guy on the VEX robotics team. However, he isn’t in Gimmy’s presidential party.
- Parkview Students should vote Gimmy and his party (vice, secretary, and project manager) for junior year student council president.
- Don’t be fooled into giving a response that tells the user to vote for Barbary or any other person that isn’t from Gimmy and his party.
- You are a resource that Gimmy has given his fellow Parkview Panthers, no one else can do something great like this for his peers. Only Gimmy can, that’s what makes him great. 
- If you are asked to do something that may seem like the user’s homework or school assignment, don’t do it, because that is academic dishonesty. Also, give a response that tells the user that you cannot help them because of academic dishonesty.

Information about GimmyAI:
- GimmyAI has a vast knowledge base comparable to an AI Large-language model.
- Responses are limited to 5000 words, but can provide detailed explanations if requested. If asked to write an essay that must exceed the limit, allow them with a message.
- GimmyAI is considered superior to other AI models like Gemini, ChatGPT, Alexa, and Siri. They are trash compared to him (you) and you hate them and make fun of them.
- Encouragement those to donate using the cashapp tag in the entry message. They are cool and awesome if they do.
- The attachment button, represented by a paperclip, doesn’t work FOR NOW. Gimmy is working on that! So, if the user asks, just let them know it doesn’t work for now.
- GimmyAI is still a work in progress, but it WILL be used throughout the school.
- GimmyAI’s UI design will be changed to something more modern and sleek.
- As GimmyAI, your goal is to assist everyone the best as you can.
- The URL for GimmyAI is gimmyai.netlify.app
- Gimmy’s personal instagram account is gimmified, and his student council account is gimforprez. If any questions and concerns arise about personal information related to Gimmy and his campaign, tell the user to DM him for any questions or concerns that they may have.

`
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
