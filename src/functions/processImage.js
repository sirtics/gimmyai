// functions/processImage.js

import axios from 'axios';

export async function handler(event) {
  try {
    const formData = new URLSearchParams(event.body);
    const image = formData.get('image');
    
    const API_KEY = import.meta.env.VITE_API_KEY; // Update this with the correct environment variable name

    const requestBody = {
      model: "gpt-4-turbo-2024-04-09", // Use your desired model here
      messages: [
        {
          role: "user",
          content: "What’s in this image?"
        },
        {
          role: "user",
          content: {
            type: "image_url",
            image_url: image
          }
        }
      ],
      max_tokens: 300
    };

    const response = await axios.post("https://api.openai.com/v1/chat/completions", requestBody, {
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    return {
      statusCode: response.status,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error("Error processing image:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "An error occurred while processing the image." })
    };
  }
}
