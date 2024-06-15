import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Entrance from './Entrance';
import Chat from './Chat';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Entrance />} />
        <Route path="chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;