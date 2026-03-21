import React, { useState, useEffect } from 'react';
import { Database, Mail, MessageSquare, Send, User, Phone, MapPin, Github, Linkedin, Twitter, Terminal, Code, Zap, Shield, Globe, Clock, CheckCircle, AlertCircle, Menu, X } from 'lucide-react';
import { Navigate,useNavigate } from 'react-router-dom';
import useNavigation from '../../Hooks/navigations';

const CrumbsContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    contactType: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {opencontact}=useNavigation()
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        contactType: 'general'
      });
      
      // Clear success message after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 2000);
  };

  const contactTypes = [
    { value: 'general', label: 'GENERAL_INQUIRY', icon: <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" /> },
    { value: 'technical', label: 'TECHNICAL_SUPPORT', icon: <Code className="w-3 h-3 sm:w-4 sm:h-4" /> },
    { value: 'partnership', label: 'PARTNERSHIP', icon: <Globe className="w-3 h-3 sm:w-4 sm:h-4" /> },
    { value: 'security', label: 'SECURITY_ISSUE', icon: <Shield className="w-3 h-3 sm:w-4 sm:h-4" /> }
  ];

  const contactMethods = [
    {
      icon: <Mail className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: 'EMAIL_CONTACT',
      value: 'adityakurani26@gmail.com',
      description: 'Primary communication channel'
    },
    {
      icon: <Github className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: 'GITHUB_REPOSITORY',
      value: 'github.com/adityakurani/crumbs',
      description: 'Open source development'
    },
    {
      icon: <Terminal className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: 'SYSTEM_STATUS',
      value: 'status.crumbsnetwork.io',
      description: 'Real-time network monitoring'
    },
    {
      icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: 'RESPONSE_TIME',
      value: '< 24_HOURS',
      description: 'Average response duration'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
    

      {/* Terminal Background */}
      <div className="terminal-bg">
        {/* Matrix Rain Background */}
        <div className="matrix-rain">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="matrix-column">
              {Array.from({ length: 20 }, () => 
                Math.random() > 0.5 ? '1' : '0'
              ).join('\n')}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <nav className="fixed z-20 w-full p-3 sm:p-4 md:p-6 glass-card border-b border-white border-opacity-10">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-black bg-opacity-10 rounded border neon-border flex items-center justify-center neon-glow">
                <Database className="w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div className='cursor-pointer'>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold mono-text " onClick={()=>opencontact('/')}>CRUMBS</h1>
                {/* <p className="text-xs md:text-sm text-gray-300 mono-text hidden sm:block">by aditya.kurani</p> */}
              </div>
            </div>
            
            <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-8">
              <a href="#" className="mono-text hover:text-gray-300 transition-colors text-xs sm:text-sm md:text-base" onClick={()=>opencontact('/')}>[home]</a>
              <p href="#" className="mono-text hover:text-gray-300 transition-colors text-xs sm:text-sm md:text-base hidden sm:block" onClick={()=>opencontact('/#features')}>[features]</p>
              <a href="" className="mono-text text-white font-bold text-xs sm:text-sm md:text-base">[contact]</a>
            </div>
          </div>
        </nav>

        {/* Header Section */}
        <section className="relative z-10 pt-24 sm:pt-32 md:pt-40 pb-12 sm:pb-16">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 text-center">
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 glitch-text mono-text" data-text="CONTACT_PROTOCOL">
              CONTACT_PROTOCOL<span className="terminal-cursor">█</span>
            </h1>
            <p className="text-sm sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mono-text mb-6 sm:mb-8">
              INITIATE_COMMUNICATION_WITH_THE_CRUMBS_NETWORK
            </p>
            
            <div className="glass-card rounded p-4 sm:p-6 neon-border max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm md:text-base mono-text">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span>SYSTEM_ONLINE</span>
                </div>
                <div className="text-gray-400 hidden sm:block">|</div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>RESPONSE_TIME: &lt;24H</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Methods Grid */}
        <section className="py-12 sm:py-16 relative z-10">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-center mono-text">COMMUNICATION_CHANNELS</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {contactMethods.map((method, index) => (
                <div key={index} className="glass-card rounded p-4 sm:p-6 neon-border ho`ver-lift scanline text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 bg-black bg-opacity-10 rounded border neon-border flex items-center justify-center neon-glow">
                    {method.icon}
                  </div>
                  <h3 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-2 mono-text">{method.title}</h3>
                  <div className="text-white font-bold mono-text mb-1 sm:mb-2 text-xs sm:text-sm break-all">{method.value}</div>
                  <p className="text-gray-400 text-xs">{method.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Contact Form */}
        <section id="contact" className="py-12 sm:py-16 relative z-10">
          <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
              
              {/* Contact Form */}
              <div className="glass-card rounded p-4 sm:p-6 md:p-8 neon-border circuit-pattern">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 mono-text glitch-text" data-text="MESSAGE_INTERFACE">
                  MESSAGE_INTERFACE
                </h2>
                
                {submitStatus === 'success' && (
                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 glass-card rounded neon-border success-animation">
                    <div className="flex items-center space-x-2 sm:space-x-3 text-green-400">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="mono-text text-xs sm:text-sm">MESSAGE_TRANSMITTED_SUCCESSFULLY</span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  
                  {/* Contact Type Selection */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-2 sm:mb-3 mono-text">TRANSMISSION_TYPE:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {contactTypes.map((type) => (
                        <label key={type.value} className="cursor-pointer">
                          <input
                            type="radio"
                            name="contactType"
                            value={type.value}
                            checked={formData.contactType === type.value}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <div className={`p-2 sm:p-3 rounded border transition-all mono-text text-xs flex items-center space-x-1 sm:space-x-2 ${
                            formData.contactType === type.value
                              ? 'border-white bg-black bg-opacity-10'
                              : 'border-gray-600 hover:border-gray-400'
                          }`}>
                            {type.icon}
                            <span className="text-xs sm:text-xs">{type.label}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Name Field */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2 mono-text">USER_IDENTIFIER:</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="enter_your_name"
                        className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 terminal-input rounded text-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2 mono-text">CONTACT_ADDRESS:</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your_email@domain.com"
                        className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 terminal-input rounded text-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Subject Field */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2 mono-text">MESSAGE_SUBJECT:</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="brief_description_of_inquiry"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 terminal-input rounded text-sm"
                      required
                    />
                  </div>

                  {/* Message Field */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2 mono-text">MESSAGE_PAYLOAD:</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="detailed_message_content..."
                      rows="4"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 terminal-input rounded resize-none text-sm"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 sm:py-4 font-bold mono-text transition-all flex items-center justify-center space-x-2 sm:space-x-3 text-sm sm:text-base ${
                      isSubmitting
                        ? 'bg-gray-600 cursor-not-allowed form-loading'
                        : 'bg-white text-black hover:bg-gray-200 neon-glow'
                    } scanline`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        <span>TRANSMITTING_MESSAGE...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>SEND_TRANSMISSION</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-6 sm:space-y-8">
                
                {/* Creator Info */}
                <div className="glass-card rounded p-4 sm:p-6 md:p-8 neon-border">
                  <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 mono-text">SYSTEM_ADMINISTRATOR</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      <div>
                        <div className="font-semibold mono-text text-sm sm:text-base">ADITYA_KURANI</div>
                        <div className="text-xs sm:text-sm text-gray-400">Project Creator & Lead Developer</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Status */}
                <div className="glass-card rounded p-4 sm:p-6 md:p-8 neon-border scanline">
                  <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 mono-text">PROJECT_STATUS</h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="mono-text text-xs sm:text-sm">DEVELOPMENT_PHASE:</span>
                      <span className="text-green-400 font-bold mono-text text-xs sm:text-sm">ACTIVE</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="mono-text text-xs sm:text-sm">NETWORK_STATUS:</span>
                      <span className="text-green-400 font-bold mono-text text-xs sm:text-sm">ONLINE</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="mono-text text-xs sm:text-sm">CONTRIBUTORS:</span>
                      <span className="text-white font-bold mono-text text-xs sm:text-sm">RECRUITING</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="mono-text text-xs sm:text-sm">VERSION:</span>
                      <span className="text-white font-bold mono-text text-xs sm:text-sm">v0.1.0-ALPHA</span>
                    </div>
                  </div>
                </div>

                {/* FAQ */}
                <div className="glass-card rounded p-4 sm:p-6 md:p-8 neon-border circuit-pattern">
                  <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 mono-text">QUICK_REFERENCE</h3>
                  <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                    <div>
                      <div className="font-semibold mono-text text-white mb-1">Q: HOW_TO_JOIN_NETWORK?</div>
                      <div className="text-gray-400">A: Download the mobile app and contribute storage space to earn tokens.</div>
                    </div>
                    <div>
                      <div className="font-semibold mono-text text-white mb-1">Q: SECURITY_CONCERNS?</div>
                      <div className="text-gray-400">A: All data is encrypted end-to-end with military-grade security protocols.</div>
                    </div>
                    <div>
                      <div className="font-semibold mono-text text-white mb-1">Q: PARTNERSHIP_OPPORTUNITIES?</div>
                      <div className="text-gray-400">A: Contact us through the partnership inquiry type above.</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 sm:py-12 border-t border-white border-opacity-10 relative z-10">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-3 sm:space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-black bg-opacity-10 rounded border neon-border flex items-center justify-center neon-glow">
                  <Database className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm sm:text-lg font-bold mono-text">PROJECT_CRUMBS</div>
                  <div className="text-xs sm:text-sm text-gray-300 mono-text">DECENTRALIZED_CLOUD_STORAGE</div>
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-gray-400 mb-1 sm:mb-2 mono-text text-xs sm:text-sm">
                  CREATED_BY <span className="text-white font-semibold">ADITYA_KURANI</span>
                </p>
                <p className="text-xs text-gray-500 mono-text">© 2025 PROJECT_CRUMBS. ALL_RIGHTS_RESERVED.</p>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default CrumbsContactPage;