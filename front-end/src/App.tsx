import './App.css'
import VerificationPage from './pages/VerificationPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddRoomPage from './pages/AddRoomPage';

function App() {
  return (


    <Router>

      <Routes>
        <Route path="/" element={<VerificationPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/add-room" element={<AddRoomPage />} />
      </Routes>
    </Router>
  );
}

export default App
