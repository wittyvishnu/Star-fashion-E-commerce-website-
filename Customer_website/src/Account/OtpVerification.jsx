import React, { useState, useEffect, useRef } from 'react';
import { useVerifyOtpMutation, useResendOtpMutation } from '../redux/services/userSlice';

// Simple Spinner Component
const LoadingSpinner = () => (
    <div className="flex justify-center items-center">
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
);

const OtpVerification = ({ contactType, contactValue, purpose, onSuccess, externalLoading }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [message, setMessage] = useState({ type: '', text: '' });
  const inputRefs = useRef([]);

  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  // Combine local loading states with the external loading state (from parent)
  const isLoading = isVerifying || isResending || externalLoading;

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Handle typing (forces numeric input)
  const handleChange = (element, index) => {
    const value = element.value;
    if (isNaN(value)) return false;

    const newOtp = [...otp];
    // Take the last character entered to allow overwriting
    newOtp[index] = value.substring(value.length - 1); 
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
    }
  };

  // Handle Backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle Paste (allows copying code from SMS and pasting once)
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6); 
    
    if (/^\d+$/.test(pasteData)) {
        const newOtp = [...otp];
        pasteData.split("").forEach((char, i) => {
            if (i < 6) newOtp[i] = char;
        });
        setOtp(newOtp);
        
        const nextIndex = Math.min(pasteData.length, 5);
        if(inputRefs.current[nextIndex]) {
            inputRefs.current[nextIndex].focus();
        }
    }
  };

  const handleResend = async () => {
    setMessage({ type: '', text: '' });
    try {
      await resendOtp({ contact: contactValue, purpose }).unwrap();
      setMessage({ type: 'success', text: `A new OTP has been sent to your ${contactType}.` });
      setTimer(60);
    } catch (err) {
      const isRateLimited = err?.status === 429;
      setMessage({
        type: 'error',
        text: isRateLimited
          ? 'Too many requests. Please wait 5 minutes.'
          : err?.data?.message || 'Failed to resend OTP.',
      });
      if (isRateLimited) setTimer(300); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    const finalOtp = otp.join("");
    
    if (finalOtp.length !== 6) {
        setMessage({ type: 'error', text: 'Please enter the complete 6-digit OTP.' });
        return;
    }

    try {
      // 1. Verify the OTP
      await verifyOtp({ contact: contactValue, otp: finalOtp, purpose }).unwrap();
      
      // 2. Report success to parent. 
      // Note: If the parent triggers another API call (like sending email OTP), 
      // 'externalLoading' will become true, keeping the spinner active.
      onSuccess(finalOtp); 
    } catch (err) {
      const isRateLimited = err?.status === 429;
      setMessage({
        type: 'error',
        text: isRateLimited
          ? 'Too many attempts. Please wait 5 minutes.'
          : err?.data?.message || `Invalid ${contactType} OTP.`,
      });
      if (isRateLimited) setTimer(300);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-center text-gray-600">
        Please enter the 6-digit verification code sent to your {contactType}: <br />
        <span className="font-semibold text-gray-800">{contactValue}</span>
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-center gap-2 md:gap-4">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"          // Forces mobile number pad
              autoComplete="one-time-code" // iOS/Android SMS suggestion
              pattern="\d*"
              name="otp"
              maxLength="1"
              value={data}
              onChange={e => handleChange(e.target, index)}
              onKeyDown={e => handleKeyDown(e, index)}
              onPaste={index === 0 ? handlePaste : undefined}
              ref={el => (inputRefs.current[index] = el)}
              className="w-10 h-12 md:w-12 md:h-14 text-center text-lg md:text-2xl border bg-[#D9D9D9] rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          ))}
        </div>

        <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full h-[50px] btn-primary disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? <LoadingSpinner /> : 'Verify'}
        </button>
      </form>

      {message.text && (
        <p className={`text-center text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message.text}
        </p>
      )}

      <div className="text-sm text-center">
        {timer > 0 ? (
          <p className="text-gray-500">Resend OTP in {timer}s</p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={isLoading}
            className="text-[#2518BD] hover:underline font-semibold disabled:opacity-50"
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
};

export default OtpVerification;