import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

const ViewProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdatingPhoto, setIsUpdatingPhoto] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        navigate('/login');
        return;
      }

      const { token } = JSON.parse(userData);
      const response = await fetch('http://127.0.0.1:8000/api/profiles/my_profile/', {
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpdate = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setIsUpdatingPhoto(true);
    setError(null);

    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        navigate('/login');
        return;
      }

      const { token } = JSON.parse(userData);
      const formData = new FormData();
      formData.append('profile_picture', file);

      const response = await fetch('http://127.0.0.1:8000/api/profiles/update_profile/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to update profile picture');
      }

      // Refresh profile data
      await fetchProfile();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUpdatingPhoto(false);
    }
  };

  const handleDeleteProfile = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        navigate('/login');
        return;
      }

      const { token } = JSON.parse(userData);
      const response = await fetch('http://127.0.0.1:8000/api/profiles/delete_profile/', {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete profile');
      }

      // Clear user data and redirect to login
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-900 to-purple-900">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-white text-xl">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-900 to-purple-900">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-red-400 text-xl">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-purple-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">Your Profile</h1>
            <button
              onClick={() => navigate('/create-profile')}
              className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-white hover:text-primary transition-colors duration-300"
            >
              Edit Profile
            </button>
          </div>

          {/* Profile Picture Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-40 h-40 rounded-full overflow-hidden mb-4">
              {profile.profile_picture ? (
                <img
                  src={profile.profile_picture.startsWith('http') ? profile.profile_picture : `http://127.0.0.1:8000${profile.profile_picture}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Image load error:', e);
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9ImZlYXRoZXIgZmVhdGhlci11c2VyIj48cGF0aCBkPSJNMjAgMjF2LTJhNCA0IDAgMCAwLTQtNEg4YTQgNCAwIDAgMC00IDR2MiI+PC9wYXRoPjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCI+PC9jaXJjbGU+PC9zdmc+';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500">
                  <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpdate}
                className="hidden"
                id="profile-picture-update"
                disabled={isUpdatingPhoto}
              />
              <label
                htmlFor="profile-picture-update"
                className={`inline-block bg-secondary hover:bg-white text-white hover:text-primary px-4 py-2 rounded-lg cursor-pointer transition-colors duration-300 ${
                  isUpdatingPhoto ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isUpdatingPhoto ? 'Updating...' : 'Update Photo'}
              </label>
              <p className="text-sm text-gray-300 mt-2">
                Maximum file size: 5MB<br />
                Recommended: Square image
              </p>
            </div>
          </div>

          {profile && (
            <div className="space-y-8">
              {/* Basic Information */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>
                <div className="grid md:grid-cols-2 gap-6 text-gray-200">
                  <div>
                    <p className="text-secondary">Name</p>
                    <p className="text-lg">{profile.user.first_name} {profile.user.last_name}</p>
                  </div>
                  <div>
                    <p className="text-secondary">Email</p>
                    <p className="text-lg">{profile.user.email}</p>
                  </div>
                  <div>
                    <p className="text-secondary">Age</p>
                    <p className="text-lg">{profile.age} years</p>
                  </div>
                  <div>
                    <p className="text-secondary">Height</p>
                    <p className="text-lg">{profile.height} cm</p>
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Personal Details</h2>
                <div className="grid md:grid-cols-2 gap-6 text-gray-200">
                  <div>
                    <p className="text-secondary">Religion</p>
                    <p className="text-lg">{profile.religion}</p>
                  </div>
                  <div>
                    <p className="text-secondary">Marital Status</p>
                    <p className="text-lg">{getMaritalStatusLabel(profile.marital_status)}</p>
                  </div>
                  <div>
                    <p className="text-secondary">Education</p>
                    <p className="text-lg">{getEducationLabel(profile.education)}</p>
                  </div>
                  <div>
                    <p className="text-secondary">Occupation</p>
                    <p className="text-lg">{profile.occupation}</p>
                  </div>
                  <div>
                    <p className="text-secondary">Annual Income</p>
                    <p className="text-lg">${profile.income.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-secondary">Location</p>
                    <p className="text-lg">{profile.location}</p>
                  </div>
                </div>
              </div>

              {/* Partner Preferences */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Partner Preferences</h2>
                <div className="grid md:grid-cols-2 gap-6 text-gray-200">
                  <div>
                    <p className="text-secondary">Age Range</p>
                    <p className="text-lg">{profile.preferred_age_min} - {profile.preferred_age_max} years</p>
                  </div>
                  <div>
                    <p className="text-secondary">Height Range</p>
                    <p className="text-lg">{profile.preferred_height_min} - {profile.preferred_height_max} cm</p>
                  </div>
                  <div>
                    <p className="text-secondary">Preferred Religion</p>
                    <p className="text-lg">{profile.preferred_religion}</p>
                  </div>
                  <div>
                    <p className="text-secondary">Preferred Marital Status</p>
                    <p className="text-lg">{getMaritalStatusLabel(profile.preferred_marital_status)}</p>
                  </div>
                  <div>
                    <p className="text-secondary">Preferred Education</p>
                    <p className="text-lg">{getEducationLabel(profile.preferred_education)}</p>
                  </div>
                  <div>
                    <p className="text-secondary">Preferred Location</p>
                    <p className="text-lg">{profile.preferred_location}</p>
                  </div>
                  <div>
                    <p className="text-secondary">Preferred Income Range</p>
                    <p className="text-lg">${profile.preferred_income_min.toLocaleString()} - ${profile.preferred_income_max.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">About Me</h2>
                <p className="text-gray-200 text-lg">{profile.bio || 'No bio provided'}</p>
              </div>

              {/* Delete Profile Section */}
              <div className="mt-12 pt-8 border-t border-white/10">
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Delete Profile
                  </button>
                  <p className="text-white/60 text-sm mt-2">
                    Warning: This action cannot be undone
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Delete Profile</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your profile? This action cannot be undone and you will lose all your data.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProfile}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-300"
              >
                Delete Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProfile; 