import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import pic from '../assets/images/pic.jpg';

const About = () => {
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
        <div className="flex-grow flex items-center justify-center px-4 py-16 relative overflow-hidden">
          {/* Main Content */}
          <div className="container mx-auto relative z-10 w-full max-w-7xl">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">About MatchMate</h1>
              <p className="text-xl text-white/80">Connecting Hearts, Creating Stories</p>
            </div>

            {/* Mission Statement */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl hover:bg-white/10 transition-colors duration-300">
                <h2 className="text-2xl font-semibold mb-4 text-secondary">Our Mission</h2>
                <p className="text-white/80 leading-relaxed">
                  At MatchMate, we believe everyone deserves to find their perfect match. Our mission is to create meaningful connections 
                  through innovative technology and a deep understanding of human relationships.
                </p>
              </div>
            </div>

            {/* Statistics Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                <div className="text-3xl font-bold text-secondary mb-2">10K+</div>
                <div className="text-white/80">Happy Couples</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                <div className="text-3xl font-bold text-secondary mb-2">95%</div>
                <div className="text-white/80">Match Success Rate</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                <div className="text-3xl font-bold text-secondary mb-2">50+</div>
                <div className="text-white/80">Countries</div>
              </div>
            </div>

            {/* Features Section */}
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-semibold mb-6 text-secondary text-center">Why Choose Us?</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl hover:bg-white/10 transition-colors duration-300">
                  <h3 className="text-xl font-semibold text-secondary mb-2">Advanced Matching</h3>
                  <p className="text-white/80">Our sophisticated algorithm ensures you find the most compatible partners based on your preferences and personality.</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl hover:bg-white/10 transition-colors duration-300">
                  <h3 className="text-xl font-semibold text-secondary mb-2">Safe & Secure</h3>
                  <p className="text-white/80">Your privacy and security are our top priorities. All profiles are verified and your data is protected.</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl hover:bg-white/10 transition-colors duration-300">
                  <h3 className="text-xl font-semibold text-secondary mb-2">24/7 Support</h3>
                  <p className="text-white/80">Our dedicated support team is always available to help you with any questions or concerns.</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl hover:bg-white/10 transition-colors duration-300">
                  <h3 className="text-xl font-semibold text-secondary mb-2">Success Stories</h3>
                  <p className="text-white/80">Join thousands of happy couples who found their perfect match through MatchMate.</p>
                </div>
              </div>
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

export default About; 