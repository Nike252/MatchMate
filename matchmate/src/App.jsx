import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import About from './pages/About';
import Help from './pages/Help';
import CreateProfile from './pages/CreateProfile';
import Matches from './pages/Matches';
import ViewProfile from './pages/ViewProfile';
import Messages from './pages/Messages';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} />
        <Route path="/create-profile" element={<CreateProfile />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/view-profile" element={<ViewProfile />} />
        <Route path="/messages" element={<Messages />} />
      </Routes>
    </Router>
  );
}

export default App;
