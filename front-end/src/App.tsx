import './App.css'
import VerificationPage from './pages/VerificationPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddRoomPage from './pages/AddRoomPage';
import RoomPage from './pages/RoomPage';

function App() {
  return (


    <Router>

      <Routes>
        <Route path="/" element={<VerificationPage />} />
        <Route path="/users/:userId/rooms" element={<HomePage />} />
        <Route path="/:userId/add-room" element={<AddRoomPage />} />
        <Route path="/room/:roomId" element={<RoomPage />} />

      </Routes>
    </Router>
  );
}

export default App
