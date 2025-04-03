import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import pic from '../assets/images/pic.jpg';
import dining from '../assets/images/dining.jpg';
import dancing from '../assets/images/dancing.jpg';

const Home = () => {
  const navigate = useNavigate();

  const handleMatchesClick = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    navigate('/matches');
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Image with Subtle Overlay - Moved to top level */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: `url(${pic})`,
          filter: 'blur(8px)',
          transform: 'scale(1.1)'
        }}
      />
      <div className="fixed inset-0 z-0 bg-black/40" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        
        {/* Hero Section */}
        <div className="flex-grow flex items-center justify-center px-4 py-16 relative">
          <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col justify-center text-white space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
                Find Your <span className="text-secondary">Perfect Match</span>
              </h1>
              <p className="text-xl text-white/80 leading-relaxed">
                Join thousands of people discovering their perfect life partner every day on MatchMate. 
                Our advanced matching algorithm ensures you find someone who truly complements you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button 
                  onClick={handleMatchesClick}
                  className="bg-secondary text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Find Matches
                </button>
                <Link 
                  to="/about" 
                  className="bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Learn More
                </Link>
              </div>
            </div>
            
            <div className="hidden md:flex items-center justify-center">
              <div className="relative w-full max-w-lg transform hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-secondary/20 rounded-2xl blur-2xl"></div>
                <img 
                  src={pic} 
                  alt="Happy couple" 
                  className="relative w-full h-[500px] object-cover rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Image Banner Section */}
        <div className="relative py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-secondary to-primary rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                <div className="relative bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
                  <div className="aspect-w-16 aspect-h-9 mb-6">
                    <img 
                      src={dining} 
                      alt="Romantic dinner setting" 
                      className="w-full h-[400px] object-cover object-[center_40%] rounded-xl shadow-xl transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Perfect Date Ideas</h3>
                  <p className="text-white/80">Discover romantic restaurants and activities perfect for your first date. Our curated suggestions ensure a memorable experience.</p>
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                <div className="relative bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
                  <div className="aspect-w-16 aspect-h-9 mb-6">
                    <img 
                      src={dancing} 
                      alt="Couple dancing together" 
                      className="w-full h-[400px] object-cover object-[center_40%] rounded-xl shadow-xl transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Shared Experiences</h3>
                  <p className="text-white/80">Find activities and hobbies you both love. Build stronger connections through shared interests and adventures.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="relative py-20 px-4 bg-gradient-to-b from-transparent via-black/50 to-black/80">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-primary mb-12">Why Choose MatchMate?</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Perfect Matches</h3>
                <p className="text-gray-600">Our advanced algorithm finds the most compatible partners based on your preferences and personality.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 116 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
                <p className="text-gray-600">Your privacy and security are our top priorities. All profiles are verified and your data is protected.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Growing Community</h3>
                <p className="text-gray-600">Join our diverse and ever-growing community of singles looking for meaningful relationships.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Success Stories */}
        <div className="bg-gradient-to-b from-black/80 to-transparent py-16 px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-white mb-4">Success Stories</h2>
            <p className="text-xl text-white/80 text-center mb-12 max-w-2xl mx-auto">
              Real people, real connections, real love stories. Here's what our happy couples have to say.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl hover:bg-white/20 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary to-primary rounded-full mr-4 flex items-center justify-center relative group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary via-primary to-secondary bg-[length:200%_100%] animate-gradient"></div>
                    <div className="relative flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 15C10.2091 15 12 13.2091 12 11C12 8.79086 10.2091 7 8 7C5.79086 7 4 8.79086 4 11C4 13.2091 5.79086 15 8 15Z" fill="currentColor"/>
                        <path d="M16 15C18.2091 15 20 13.2091 20 11C20 8.79086 18.2091 7 16 7C13.7909 7 12 8.79086 12 11C12 13.2091 13.7909 15 16 15Z" fill="currentColor"/>
                        <path d="M12 16C9.79086 16 8 17.7909 8 20V22H16V20C16 17.7909 14.2091 16 12 16Z" fill="currentColor"/>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white">Aman & Priya</h4>
                    <p className="text-secondary">Married for 2 years</p>
                  </div>
                </div>
                <p className="text-white/80 italic">
                  "We matched on MatchMate and instantly connected. After a few weeks of chatting, we met and knew we were perfect for each other. Thank you MatchMate for helping us find true love!"
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl hover:bg-white/20 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full mr-4 flex items-center justify-center relative group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] animate-gradient"></div>
                    <div className="relative flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 16C9.79086 16 8 17.7909 8 20V22H16V20C16 17.7909 14.2091 16 12 16Z" fill="currentColor"/>
                        <path d="M12 14C14.2091 14 16 12.2091 16 10C16 7.79086 14.2091 6 12 6C9.79086 6 8 7.79086 8 10C8 12.2091 9.79086 14 12 14Z" fill="currentColor"/>
                        <path d="M18 22V20C18 18.4023 17.1187 16.9847 15.8127 16.1953C16.8385 16.6938 17.5 17.7798 17.5 19V21.5H18Z" fill="currentColor"/>
                        <path d="M6 22V20C6 18.4023 6.88131 16.9847 8.18734 16.1953C7.16154 16.6938 6.5 17.7798 6.5 19V21.5H6Z" fill="currentColor"/>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white">Rahul & Neha</h4>
                    <p className="text-secondary">Engaged after 6 months</p>
                  </div>
                </div>
                <p className="text-white/80 italic">
                  "MatchMate's compatibility test really works! We were matched based on our similar interests and values, and now we're planning our wedding. Couldn't be happier!"
                </p>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Link 
                to="/create-profile" 
                className="inline-block bg-secondary text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Start Your Success Story
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Home; 