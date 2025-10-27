# GimmyAI - Your AI Learning Companion

Get guided help with math, science, english, and more. Upload images of your problems for personalized learning guidance that builds understanding, not shortcuts.

## Features

- AI-powered learning guidance
- Support for text, images, PDFs, and documents
- Secure authentication with Firebase
- Real-time chat interface
- Responsive design for all devices
- Modern and intuitive UI
- Focus on understanding over quick answers
- Encourages academic persistence

## Tech Stack

- **Frontend**: React + Vite
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **AI**: OpenAI GPT-4
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Notifications**: Sonner

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/girmmy/gimmyai.git
   cd gimmyai
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Firebase and OpenAI credentials:

   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_OPENAI_API_KEY=your_openai_api_key
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── components/         # React components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and configurations
├── firebase/          # Firebase configuration and services
├── App.tsx            # Main application component
└── main.tsx           # Application entry point
```

## Features in Detail

### AI-Powered Learning Guidance

- Get guided help that builds understanding
- Upload images for personalized learning assistance
- Focus on concepts rather than quick answers
- Encourages critical thinking and persistence
- Step-by-step solutions with explanations
- Support for multiple subjects (math, science, english, etc.)

### Real-time Chat Interface

- Interactive conversations with AI
- Message history and conversation management
- File upload support
- Responsive design for all devices

### User Authentication

- Secure sign-up and sign-in
- User profile management
- Conversation history per user
- Privacy and data protection

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help, feel free to:

- Open an issue on GitHub
- Contact us at gimmys943@gmail.com
- Visit our website at [gimmyai.com](https://gimmyai.com)

## Acknowledgments

- Built with ❤️ for students
- Powered by OpenAI GPT-4
- Styled with Tailwind CSS
- Icons from Heroicons

---

**Project Link**: [https://github.com/girmmy](https://github.com/girmmy)
