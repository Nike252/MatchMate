import React from 'react';
import { useNavigate } from 'react-router-dom';

const MatchCard = ({ match }) => {
  const navigate = useNavigate();

  const getEducationLabel = (value) => {
    const educationMap = {
      'HIGH_SCHOOL': 'High School',
      'BACHELORS': "Bachelor's Degree",
      'MASTERS': "Master's Degree",
      'DOCTORATE': 'Doctorate',
      'OTHER': 'Other'
    };
    return educationMap[value] || value;
  };

  const getMaritalStatusLabel = (value) => {
    const maritalStatusMap = {
      'NEVER_MARRIED': 'Never Married',
      'DIVORCED': 'Divorced',
      'WIDOWED': 'Widowed',
      'AWAITING_DIVORCE': 'Awaiting Divorce'
    };
    return maritalStatusMap[value] || value;
  };

  const handleExpressInterest = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      console.log('Attempting to express interest for profile:', match.user.id);
      
      // Updated URL to use user.id instead of profile.id
      const response = await fetch(`http://127.0.0.1:8000/api/profiles/${match.user.id}/express_interest/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${userData.token}`,
          'Content-Type': 'application/json'
        }
      });

      // Get response data
      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('Error response data:', responseData);
        throw new Error(responseData.detail || 'Failed to express interest');
      }

      // Show appropriate message based on whether interest was already expressed
      if (responseData.already_expressed) {
        console.log('Already expressed interest, redirecting to messages');
      } else {
        console.log('Interest expressed successfully, redirecting to messages');
      }
      
      // Navigate to messages page with the selected user's ID and name
      navigate('/messages', { 
        state: { 
          selectedUserId: responseData.user_id || match.user.id, 
          selectedUserName: responseData.user_name || match.user.first_name 
        } 
      });
    } catch (error) {
      console.error('Error expressing interest:', error);
      alert(error.message || 'Failed to express interest. Please try again.');
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden">
      {/* Profile Image */}
      <div className="relative h-48">
        <img
          src={match.profile_picture || 'https://via.placeholder.com/400x300'}
          alt={`${match.user.first_name}'s profile`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      {/* Profile Info */}
      <div className="p-6">
        <h3 className="text-2xl font-semibold text-white mb-2">
          {match.user.first_name}, {match.age}
        </h3>
        
        <div className="space-y-3 text-gray-300">
          <p className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {match.location}
          </p>
          
          <p className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
            </svg>
            {getEducationLabel(match.education)}
          </p>
          
          <p className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5z" clipRule="evenodd" />
            </svg>
            {match.occupation}
          </p>
          
          <p className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            {match.religion}
          </p>

          <p className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
            </svg>
            {getMaritalStatusLabel(match.marital_status)}
          </p>
        </div>
        
        <p className="mt-4 text-gray-300 line-clamp-3">{match.bio || 'No bio available'}</p>
        
        <button 
          onClick={handleExpressInterest}
          className="mt-6 w-full bg-secondary hover:bg-white text-white hover:text-primary py-3 px-6 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
          <span>Express Interest</span>
        </button>
      </div>
    </div>
  );
};

export default MatchCard; 