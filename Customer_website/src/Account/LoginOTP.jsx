import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/feauters/authSlice"; // Correct import
import { useSendOtpMutation, useSignupMutation } from '../redux/services/userSlice'; // Correct import

function LoginOTP() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState(""); // New state for user's name
  const [password, setPassword] = useState(""); // New state for user's password
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [timer, setTimer] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const [signup, { isLoading: isSigningUp }] = useSignupMutation();

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = async () => {
    if (timer > 0 || !phoneNumber) return;
    setMessage({ type: '', text: '' });

    try {
      await sendOtp({ contact: `+91${phoneNumber}`, purpose: 'signup' }).unwrap();
      setOtpSent(true);
      setMessage({ type: 'success', text: 'OTP sent successfully!' });
      setTimer(30);
    } catch (err) {
      setMessage({ type: 'error', text: err.data?.message || "Error sending OTP, please try again." });
    }
  };

  const handleSignup = async () => {
    if (!name || !password || !otp) {
      setMessage({ type: 'error', text: "Please fill in all fields." });
      return;
    }
    setMessage({ type: '', text: '' });

    try {
      const response = await signup({
        name,
        phone: `+91${phoneNumber}`,
        password,
        otp,
      }).unwrap();
      
      dispatch(setCredentials(response));
      navigate("/profilepage");
    } catch (err) {
      setMessage({ type: 'error', text: err.data?.message || "Incorrect OTP or invalid data." });
    }
  };

  const isLoading = isSendingOtp || isSigningUp;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row mt-12">
      <div className="hidden lg:flex lg:w-[700px] bg-[#8B5CF6] items-center justify-center rounded-r-3xl">
        <div className="text-white mt-3 font-sans text-center">
          <p className="text-3xl font-bold">Style Starts Here</p>
          <p className="mt-3 text-xl">Welcome to Boutique Bliss!</p>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center items-center p-4">
        <h2 className="text-3xl font-semibold mb-2">{otpSent ? 'Create Your Account' : 'Join With Your Phone'}</h2>
        <p className="text-gray-500 mb-6">Experience luxury fashion at your fingertips</p>
        
        {message.text && (
          <p className={message.type === 'error' ? 'text-red-500' : 'text-green-500'}>
            {message.text}
          </p>
        )}

        <div className="w-full max-w-md">
          {!otpSent ? (
            // Step 1: Enter Phone Number
            <div className="mb-4">
              <label className="block mb-2">Phone Number</label>
              <div className="flex">
                <span className="flex items-center px-4 bg-gray-200 border rounded-l-md text-gray-700">+91</span>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your 10 digits"
                  className="flex-1 border p-2 rounded-l-md focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className={`bg-[#8B5CF6] text-white p-2 rounded-r-md min-w-[120px] ${timer > 0 || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#6D28D9]'}`}
                  disabled={timer > 0 || isLoading}
                >
                  {isLoading ? 'Sending...' : (timer > 0 ? `Resend in ${timer}s` : "Send OTP")}
                </button>
              </div>
            </div>
          ) : (
            // Step 2: Verify OTP and Create Account
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Enter OTP</label>
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6-Digit OTP" maxLength="6" className="border p-2 w-full rounded-md" />
              </div>
              <div>
                <label className="block mb-2">Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" className="border p-2 w-full rounded-md" />
              </div>
              <div>
                <label className="block mb-2">Create Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a new password" className="border p-2 w-full rounded-md" />
              </div>
              <button
                type="button"
                onClick={handleSignup}
                disabled={isLoading}
                className="bg-[#8B5CF6] text-white w-full py-3 rounded-md hover:bg-[#6D28D9] disabled:opacity-50"
              >
                {isLoading ? 'Creating Account...' : 'Verify & Sign Up'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginOTP;