import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import bgImage from '../assets/images/bglogin.jpg';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: '',
    dateOfBirth: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate first name
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    // Validate last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Validate phone
    const phoneRegex = /^\d{10}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Invalid phone number format (10 digits required)';
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Validate gender
    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
    }

    // Validate date of birth
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        newErrors.dateOfBirth = 'You must be at least 18 years old';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Sending registration data:', {
        username: formData.email,
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName
      });

      const response = await fetch('http://127.0.0.1:8000/api/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.email,
          email: formData.email,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName
        }),
      });

      const data = await response.json();
      console.log('Registration response:', data);

      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed');
      }

      // Show success message
      alert('Registration successful! Please log in.');
      
      // Navigate to login page
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({
        submit: error.message || 'Registration failed. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-r from-blue-900 to-purple-900 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${bgImage})` }}>
      <Navbar />
      
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0 opacity-40 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"></div>
      
      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center relative z-10 py-16 px-4">
        <div className="w-full max-w-4xl bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">CREATE YOUR ACCOUNT</h1>
          
          {errors.submit && (
            <div className="bg-red-500/20 text-white p-4 rounded-lg text-center">
              {errors.submit}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label htmlFor="firstName" className="text-white text-lg">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`input-field ${errors.firstName ? 'border-red-500' : ''}`}
                  required
                />
                {errors.firstName && (
                  <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>
              
              <div className="space-y-1">
                <label htmlFor="lastName" className="text-white text-lg">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`input-field ${errors.lastName ? 'border-red-500' : ''}`}
                  required
                />
                {errors.lastName && (
                  <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
              
              <div className="space-y-1">
                <label htmlFor="email" className="text-white text-lg">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                  required
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              
              <div className="space-y-1">
                <label htmlFor="phone" className="text-white text-lg">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                  required
                />
                {errors.phone && (
                  <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
              
              <div className="space-y-1">
                <label htmlFor="password" className="text-white text-lg">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`input-field ${errors.password ? 'border-red-500' : ''}`}
                  required
                />
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                )}
              </div>
              
              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="text-white text-lg">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`input-field ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  required
                />
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
              
              <div className="space-y-1">
                <label htmlFor="gender" className="text-white text-lg">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`input-field ${errors.gender ? 'border-red-500' : ''}`}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-red-400 text-sm mt-1">{errors.gender}</p>
                )}
              </div>
              
              <div className="space-y-1">
                <label htmlFor="dateOfBirth" className="text-white text-lg">Date of Birth</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={`input-field ${errors.dateOfBirth ? 'border-red-500' : ''}`}
                  required
                />
                {errors.dateOfBirth && (
                  <p className="text-red-400 text-sm mt-1">{errors.dateOfBirth}</p>
                )}
              </div>
            </div>
            
            <div className="mt-8">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  className="mr-2"
                  required
                />
                <label htmlFor="agreeTerms" className="text-white">
                  I agree to the <Link to="/terms" className="text-secondary hover:underline">Terms and Conditions</Link>
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4">
              <div className="text-white">
                Already have an account? 
                <Link to="/login" className="text-secondary font-medium ml-1 hover:underline">
                  Login
                </Link>
              </div>
              
              <button
                type="submit"
                className={`bg-secondary text-white font-semibold px-10 py-3 rounded-lg hover:bg-white hover:text-primary transition-all duration-300 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'SIGNING UP...' : 'SIGN UP'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Contact Information */}
      <div className="relative z-10 mt-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white text-center py-8 px-4 bg-black/30 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <div className="rounded-full bg-white/10 p-3 mb-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
              </svg>
            </div>
            <div className="text-sm">Phone</div>
            <div className="font-light text-xs">123-456-7890</div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="rounded-full bg-white/10 p-3 mb-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
              </svg>
            </div>
            <div className="text-sm">E-Mail</div>
            <div className="font-light text-xs">hello@reallygreatsite.com</div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="rounded-full bg-white/10 p-3 mb-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
              </svg>
            </div>
            <div className="text-sm">Website</div>
            <div className="font-light text-xs">www.reallygreatsite.com</div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="rounded-full bg-white/10 p-3 mb-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
              </svg>
            </div>
            <div className="text-sm">Address</div>
            <div className="font-light text-xs">123 Anywhere St., Any City</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup; 