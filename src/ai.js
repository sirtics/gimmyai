import express from 'express';
import axios from 'axios';
const app = express();

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route for image interpretation
app.post('/interpret-image', async (req, res) => {
  try {
    const imageUrl = req.body.imageUrl;
    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required.' });
    }

    // Call the OpenAI API for image interpretation
    const openaiApiKey = import.meta.env.VITE_API_KEY; // Replace with your actual API key
    const openaiResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
      image: imageUrl,
      model: 'gpt-4o' // Specify the desired model
    }, {
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
      }
    });

    // Extract the interpretation from the OpenAI response
    const interpretation = openaiResponse.data.data.objects.map(obj => obj.description).join(', ');

    // Return the interpretation as the API response
    res.json({ interpretation });
  } catch (error) {
    console.error('Error interpreting image:', error);
    res.status(500).json({ error: 'An error occurred while interpreting the image.' });
  }
});

// Start the server
const PORT = import.meta.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});