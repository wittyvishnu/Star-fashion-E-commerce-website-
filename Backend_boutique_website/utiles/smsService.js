import axios from "axios";
import twilio from "twilio";
export const sendPhoneOtp = async (phone, otp) => {

  // 1️⃣ Validate Indian phone (10 digits, starts with 6–9)
  const indianPhoneRegex = /^[6-9]\d{9}$/;
  if (!indianPhoneRegex.test(phone)) {
    return { success: false, message: "Invalid Indian phone number. Must be 10 digits starting with 6-9." };
  }

  // 2️⃣ Auto-add +91
  const phoneWithCode = `+91${phone}`;


  // -------------------------
  // PROVIDERS IMPLEMENTATION
  // -------------------------

  // 👉 1) Send OTP using 2FACTOR
  const sendVia2Factor = async () => {
    try {
      const url = `https://2factor.in/API/V1/${process.env.TWO_FACTOR_API_KEY}/SMS/${phone}/${otp}`;
      await axios.get(url);
      return { success: true, provider: "2Factor" };
    } catch (err) {
      return { success: false, provider: "2Factor", error: err.message };
    }
  };

  // 👉 2) Send OTP using FAST2SMS
  const sendViaFast2SMS = async () => {
    try {
      await axios.post(
        "https://www.fast2sms.com/dev/bulkV2",
        {
          message: `Your OTP is ${otp}`,
          language: "english",
          route: "q",
          numbers: phone,
        },
        {
          headers: {
            authorization: process.env.FAST2SMS_API_KEY,
          },
        }
      );
      return { success: true, provider: "Fast2SMS" };
    } catch (err) {
      return { success: false, provider: "Fast2SMS", error: err.message };
    }
  };

  // 👉 3) Send OTP using TWILIO
  const sendViaTwilio = async () => {
    try {
      const client = twilio(
        process.env.TWILIO_SID,
        process.env.TWILIO_AUTH_TOKEN
      );

      await client.messages.create({
        body: `Your OTP is ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneWithCode,
      });

      return { success: true, provider: "Twilio" };
    } catch (err) {
      return { success: false, provider: "Twilio", error: err.message };
    }
  };


  // -------------------------
  // FALLBACK LOGIC
  // -------------------------
let result;

result = await sendViaTwilio();
if (result.success) {
  console.log("OTP sent using:", result.provider);
  return { success: true, provider: result.provider, otp };
}
// Try 2Factor
result = await sendVia2Factor();
if (result.success) {
  console.log("OTP sent using:", result.provider);
  return { success: true, provider: result.provider, otp };
}

// Try Twilio


// 2Try Fast2SMS
result = await sendViaFast2SMS();
if (result.success) {
  console.log("OTP sent using:", result.provider);
  return { success: true, provider: result.provider, otp };
}





  // 4️⃣ All failed
  return {
    success: false,
    provider: "None",
    message: "All SMS providers failed",
    lastError: result
  };
};