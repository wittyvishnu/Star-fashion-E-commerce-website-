import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  useLoginMutation,
  useSignupMutation,
  useSendOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyTokenMutation,
} from '../redux/services/userSlice';
import { logOut } from '../redux/feauters/authSlice';
import AuthImage from '../Utiles/AuthImage.jpg';
import OtpVerification from './OtpVerification';

// Loading Spinner for AuthPage buttons
const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const AuthPage = () => {
  const [authMode, setAuthMode] = useState('signIn'); 
  const [signupStep, setSignupStep] = useState(1);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '', phoneOtp: '', emailOtp: '', contact: '', newPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [verifyToken] = useVerifyTokenMutation();

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (token) {
        try {
          await verifyToken().unwrap();
          navigate('/');
        } catch (error) {
          dispatch(logOut());
          setIsCheckingToken(false);
        }
      } else {
        setIsCheckingToken(false);
      }
    };
    checkAuthStatus();
  }, [token, navigate, verifyToken, dispatch]);

  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [signup, { isLoading: isSigningUp }] = useSignupMutation();
  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const [forgotPassword, { isLoading: isSendingResetOtp }] = useForgotPasswordMutation();
  const [resetPassword, { isLoading: isResettingPassword }] = useResetPasswordMutation();
  
  const isLoading = isLoggingIn || isSigningUp || isSendingOtp || isSendingResetOtp || isResettingPassword;

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(number);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });
  
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      if (value.length <= 10) {
        setFormData({ ...formData, phone: value });
      }
    }
  };

  const clearMessages = () => setMessage({ type: '', text: '' });

  const handleModeChange = (mode) => {
    setAuthMode(mode);
    setSignupStep(1);
    setForgotPasswordStep(1);
    clearMessages();
    setFormData({ name: '', email: '', phone: '', password: '', confirmPassword: '', phoneOtp: '', emailOtp: '', contact: '', newPassword: ''});
  };

  // --- SIGN UP HANDLERS ---
  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    if (!validatePhoneNumber(formData.phone)) {
        setMessage({ type: 'error', text: 'Please enter a valid 10-digit number starting with 6-9.' });
        return;
    }

    try {
      await sendOtp({ contact: formData.phone, purpose: 'signup' }).unwrap();
      setMessage({ type: 'success', text: 'OTP sent to your phone number.' });
      setSignupStep(2);
    } catch (err) {
      const isRateLimited = err?.status === 429;
      setMessage({
        type: 'error',
        text: isRateLimited
          ? 'Too many OTP requests. Please wait 5 minutes before trying again.'
          : err.data?.message || 'Failed to send OTP.',
      });
    }
  };

  const handlePhoneVerificationSuccess = async (verifiedOtp) => {
    setFormData(prev => ({ ...prev, phoneOtp: verifiedOtp }));
    clearMessages();
    try {
      // This triggers 'isSendingOtp' which we pass to the child component
      await sendOtp({ contact: formData.email, purpose: 'signup' }).unwrap();
      setMessage({ type: 'success', text: 'Phone verified! Now sending OTP to your email.' });
      setSignupStep(3);
    } catch (err) {
      const isRateLimited = err?.status === 429;
      setMessage({
        type: 'error',
        text: isRateLimited
          ? 'Too many OTP requests. Please wait 5 minutes before trying again.'
          : err.data?.message || 'Failed to send email OTP.',
      });
    }
  };

  const handleEmailVerificationSuccess = async (verifiedOtp) => {
    clearMessages();
    const finalFormData = { ...formData, emailOtp: verifiedOtp };
    try {
      await signup({
        name: finalFormData.name,
        email: finalFormData.email,
        phone: finalFormData.phone,
        password: finalFormData.password,
        emailOtp: finalFormData.emailOtp,
        phoneOtp: finalFormData.phoneOtp,
      }).unwrap();
      navigate('/');
    } catch (err) {
      setMessage({ type: 'error', text: err.data?.message || 'Signup failed. Please try again.' });
      setSignupStep(1);
    }
  };

  // --- SIGN IN HANDLER ---
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    const isEmail = formData.contact.includes('@');
    if (!isEmail) {
        if (!validatePhoneNumber(formData.contact)) {
            setMessage({ type: 'error', text: 'Please enter a valid 10-digit number starting with 6-9, or a valid email.' });
            return;
        }
    }

    try {
        const { contact, password } = formData;
        await login({ contact, password }).unwrap();
        navigate('/account');
    } catch (err) {
        setMessage({ type: 'error', text: err.data?.message || 'Login failed.' });
    }
  };

  // --- FORGOT PASSWORD HANDLERS ---
  const handleForgotPasswordSendOtp = async (e) => {
    e.preventDefault();
    clearMessages();

    const isEmail = formData.contact.includes('@');
    if (!isEmail) {
        if (!validatePhoneNumber(formData.contact)) {
            setMessage({ type: 'error', text: 'Please enter a valid 10-digit number starting with 6-9, or a valid email.' });
            return;
        }
    }

    try {
      await forgotPassword({ contact: formData.contact }).unwrap();
      setMessage({ type: 'success', text: 'Reset OTP sent successfully.' });
      setForgotPasswordStep(2);
    } catch (err) {
      setMessage({ type: 'error', text: err.data?.message || 'Failed to send OTP.' });
    }
  };
  
  const handleForgotPasswordOtpSuccess = (verifiedOtp) => {
    setFormData(prev => ({ ...prev, otp: verifiedOtp }));
    setForgotPasswordStep(3);
    clearMessages();
  };
  
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    if (formData.newPassword !== formData.confirmPassword) {
        setMessage({ type: 'error', text: "Passwords do not match."});
        return;
    }
    try {
      const { contact, otp, newPassword } = formData;
      await resetPassword({ contact, otp, newPassword }).unwrap();
      setMessage({ type: 'success', text: 'Password reset successfully! Please sign in.' });
      handleModeChange('signIn');
      navigate('/account');
    } catch (err) {
      setMessage({ type: 'error', text: err.data?.message || 'Password reset failed.' });
    }
  };

  // --- RENDER LOGIC ---
  const getTitle = () => {
    if (authMode === 'signIn') return 'Sign In to Your Account';
    if (authMode === 'signUp') {
      if (signupStep === 1) return 'Create Your Account';
      if (signupStep === 2) return 'Verify Your Phone Number';
      if (signupStep === 3) return 'Verify Your Email Address';
    }
    if (authMode === 'forgotPassword') {
      if (forgotPasswordStep === 1) return 'Reset Your Password';
      if (forgotPasswordStep === 2) return 'Verify Your Identity';
      if (forgotPasswordStep === 3) return 'Create a New Password';
    }
    return 'Welcome';
  };

  const renderSignUpForm = () => {
    switch (signupStep) {
      case 1:
        return (
          <form onSubmit={handleDetailsSubmit} className="space-y-4">
            <input type="text" id="name" value={formData.name} onChange={handleChange} className="w-full h-[50px] pl-3 border bg-[#D9D9D9] rounded-md" required placeholder="Full Name" />
            <input type="email" id="email" value={formData.email} onChange={handleChange} className="w-full h-[50px] pl-3 border bg-[#D9D9D9] rounded-md" required placeholder="Email Address" />
            <input type="tel" id="phone" value={formData.phone} onChange={handlePhoneChange} className="w-full h-[50px] pl-3 border bg-[#D9D9D9] rounded-md" required placeholder="Phone Number (10 digits)" maxLength={10} />
            <input type="password" id="password" value={formData.password} onChange={handleChange} className="w-full h-[50px] pl-3 border bg-[#D9D9D9] rounded-md" required placeholder="Password" />
            <input type="password" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full h-[50px] pl-3 border bg-[#D9D9D9] rounded-md" required placeholder="Confirm Password" />
            
            <button type="submit" disabled={isLoading} className="w-full h-[50px] btn-primary disabled:opacity-70 disabled:cursor-not-allowed">
              {isLoading ? <LoadingSpinner /> : 'Sign Up'}
            </button>
          </form>
        );
      case 2:
        return (
            <OtpVerification 
                key="phone-otp" 
                contactType="phone" 
                contactValue={formData.phone} 
                purpose="signup" 
                onSuccess={handlePhoneVerificationSuccess} 
                // Wait for EMAIL OTP to send before stopping the spinner
                externalLoading={isSendingOtp} 
            />
        );
      case 3:
        return (
            <OtpVerification 
                key="email-otp" 
                contactType="email" 
                contactValue={formData.email} 
                purpose="signup" 
                onSuccess={handleEmailVerificationSuccess} 
                // Wait for SIGNUP to complete before stopping spinner
                externalLoading={isSigningUp}
            />
        );
      default: return null;
    }
  };

  const renderSignInForm = () => (
    <form onSubmit={handleLoginSubmit} className="space-y-4">
      <input type="text" id="contact" value={formData.contact} onChange={handleChange} className="w-full h-[50px] pl-3 border bg-[#D9D9D9] rounded-md" required placeholder="Email or Phone" />
      <input type="password" id="password" value={formData.password} onChange={handleChange} className="w-full h-[50px] pl-3 border bg-[#D9D9D9] rounded-md" required placeholder="Password" />
      
      <button type="submit" disabled={isLoading} className="w-full h-[50px] btn-primary disabled:opacity-70 disabled:cursor-not-allowed">
        {isLoading ? <LoadingSpinner /> : 'Sign In'}
      </button>
    </form>
  );

  const renderForgotPasswordForm = () => {
    switch (forgotPasswordStep) {
      case 1:
        return (
          <form onSubmit={handleForgotPasswordSendOtp} className="space-y-4">
            <p className="text-sm text-gray-600">Enter your email or phone to receive a reset OTP.</p>
            <input type="text" id="contact" value={formData.contact} onChange={handleChange} className="w-full h-[50px] pl-3 border bg-[#D9D9D9] rounded-md" required placeholder="Email or Phone" />
            <button type="submit" disabled={isLoading} className="w-full h-[50px] btn-primary disabled:opacity-70 disabled:cursor-not-allowed">
              {isLoading ? <LoadingSpinner /> : 'Send Reset OTP'}
            </button>
          </form>
        );
      case 2:
        return <OtpVerification key="reset-otp" contactType="credentials" contactValue={formData.contact} purpose="forgotPassword" onSuccess={handleForgotPasswordOtpSuccess} />;
      case 3:
        return (
          <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
             <p className="text-sm text-gray-600">Your identity has been verified. Please create a new password.</p>
            <input type="password" id="newPassword" value={formData.newPassword} onChange={handleChange} className="w-full h-[50px] pl-3 border bg-[#D9D9D9] rounded-md" required placeholder="New Password" />
            <input type="password" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full h-[50px] pl-3 border bg-[#D9D9D9] rounded-md" required placeholder="Confirm New Password" />
            <button type="submit" disabled={isLoading} className="w-full h-[50px] btn-primary disabled:opacity-70 disabled:cursor-not-allowed">
              {isLoading ? <LoadingSpinner /> : 'Reset Password'}
            </button>
          </form>
        );
      default: return null;
    }
  };

  if (isCheckingToken) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-[#2518BD] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xl font-semibold">Verifying session...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`.btn-primary { background-color: #B5B1FF; color: #3B3A3A; } .btn-primary:hover:not(:disabled) { background-color: #2518BD; color: white; }`}</style>
      
      <div className="min-h-screen w-full flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          <div className="hidden md:flex w-1/2 justify-center">
            <img src={AuthImage} alt="Auth" className="w-full max-w-md object-contain" />
          </div>

          <div className="w-full md:w-1/2 max-w-md">
            <h1 className="w-full text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">{getTitle()}</h1>
            
            {message.text && (
              <div className={`p-3 rounded-md mb-4 text-center text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {message.text}
              </div>
            )}
            
            {authMode === 'signUp' && renderSignUpForm()}
            {authMode === 'signIn' && renderSignInForm()}
            {authMode === 'forgotPassword' && renderForgotPasswordForm()}
            
            <div className="mt-6 text-center md:text-left text-sm space-y-2">
              {authMode === 'signIn' && (
                <>
                  <p>Don't have an account? <button className="text-[#2518BD] font-semibold hover:underline" onClick={() => handleModeChange('signUp')}>Sign Up</button></p>
                  <p><button className="text-[#2518BD] font-semibold hover:underline" onClick={() => handleModeChange('forgotPassword')}>Forgot Password?</button></p>
                </>
              )}
              {authMode === 'signUp' && (<p>Already have an account? <button className="text-[#2518BD] font-semibold hover:underline" onClick={() => handleModeChange('signIn')}>Sign In</button></p>)}
              {authMode === 'forgotPassword' && (<p>Remember your password? <button className="text-[#2518BD] font-semibold hover:underline" onClick={() => handleModeChange('signIn')}>Sign In</button></p>)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;