import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import MatchCard from '../components/MatchCard';
import pic from '../assets/images/pic.jpg';

const MessageBox = ({ match, onClose }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(`http://127.0.0.1:8000/api/messages/${match.id}/`, {
        headers: {
          'Authorization': `Token ${userData.token}`
        }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem('user'));
      await axios.post(`http://127.0.0.1:8000/api/messages/${match.id}/`, {
        content: message
      }, {
        headers: {
          'Authorization': `Token ${userData.token}`
        }
      });
      setMessage('');
      fetchMessages(); // Refresh messages
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-lg">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Chat with {match.user.first_name}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="p-4 h-96 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === userData.user_id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`rounded-lg px-4 py-2 max-w-[70%] ${
                msg.sender === userData.user_id 
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}>
                <p>{msg.content}</p>
                <p className="text-xs opacity-75 mt-1">
                  {new Date(msg.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <form onSubmit={sendMessage} className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minAge: '',
    maxAge: '',
    religion: '',
    maritalStatus: '',
    education: ''
  });

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const response = await fetch('http://127.0.0.1:8000/api/profiles/potential_matches/', {
        headers: {
          'Authorization': `Token ${userData.token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch matches');
      }
      
      const data = await response.json();
      console.log('Fetched matches:', data); // Debug log
      
      // Filter out the current user's profile
      const filteredMatches = data.filter(match => match.user.id !== userData.user_id);
      console.log('Filtered matches:', filteredMatches); // Debug log
      
      setMatches(filteredMatches);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching matches:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    // Filter logic here
  };

  const filteredMatches = matches;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background Image with Blur */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${pic})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px)',
          transform: 'scale(1.1)'
        }}
      />
      
      {/* Dark Overlay */}
      <div className="fixed inset-0 bg-black/50 z-10" />

      {/* Navbar */}
      <Navbar />

      {/* Content */}
      <div className="flex-grow relative z-20 container mx-auto px-4 py-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8">
          {/* Filter Section */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 shadow-xl">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
              Filter Matches
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Min Age</label>
                <input
                  type="number"
                  name="minAge"
                  value={filters.minAge}
                  onChange={handleFilterChange}
                  className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-secondary"
                  placeholder="18"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Max Age</label>
                <input
                  type="number"
                  name="maxAge"
                  value={filters.maxAge}
                  onChange={handleFilterChange}
                  className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-secondary"
                  placeholder="99"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Religion</label>
                <select
                  name="religion"
                  value={filters.religion}
                  onChange={handleFilterChange}
                  className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-secondary"
                >
                  <option value="">Any</option>
                  <option value="HINDU">Hindu</option>
                  <option value="MUSLIM">Muslim</option>
                  <option value="CHRISTIAN">Christian</option>
                  <option value="SIKH">Sikh</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Marital Status</label>
                <select
                  name="maritalStatus"
                  value={filters.maritalStatus}
                  onChange={handleFilterChange}
                  className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-secondary"
                >
                  <option value="">Any</option>
                  <option value="NEVER_MARRIED">Never Married</option>
                  <option value="DIVORCED">Divorced</option>
                  <option value="WIDOWED">Widowed</option>
                  <option value="AWAITING_DIVORCE">Awaiting Divorce</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Education</label>
                <select
                  name="education"
                  value={filters.education}
                  onChange={handleFilterChange}
                  className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-secondary"
                >
                  <option value="">Any</option>
                  <option value="HIGH_SCHOOL">High School</option>
                  <option value="BACHELORS">Bachelor's Degree</option>
                  <option value="MASTERS">Master's Degree</option>
                  <option value="DOCTORATE">Doctorate</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
            
            <button
              onClick={applyFilters}
              className="mt-6 bg-secondary hover:bg-white text-white hover:text-primary px-6 py-2 rounded-lg font-semibold transition-colors duration-300 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
              Apply Filters
            </button>
          </div>

          {/* Matches Grid */}
          {loading ? (
            <div className="text-center text-white text-xl">
              Loading matches...
            </div>
          ) : filteredMatches.length === 0 ? (
            <div className="text-center text-white text-xl">
              No matches found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMatches.map(match => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Matches; 