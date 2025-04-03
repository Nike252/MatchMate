import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import pic from '../assets/images/pic.jpg';

const Help = () => {
  const [activeTab, setActiveTab] = useState('faqs');
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  const faqs = [
    {
      question: "How do I create an account?",
      answer: "To create an account, click on the 'Sign Up' button in the top right corner of the homepage. Fill in your details in the registration form and submit. You will receive a verification email to confirm your account."
    },
    {
      question: "How can I search for matches?",
      answer: "After logging in, you can use our search filters to find potential matches based on various criteria such as age, location, religion, profession, and more. The search results will show profiles that match your preferences."
    },
    {
      question: "Are the profiles verified?",
      answer: "Yes, we verify all profiles to ensure authenticity. We have a robust verification process that includes email verification, phone verification, and optional ID verification for enhanced security."
    },
    {
      question: "How can I communicate with a potential match?",
      answer: "Once you find someone interesting, you can send them an interest request. If they accept, you can exchange messages through our secure messaging system."
    },
    {
      question: "Can I hide my profile temporarily?",
      answer: "Yes, you can deactivate your profile temporarily by going to 'Account Settings' and selecting 'Deactivate Profile'. Your profile will be hidden from search results until you reactivate it."
    },
    {
      question: "How can I report a fake profile?",
      answer: "If you suspect a profile is fake, you can report it by clicking on the 'Report Profile' button on their profile page. Our team will investigate and take appropriate action."
    }
  ];
  
  const supportTopics = [
    {
      title: "Account Issues",
      description: "Problems with login, registration, or account access."
    },
    {
      title: "Payment and Subscription",
      description: "Questions about payment methods, subscription plans, refunds, etc."
    },
    {
      title: "Profile Management",
      description: "Help with editing profiles, uploading photos, or privacy settings."
    },
    {
      title: "Technical Issues",
      description: "Problems with the website or app functioning, bugs, or errors."
    },
    {
      title: "Safety and Security",
      description: "Concerns about privacy, harassment, or suspicious activity."
    }
  ];

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/contact/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setContactForm({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => {
          setShowContactModal(false);
        }, 2000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
      console.error('Error submitting contact form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
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
        <div className="flex-grow flex items-center justify-center px-4 py-16 relative overflow-hidden">
          {/* Main Content */}
          <div className="container mx-auto relative z-10 w-full max-w-7xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">Help & Support</h1>
              <p className="text-xl text-white/80">We're here to help you with any questions you may have</p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center space-x-4 mb-12">
              <button
                onClick={() => setActiveTab('faqs')}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-300 ${
                  activeTab === 'faqs'
                    ? 'bg-secondary text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                FAQs
              </button>
              <button
                onClick={() => setActiveTab('support')}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-300 ${
                  activeTab === 'support'
                    ? 'bg-secondary text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Support Topics
              </button>
            </div>

            {/* FAQ Content */}
            {activeTab === 'faqs' && (
              <div className="grid gap-6 max-w-4xl mx-auto">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-sm p-6 rounded-xl hover:bg-white/10 transition-colors duration-300">
                    <h3 className="text-xl font-semibold text-secondary mb-2">{faq.question}</h3>
                    <p className="text-white/80">{faq.answer}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Support Topics */}
            {activeTab === 'support' && (
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {supportTopics.map((topic, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-sm p-6 rounded-xl hover:bg-white/10 transition-colors duration-300">
                    <h3 className="text-xl font-semibold text-secondary mb-2">{topic.title}</h3>
                    <p className="text-white/80">{topic.description}</p>
                  </div>
                ))}
              </div>
            )}
            
            {/* Contact Support */}
            <div className="mt-12 text-center">
              <p className="text-white/80 mb-4">Still need help? Our support team is ready to assist you</p>
              <button 
                onClick={() => setShowContactModal(true)}
                className="bg-secondary text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors duration-300"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <Footer />
        </div>
      </div>

      {/* Contact Support Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 max-w-lg w-full border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Contact Support</h2>
              <button 
                onClick={() => setShowContactModal(false)}
                className="text-white/60 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {submitStatus === 'success' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Message Sent Successfully!</h3>
                <p className="text-white/80">We'll get back to you as soon as possible.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={contactForm.name}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-secondary"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-secondary"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-white/80 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-secondary"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={contactForm.message}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
                    placeholder="Tell us how we can help..."
                  />
                </div>

                {submitStatus === 'error' && (
                  <div className="text-red-400 text-sm">
                    Something went wrong. Please try again later.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-secondary text-white py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors duration-300 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Help; 