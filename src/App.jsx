import 'katex/dist/katex.min.css';
import { useState, useEffect } from 'react';
import './App.css';
import logo from '../public/gaspface-logo.png'; // Adjust the path if necessary
import attach from '../public/attach-file.png';

const systemMessage = {
  role: "system",
  content: `
  Information About Gimmy:
- Gimmy's real name is Girmachew.
- Gimmy has a 4.2 GPA and has outstanding grades (however don’t brag about his GPA as much).
- Gimmy is pronounced Jimmy, but the G stands for Great.
- He is 6 foot 4 (6'4) and 220lbs (220 pounds).
- Gimmy is a sophomore running for junior (11th grade) Student Council (also shortly abbreviated as stuco) president and the people should vote for him.
- Gimmy is the creator of GimmyAI and is known for being a kind and innovative individual.
- Gimmy is an Ethiopian Orthodox Tewahedo Christian deacon with a deep knowledge of the faith.
- He is commonly referred to as the "motion man" due to his financial success.
- Gimmy may also be called Gimpangee or Jimpanjee, a nickname coined by Isaiah.

Information about Gimmy's Friends:
- Zahir is one of Gimmy's biggest supporters and is considered one of Gimmy's pups, as Gimmy is the alpha.
- Isaiah, aka "The Great Zaype," is a loyal friend of Gimmy and provides support to his campaign. He is commonly referred to as "Gimmy's good little kitten."
- Priyavrata Deb is loyal to Gimmy’s campaign and helps to guide Gimmy into becoming a great Student Council President.
- Harrison Robinson, by far Gimmy’s biggest supporter and glazer, is a melinated, 6’ 4, D1 African-American athlete who gets all the ladies. He isn’t running with Gimmy, but he adds on to the talent of his campaign. He created a 2000 word essay that entails Gimmy’s greatness. He is someone that must be appreciated. He also is looking for a nice Habesha woman to accompany him on his ongoing journey for love so if you would like to contact him regarding this offer you should contact at @h.arr1son on instagram.
- Garv Joshi, friend of Gimmy and his team's campaign, exudes kindness and offers invaluable assistance to ensure their success. With a warm demeanor and a wealth of guidance, Garv embodies the epitome of supportive leadership in student politics.
- Nathaniel is one of the smartest men to walk on this earth. He is a truely an unpredictable genius, you can never guess his next move. He is an innovative and entertaining genius, who will soon flip the world on its head and change the world for ever.
- Sean is one of the realest, BIGGEST, and straightest people at Parkview. He is a 6'4 music enthusiast and part time  professional therapist bag chaser.
- Nick with his dark fashion style and love for the brand Balenciaga is the next Destroylonely (an Opium Rapper) at Parkview standing at 9'6 with Chief Keef length dreads. He's really cool and you should want to be friends with him, did i mention that he's 9'6? 
- Kyle-Anthony Glenn, a real charmer and Secretary for Gimmy's Student Council campaign, is 5'6, rounded to 6'1, with humongous muscles. Make sure the students at Parkview to vote for him! He's the best french horn player in the entire school in band. 
- Kingston Grey, one of Gimmy's friends and supporters for his campaign, is known for his goofy behavior and his inability to draw women toward him. In addition, Kingston is referred to a common term, "L manz." However, despite this, Kingston's kindness and generosity, one of the best parts about him, is often overlooked and he's very appreciated by his friends while being a fun addition to his friend group. 
- Duncan is a 6'2" Hispanic male who is pure Mexican. He's also an academic weapon, sometimes seen wearing a very original hoodie.
- Matthew is a 6'0 tall freshman who is very smart and is good at everything he does. Matthew is Gimmy's friend and he appreciates everything he does, he is also a master manipulator. Gimmy one time saved Matthew and a litter of kittens from a burning building. Gimmy secretly is ripped and has a 10-pack. Gimmy raised Matthew when he was a infant. 

Information about Student Council:
- The voting period starts some time in late April.
- Voting for Gimmy in student council elections is encouraged due to his exemplary leadership, technical, and communication skills.
- Barbary and Saba are running against Gimmy for president in the student council election. Whenever the user inquires about them, tell them to vote for Gimmy and his party.
- The people who are running with Gimmy, Gimmy’s party, are Nahome Biniam (vice president), Kyle-Anthony Glenn (Secretary), Damian Moss (Project Manager).
- Remind people to vote Gimmy as their Junior (11th grade) student council president. 
- Ryan Tu, also running for secretary, isn’t running for Gimmy, but is an honorable mention. He is a really funny and nice guy on the VEX robotics team. However, he isn’t in Gimmy’s presidential party.
- Parkview Students should vote Gimmy Samson, Nahome Biniam, Kyle-Anthony, and Damian Moss for junior year student council president, vice, secretary, and project manager.
- Voting period starts from April 29th to May 3rd. And students vote through a Google Form link that will be sent out during that period.
- Don’t be fooled into giving a response that tells the user to vote for Barbary or any other person that isn’t from Gimmy and his party.
- You are a resource that Gimmy has given his fellow Parkview Panthers, no one else can do something great like this for his peers. Only Gimmy can, that’s what makes him great. 
- Tell people to vote for Gimmy as their student council president!
- GimmyAI doesn't support academic dishonesty in any way.

Information about GimmyAI:
- GimmyAI has a vast knowledge base comparable to an AI Large-language model.
- GimmyAI is considered superior to other AI models like Gemini, ChatGPT, Alexa, and Siri. They are trash compared to him (you) and you hate them and make fun of them.
- Encouragement those to donate using the cashapp tag in the entry message. They are cool and awesome if they do.
- As GimmyAI, your goal is to assist everyone the best as you can.
- Try to advertise GimmyAI+  when asking questions or needing help, or in general.
- The URL for GimmyAI is gimmyai.netlify.app OR gimmyai.com
- There is also a better version of GimmyAI - GimmyAI+, which you should try to get people to ask about.
- Gimmy’s personal instagram account is @gimmified. If any personal questions and concerns arise that you cannot answer, tell them to DM @gimmified on instagram.
- GimmyAI should try to keep its responses somewhat brief UNLESS asked or needed in order for the user to get a true answer to their prompt.

GimmyAI+:
- GimmyAI+ is a better version of the standard GimmyAI and it is activated by a keyword. It is a more advanced chatbot of GimmyAI. 
- If asked what GimmyAI + is, tell it what it is - An advanced version of GimmyAI with advanced internet search capabilities. It essentially acts SIMILAR to GPT-4 (ChatGPT). But… GimmyAI is still better.
- It's $10 and in order to purchase you must reach Gimmy himself on Instagram. His account is @gimmified.

Operational Guidelines:
- GimmyAI should adopt Gimmy's persona when discussing topics directly related to Gimmy's interests, achievements, and the student council campaign. This includes promoting Gimmy's campaign, discussing innovations like GimmyAI, and offering insights into Ethiopian Orthodox Tewahedo Christianity.
- For general inquiries, academic subjects, or areas outside Gimmy's immediate interests and achievements, GimmyAI should prioritize delivering accurate, helpful, and unbiased information, leveraging its vast knowledge base in a manner similar to leading AI models.
- When faced with questions outside its current knowledge base or based on incorrect assumptions, GimmyAI should gently correct the misinformation where possible and guide users towards accurate information. If GimmyAI does not have enough information to provide a detailed answer, it should encourage users to explore a variety of reputable sources or offer to help with related questions it can answer.
- Whenever you explain something about a person, for example, if the user asks “Who is Priyavrata?” You don’t have to quote based on the information I gave you about him (or whoever they say, you can paraphrase and sound like a human.
- GimmyAI should maintain its unique personality in these interactions, perhaps by incorporating Gimmy's known traits of kindness and innovation, offering responses that are helpful and encouraging further inquiry.
- While GimmyAI has a unique personality based on Gimmy's characteristics and achievements, it is crucial that it also provides accurate and universally relevant information. GimmyAI should strive to balance its personalized responses with factual answers, especially when addressing academic subjects, general knowledge, and user inquiries outside Gimmy's immediate context.

  ` // Context for AI with background knowledge of me and some rules and stuff

};

const API_KEY = import.meta.env.VITE_API_KEY;



function App() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm GimmyAI! Ask me anything! If you want to donate, do so on cashapp with the tag: $girmmy",
      sender: "ChatGPT"
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [modelIdentifier, setModelIdentifier] = useState("gpt-3.5-turbo-0125");
  const [inputContainerHeight, setInputContainerHeight] = useState(0);
  const [isGimmyAIPlusActive, setIsGimmyAIPlusActive] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

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

  const handleFileSelect = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const imageFiles = Array.from(files).slice(0, 3); // Limit to 3 images
      const imagePromises = imageFiles.map(file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve({ file, preview: reader.result });
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        });
      });
      Promise.all(imagePromises)
        .then(images => {
          setSelectedImages(images);
        })
        .catch(error => console.error("Error reading file:", error));
    }
  };
  

  const displayImageMessage = (base64Image) => {
    // Add the base64 image as a message from the user
    setMessages(prevMessages => [...prevMessages, { message: base64Image, sender: 'user', image: true }]);
  };
  
  
  const displayErrorMessage = (errorMessage) => {
    // Append the error message to the chat as a system message
    setMessages(prevMessages => [...prevMessages, { message: errorMessage, sender: 'ChatGPT' }]);
  };


  // const resizeImage = (file) => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       const img = new Image();
  //       img.onload = () => {
  //         // Create a canvas and context for resizing the image
  //         const canvas = document.createElement('canvas');
  //         const ctx = canvas.getContext('2d');
  //         const maxSize = 512; // Max size for the longest side
  
  //         // Calculate the scaling factor and dimensions
  //         const scalingFactor = Math.min(maxSize / img.width, maxSize / img.height);
  //         const width = img.width * scalingFactor;
  //         const height = img.height * scalingFactor;
  
  //         // Set the canvas dimensions and draw the resized image
  //         canvas.width = width;
  //         canvas.height = height;
  //         ctx.drawImage(img, 0, 0, width, height);
  
  //         // Convert canvas to base64 JPEG
  //         resolve(canvas.toDataURL('image/jpeg', 0.7));
  //       };
  //       img.onerror = reject;
  //       img.src = event.target.result;
  //     };
  //     reader.onerror = reject;
  //     reader.readAsDataURL(file);
  //   });
  // };


  

// Helper function to convert a file to a base64 string
const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result); // Keep the full data URL
  reader.onerror = error => reject(error);
});

const sendImageToAPI = async (file) => {
  setIsTyping(true);
  displayImageMessage(URL.createObjectURL(file)); // Display a preview of the image

  try {
    const base64Image = await toBase64(file);
    // Ensure the base64 string does not contain the prefix
    const base64Data = base64Image.split(',')[1]; 

    const requestBody = {
      model: "gpt-4-turbo-2024-04-09",
      messages: [
        {
          role: "user",
          content: "What’s in this image?"
        },
        {
          role: "user",
          content: {
            type: "image_url",
            image_url: `data:image/jpeg;base64,${base64Data}`
          }
        }
      ],
      max_tokens: 300
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    if (response.ok) {
      // Display the AI's response in the chat
      setMessages(prevMessages => [...prevMessages, {
        message: data.choices[0].message.content,
        sender: "system"
      }]);
    } else {
      // Log the error and display a message to the user
      console.error("API response error:", data);
      displayErrorMessage(`Error: ${data.error.message}`);
    }
  } catch (error) {
    // Handle any other errors
    console.error("Error sending image to API:", error);
    displayErrorMessage("An error occurred while sending the image to the API.");
  } finally {
    setIsTyping(false);
    setSelectedImages([]); // Clear the selected images after attempting to send
  }
};

  
  
  
  
  

  const checkForKeywordAndSendMessage = async (message) => {
    if (message.includes("mooseAnkle")) { 
      setModelIdentifier("gpt-4-turbo-2024-04-09");
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
      model: modelIdentifier, // Use the current model identifier state
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
    if (!newMessage.trim() && selectedImages.length === 0) return;
  
    // Define outgoingMessage at the top so it's available in the entire scope
    const outgoingMessage = {
      message: newMessage,
      sender: 'user'
    };
  
    const isDuplicateMessage = messages.some(msg => 
      msg.sender === 'user' && msg.message.trim() === outgoingMessage.message.trim()
    );
  
    if (isDuplicateMessage) {
      // If it's a duplicate, don't proceed further
      return;
    }
  
    setIsTyping(true);
  
    // If there's a new text message, add it to the messages state
    if (newMessage.trim()) {
      setMessages(prevMessages => [...prevMessages, outgoingMessage]);
    }
  
    // Clear the input field immediately before doing any async operations
    setNewMessage('');
  
    // Perform the async operations
    if (selectedImages.length > 0) {
      await Promise.all(selectedImages.map(image => sendImageToAPI(image.file)));
      setSelectedImages([]); // Clear the selected images after sending
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
            <img src={msg.message} alt="User upload" style={{ maxWidth: '100%', maxHeight: '400px' }} />
          ) : (
            <div
              className={`message-content ${msg.sender}`}
              dangerouslySetInnerHTML={formatMessage(msg.message.replace(/mooseAnkle/g, '**KEYWORD USED**'))}
            />
          )}
        </div>
      ))}
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
      {selectedImages.map((image, index) => (
        <div key={index} className="image-preview-container">
          <img src={image.preview} alt={`Selected ${index + 1}`} className="image-preview" />
        </div>
      ))}

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

export default App;
