import React, { useState } from 'react';
import { useSubmitFeedbackMutation } from '../redux/services/feedbackSlice';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [validationError, setValidationError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Using the hook from the feedbackSlice (which injected it into apiSlice)
  const [submitFeedback, { isLoading, isError, error }] = useSubmitFeedbackMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error when user types in email field
    if (name === 'email') setValidationError('');
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setSuccessMsg('');

    // 1. Frontend Validation
    if (!formData.name || !formData.email || !formData.message) {
      setValidationError('All fields are required.');
      return;
    }

    if (!validateEmail(formData.email)) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    // 2. API Call
    try {
      await submitFeedback(formData).unwrap();
      setSuccessMsg('Thank you! Your message has been sent successfully.');
      setFormData({ name: '', email: '', message: '' }); // Clear form
    } catch (err) {
      console.error("Feedback failed", err);
      // The error UI will show automatically via 'isError' check below
    }
  };

  return (
    <div className="bg-[linear-gradient(114.91deg,_#BEE2EF_7.73%,_#73C1DE_103.62%)] text-white min-h-screen">
     

      <div className="container mx-auto px-6 md:px-10 flex flex-col items-center space-y-10 pt-10 pb-20">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-black leading-relaxed">
            Contact <span className="text-blue-600">Us</span>
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl">
            We would love to hear from you! Reach out for any queries or feedback.
          </p>
        </div>

        {/* Contact Form Section */}
        <div className="w-full max-w-lg bg-white/40 backdrop-blur-lg rounded-lg shadow-lg p-8">
          
          {/* Success Message */}
          {successMsg && (
            <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg flex items-center gap-2 animate-fade-in">
              <FaCheckCircle /> {successMsg}
            </div>
          )}

          {/* Error Message */}
          {(validationError || isError) && (
            <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg flex items-center gap-2 animate-fade-in">
              <FaExclamationCircle /> 
              <span>
                {validationError || error?.data?.message || 'Something went wrong. Please try again.'}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col space-y-2">
              <label className="text-gray-800 font-semibold">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="px-4 py-2 rounded-lg bg-transparent text-gray-800 focus:outline-none border border-gray-400 focus:border-blue-600 focus:bg-white/50 transition-colors"
                placeholder="Your Name"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-gray-800 font-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="px-4 py-2 rounded-lg bg-transparent text-gray-800 focus:outline-none border border-gray-400 focus:border-blue-600 focus:bg-white/50 transition-colors"
                placeholder="Your Email"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-gray-800 font-semibold">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="px-4 py-2 rounded-lg bg-transparent text-gray-800 focus:outline-none border border-gray-400 focus:border-blue-600 focus:bg-white/50 transition-colors"
                placeholder="Your Message"
                rows="4"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-transform active:scale-95"
            >
              <span>{isLoading ? 'Sending...' : 'Send Message'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;