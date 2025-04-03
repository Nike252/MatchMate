import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import bgImage from '../assets/images/bglogin.jpg';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      console.log('Attempting to login with:', {
        username: formData.email,
        password: formData.password
      });

      const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.email,
          password: formData.password,
        }),
        credentials: 'include'
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (!response.ok) {
        throw new Error(data.non_field_errors?.[0] || data.detail || 'Invalid email or password');
      }

      // Store the token and user data
      localStorage.setItem('user', JSON.stringify({
        token: data.token,
        user_id: data.user_id,
        email: data.email
      }));
      
      // Store login status
      localStorage.setItem('isLoggedIn', 'true');
      
      // Show success message
      alert('Login successful!');
      
      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setErrors({
        submit: error.message || 'Login failed. Please check your credentials.',
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
      <div className="flex-grow flex items-center justify-center relative z-10 px-4">
        <div className="w-full max-w-lg">
          {/* Login Form */}
          <div className="flex flex-col justify-center py-12 px-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl">
            <h1 className="text-4xl font-bold text-white mb-8 text-center">LOGIN TO YOUR ACCOUNT</h1>
            
            {errors.submit && (
              <div className="bg-red-500/20 text-white p-4 rounded-lg text-center">
                {errors.submit}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
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
              
              <div className="flex items-center justify-between pt-4">
                <div className="text-white">
                  Don't have an account? 
                  <Link to="/signup" className="text-secondary font-medium ml-1 hover:underline">
                    Sign Up now
                  </Link>
                </div>
                
                <button
                  type="submit"
                  className={`bg-white text-primary font-semibold px-10 py-3 rounded-lg hover:bg-secondary hover:text-white transition-all duration-300 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'LOGGING IN...' : 'LOGIN'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Contact Information Footer */}
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

export default Login; 