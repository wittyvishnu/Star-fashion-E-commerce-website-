import React, { useState, useEffect, useRef } from 'react';
import { useVerifyOtpMutation, useResendOtpMutation } from '../redux/services/userSlice';

const OtpVerification = ({ contactType, contactValue, purpose, onSuccess }) => {
  // NEW: State is now an array to hold each digit
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [message, setMessage] = useState({ type: '', text: '' });
  const inputRefs = useRef([]);

  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  const isLoading = isVerifying || isResending;

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // NEW: Handler for typing in the OTP boxes
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  // NEW: Handler for pressing backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && e.target.previousSibling) {
      e.target.previousSibling.focus();
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
          ? 'Too many OTP requests. Please wait 5 minutes before trying again.'
          : err?.data?.message || 'Failed to resend OTP.',
      });
      if (isRateLimited) {
        setTimer(300); // lockout 5 minutes to mirror backend window
      }
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
      await verifyOtp({ contact: contactValue, otp: finalOtp, purpose }).unwrap();
      onSuccess(finalOtp); // Pass the verified OTP back to the parent
    } catch (err) {
      const isRateLimited = err?.status === 429;
      setMessage({
        type: 'error',
        text: isRateLimited
          ? 'Too many attempts. Please wait 5 minutes before retrying.'
          : err?.data?.message || `Invalid ${contactType} OTP.`,
      });
      if (isRateLimited) {
        setTimer(300);
      }
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-center text-gray-600">
        Please enter the 6-digit verification code sent to your {contactType}: <br />
        <span className="font-semibold text-gray-800">{contactValue}</span>
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* NEW: OTP input boxes */}
        <div className="flex justify-center gap-2 md:gap-4">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              name="otp"
              maxLength="1"
              value={data}
              onChange={e => handleChange(e.target, index)}
              onKeyDown={e => handleKeyDown(e, index)}
              ref={el => (inputRefs.current[index] = el)}
              className="w-10 h-12 md:w-12 md:h-14 text-center text-lg md:text-2xl border bg-[#D9D9D9] rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          ))}
        </div>

        <button type="submit" disabled={isLoading} className="w-full h-[50px] btn-primary disabled:opacity-50">
          {isVerifying ? 'Verifying...' : 'Verify'}
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