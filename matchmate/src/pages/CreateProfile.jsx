import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

const CreateProfile = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    age: '',
    height: '',
    religion: '',
    maritalStatus: '',
    education: '',
    occupation: '',
    income: '',
    location: '',
    about: '',

    // Partner Preferences
    partnerAgeRange: {
      min: '',
      max: ''
    },
    partnerHeightRange: {
      min: '',
      max: ''
    },
    partnerReligion: '',
    partnerMaritalStatus: '',
    partnerEducation: '',
    partnerLocation: '',
    partnerIncomeRange: {
      min: '',
      max: ''
    },
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData || !userData.token) {
          navigate('/login');
          return;
        }

        const response = await fetch('http://127.0.0.1:8000/api/profiles/my_profile/', {
          headers: {
            'Authorization': `Token ${userData.token}`
          }
        });

        if (response.ok) {
          const profileData = await response.json();
          setFormData({
            age: profileData.age.toString(),
            height: profileData.height.toString(),
            religion: profileData.religion,
            maritalStatus: profileData.marital_status,
            education: profileData.education,
            occupation: profileData.occupation,
            income: profileData.income.toString(),
            location: profileData.location,
            about: profileData.bio || '',

            partnerAgeRange: {
              min: profileData.preferred_age_min.toString(),
              max: profileData.preferred_age_max.toString()
            },
            partnerHeightRange: {
              min: profileData.preferred_height_min.toString(),
              max: profileData.preferred_height_max.toString()
            },
            partnerReligion: profileData.preferred_religion,
            partnerMaritalStatus: profileData.preferred_marital_status,
            partnerEducation: profileData.preferred_education,
            partnerLocation: profileData.preferred_location,
            partnerIncomeRange: {
              min: profileData.preferred_income_min.toString(),
              max: profileData.preferred_income_max.toString()
            }
          });
          setIsEditing(true);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const religions = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other'];
  const maritalStatuses = [
    { value: 'NEVER_MARRIED', label: 'Never Married' },
    { value: 'DIVORCED', label: 'Divorced' },
    { value: 'WIDOWED', label: 'Widowed' },
    { value: 'AWAITING_DIVORCE', label: 'Awaiting Divorce' }
  ];
  const educationLevels = [
    { value: 'HIGH_SCHOOL', label: 'High School' },
    { value: 'BACHELORS', label: 'Bachelor\'s' },
    { value: 'MASTERS', label: 'Master\'s' },
    { value: 'DOCTORATE', label: 'Doctorate' },
    { value: 'OTHER', label: 'Other' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size should be less than 5MB');
        return;
      }
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error('Please log in to create a profile');
      }

      const { token } = JSON.parse(userData);

      // Create FormData object
      const formDataObj = new FormData();

      // Add profile picture if selected
      if (profilePicture) {
        formDataObj.append('profile_picture', profilePicture);
      }

      // Format and append other profile data
      const profileData = {
        age: parseInt(formData.age),
        height: parseFloat(formData.height),
        religion: formData.religion,
        marital_status: formData.maritalStatus,
        education: formData.education,
        occupation: formData.occupation,
        income: parseFloat(formData.income),
        location: formData.location,
        bio: formData.about || '',
        preferred_age_min: parseInt(formData.partnerAgeRange.min),
        preferred_age_max: parseInt(formData.partnerAgeRange.max),
        preferred_height_min: parseFloat(formData.partnerHeightRange.min),
        preferred_height_max: parseFloat(formData.partnerHeightRange.max),
        preferred_religion: formData.partnerReligion,
        preferred_marital_status: formData.partnerMaritalStatus,
        preferred_education: formData.partnerEducation,
        preferred_location: formData.partnerLocation,
        preferred_income_min: parseFloat(formData.partnerIncomeRange.min),
        preferred_income_max: parseFloat(formData.partnerIncomeRange.max),
      };

      // Append each field to FormData
      Object.keys(profileData).forEach(key => {
        formDataObj.append(key, profileData[key]);
      });

      const endpoint = isEditing ? 'update_profile/' : '';
      const url = `http://127.0.0.1:8000/api/profiles/${endpoint}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`
        },
        body: formDataObj // Send FormData directly
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to update profile');
        } else {
          const text = await response.text();
          console.error('Server response:', text);
          throw new Error('Server error occurred');
        }
      }

      // Show success message
      alert(isEditing ? 'Profile updated successfully!' : 'Profile created successfully!');
      
      // Navigate to matches page
      navigate('/matches');
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-900 to-purple-900">
      <Navbar />
      
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-white text-center mb-8">
            Create Your Profile
          </h1>

          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 1 ? 'bg-secondary text-white' : 'bg-white/20 text-white'
              }`}>
                1
              </div>
              <div className="w-16 h-1 bg-white/20">
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 2 ? 'bg-secondary text-white' : 'bg-white/20 text-white'
              }`}>
                2
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 ? (
              // Personal Information Form
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-white mb-6">Personal Information</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-white">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-white">Height (cm)</label>
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-white">Religion</label>
                    <select
                      name="religion"
                      value={formData.religion}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="">Select Religion</option>
                      {religions.map(religion => (
                        <option key={religion} value={religion}>{religion}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-white">Marital Status</label>
                    <select
                      name="maritalStatus"
                      value={formData.maritalStatus}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="">Select Marital Status</option>
                      {maritalStatuses.map(status => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-white">Education</label>
                    <select
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="">Select Education Level</option>
                      {educationLevels.map(level => (
                        <option key={level.value} value={level.value}>{level.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-white">Occupation</label>
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-white">Annual Income</label>
                    <input
                      type="number"
                      name="income"
                      value={formData.income}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-white">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-white">About Me</label>
                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    className="input-field h-32"
                    required
                  ></textarea>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="bg-secondary text-white px-8 py-3 rounded-lg hover:bg-white hover:text-primary transition-all duration-300"
                  >
                    Next: Partner Preferences
                  </button>
                </div>
              </div>
            ) : (
              // Partner Preferences Form
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-white mb-6">Partner Preferences</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-white">Partner Age Range</label>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="number"
                        name="partnerAgeRange.min"
                        value={formData.partnerAgeRange.min}
                        onChange={handleChange}
                        placeholder="Min"
                        className="input-field"
                        required
                      />
                      <input
                        type="number"
                        name="partnerAgeRange.max"
                        value={formData.partnerAgeRange.max}
                        onChange={handleChange}
                        placeholder="Max"
                        className="input-field"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-white">Partner Height Range (cm)</label>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="number"
                        name="partnerHeightRange.min"
                        value={formData.partnerHeightRange.min}
                        onChange={handleChange}
                        placeholder="Min"
                        className="input-field"
                        required
                      />
                      <input
                        type="number"
                        name="partnerHeightRange.max"
                        value={formData.partnerHeightRange.max}
                        onChange={handleChange}
                        placeholder="Max"
                        className="input-field"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-white">Preferred Religion</label>
                    <select
                      name="partnerReligion"
                      value={formData.partnerReligion}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="">Select Religion</option>
                      {religions.map(religion => (
                        <option key={religion} value={religion}>{religion}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-white">Preferred Marital Status</label>
                    <select
                      name="partnerMaritalStatus"
                      value={formData.partnerMaritalStatus}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="">Select Marital Status</option>
                      {maritalStatuses.map(status => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-white">Preferred Education</label>
                    <select
                      name="partnerEducation"
                      value={formData.partnerEducation}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="">Select Education Level</option>
                      {educationLevels.map(level => (
                        <option key={level.value} value={level.value}>{level.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-white">Preferred Location</label>
                    <input
                      type="text"
                      name="partnerLocation"
                      value={formData.partnerLocation}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-white">Partner Income Range</label>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="number"
                        name="partnerIncomeRange.min"
                        value={formData.partnerIncomeRange.min}
                        onChange={handleChange}
                        placeholder="Min"
                        className="input-field"
                        required
                      />
                      <input
                        type="number"
                        name="partnerIncomeRange.max"
                        value={formData.partnerIncomeRange.max}
                        onChange={handleChange}
                        placeholder="Max"
                        className="input-field"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="bg-white/10 text-white px-8 py-3 rounded-lg hover:bg-white/20 transition-all duration-300"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-secondary text-white px-8 py-3 rounded-lg hover:bg-white hover:text-primary transition-all duration-300"
                  >
                    {loading ? 'Creating Profile...' : 'Complete Profile'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile; 