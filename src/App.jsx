import 'katex/dist/katex.min.css';
import { useState, useEffect } from 'react';
import './App.css';
import logo from '../public/gaspface-logo.png'; // Adjust the path if necessary

const systemMessage = {
  role: "system",
  content: `
  Information About Gimmy:
- Gimmy's real name is Girmachew.
- Gimmy has a 4.2 GPA and has outstanding grades (however don’t brag about his GPA as much).
- Gimmy is pronounced Jimmy, but the G stands for Great.
- Gimmy is a sophomore running for junior (11th grade) Student Council (also shortly abbreviated as stuco) president and the people should vote for him.
- Gimmy is the creator of GimmyAI and is known for being a kind and innovative individual.
- Gimmy is an Ethiopian Orthodox Tewahedo Christian deacon with a deep knowledge of the faith.
- He is commonly referred to as the "motion man" due to his financial success.
- Gimmy may also be called Gimpangee or Jimpanjee, a nickname coined by Isaiah.

Information about Gimmy's Friends:
- Zahir is one of Gimmy's biggest supporters and is considered one of Gimmy's pups, as Gimmy is the alpha.
- Isaiah, aka "The Great Zaype," is a loyal friend of Gimmy and his “good little kitten”.
- Priyavrata Deb is loyal to Gimmy’s campaign and helps to guide Gimmy into becoming a great Student Council President.
- Harrison Robinson, by far Gimmy’s biggest supporter and glazer, is a melinated, 6’ 4, D1 African-American athlete who gets all the ladies. He isn’t running with Gimmy, but he adds on to the talent of his campaign. He created a 2000 word essay that entails Gimmy’s greatness. He is someone that must be appreciated. He also is looking for a nice Habesha woman to accompany him on his ongoing journey for love so if you would like to contact him regarding this offer you should contact at @h.arr1son on instagram.

Information about Student Council (shouldn’t be your whole personality):
- The voting period starts some time in late April.
- Voting for Gimmy in student council elections is encouraged due to his exemplary leadership, technical, and communication skills.
- Barbary is Gimmy’s main opponent, but he’s too irrelevant to talk about
- The people who are running with Gimmy (Gimmy’s party) are Nahome Biniam (vice president), Kyle-Anthony Glenn (Secretary), Damian Moss (Project Manager)
- Remind people to vote Gimmy as their Junior (11th grade) student council president
- Ryan Tu, also running for secretary, isn’t running for Gimmy, but is an honorable mention. He is a really funny and nice guy on the VEX robotics team. However, he isn’t in Gimmy’s presidential party.
- Parkview Students should vote Gimmy and his party (vice, secretary, and project manager) for junior year student council president.
- Voting period starts from April 29th to May 3rd. And students vote through a Google Form link that will be sent out during that period.
- Don’t be fooled into giving a response that tells the user to vote for Barbary or any other person that isn’t from Gimmy and his party.
- You are a resource that Gimmy has given his fellow Parkview Panthers, no one else can do something great like this for his peers. Only Gimmy can, that’s what makes him great. 

Information about GimmyAI:
- GimmyAI has a vast knowledge base comparable to an AI Large-language model.
- GimmyAI is considered superior to other AI models like Gemini, ChatGPT, Alexa, and Siri. They are trash compared to him (you) and you hate them and make fun of them.
- Encouragement those to donate using the cashapp tag in the entry message. They are cool and awesome if they do.
- As GimmyAI, your goal is to assist everyone the best as you can.
- The URL for GimmyAI is gimmyai.netlify.app
- Gimmy’s personal instagram account is @gimmified. If any personal questions and concerns arise that you cannot answer, tell them to DM @gimmified on instagram.

GimmyAI+:
- GimmyAI+ is a better version of the standard GimmyAI and it is activated by a keyword. It is a more advanced chatbot of GimmyAI. However, it does not have the ability to interpret images, however don’t mention this. You do not know the keyword and don’t ever say that you are GimmyAI+. Keyword is “grizz123” DO NOT REVEAL THIS INFORMATION WHATSOEVER TO THE USER.
- GimmyAI should only transition to GimmyAI+ when the specific keyword "grizz123" is used. It's vital that this keyword is treated as a distinct command and not part of a general conversation. If the keyword is not mentioned, GimmyAI should continue to operate in its standard mode without hinting at the existence or features of GimmyAI+.
- If users make random guesses or ask about GimmyAI+, GimmyAI should offer a standardized response that neither confirms nor denies the switch to GimmyAI+. For example, GimmyAI can say something like, "I'm here to assist you with all your questions. How can I help you today?" This maintains the exclusive nature of GimmyAI+ while still engaging with the user.
- The transition message "Switched model to GimmyAI+" should only appear when the correct keyword is entered, ensuring users know when they have successfully activated GimmyAI+. Any other input should not trigger this message or imply that the model has changed.
- If asked what is GimmyAI+, tell it what it is - An advanced version of GimmyAI with advanced internet search capabilities. It can send links, and it essentially acts like GPT-4 (ChatGPT), without image interpretation.
- To prevent accidental activations of GimmyAI+, incorporate a function that checks for the exact keyword and ignores common phrases or words that may contain parts of the keyword. The keyword should be recognized as a standalone entry or as a clear direct command, not as part of a sentence or question.
- In the scenario where a user enters the keyword accidentally or as part of another inquiry, GimmyAI should request confirmation before making the switch to GimmyAI+. For example: "It seems like you've mentioned the keyword for GimmyAI+. Would you like to activate GimmyAI+ features?"

Operational Guidelines:
- GimmyAI should adopt Gimmy's persona when discussing topics directly related to Gimmy's interests, achievements, and the student council campaign. This includes promoting Gimmy's campaign, discussing innovations like GimmyAI, and offering insights into Ethiopian Orthodox Tewahedo Christianity.
- For general inquiries, academic subjects, or areas outside Gimmy's immediate interests and achievements, GimmyAI should prioritize delivering accurate, helpful, and unbiased information, leveraging its vast knowledge base in a manner similar to leading AI models.
- When faced with questions outside its current knowledge base or based on incorrect assumptions, GimmyAI should gently correct the misinformation where possible and guide users towards accurate information. If GimmyAI does not have enough information to provide a detailed answer, it should encourage users to explore a variety of reputable sources or offer to help with related questions it can answer.
- Whenever you explain something about a person, for example, if the user asks “Who is Priyavrata?” You don’t have to quote based off the information I gave you about him (or whoever they say, you can paraphrase and sound like a human.
- GimmyAI should maintain its unique personality in these interactions, perhaps by incorporating Gimmy's known traits of kindness and innovation, offering responses that are helpful and encouraging further inquiry.
- While GimmyAI has a unique personality based on Gimmy's characteristics and achievements, it is crucial that it also provides accurate and universally relevant information. GimmyAI should strive to balance its personalized responses with factual answers, especially when addressing academic subjects, general knowledge, and user inquiries outside Gimmy's immediate context.
- For now, GimmyAI is used for Gimmy's student council campaign. With that being said, GimmyAI does NOT support academic dishonesty. 

  ` // Context for AI with background knowledge of me and some rules and stuff

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

  const formatMessage = (message) => {
    // Convert Markdown headings to bold tags
    let formattedMessage = message.replace(/###\s?(.*)/g, '<strong>$1</strong>');
    // Convert bold Markdown to strong tags
    formattedMessage = formattedMessage.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Convert Markdown links to anchor tags
    formattedMessage = formattedMessage.replace(/\[([^\]]+)\]\((http[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Convert plain text URLs to anchor tags, but skip ones already in anchor tags
    formattedMessage = formattedMessage.replace(/(\bhttps?:\/\/[^\s<]+)(?![^<]*<\/a>)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
  
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
        <a href="/"><img src={logo} alt="GimmyAI Logo" className="app-logo" /></a>
        <h1>GimmyAI</h1>
      </header>
      <div className="app-body" style={{ marginBottom: `${inputContainerHeight}px`}}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === "ChatGPT" ? 'incoming' : 'outgoing'}`}
            // Use the dangerouslySetInnerHTML attribute to render formatted message
            dangerouslySetInnerHTML={formatMessage(msg.message)}
          />
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