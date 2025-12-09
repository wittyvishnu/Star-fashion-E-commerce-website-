import express from 'express';
import { createOtp, verifyOtp, resendOtp } from '../controllers/otpController.js';
import rateLimitMiddleware from '../middlewares/rateLimitMiddleware.js';

const RouteTemplate = () => {
  const router = express.Router();

  // Limit OTP send/resend to 2 requests per 5 minutes per IP
  const otpLimiter = rateLimitMiddleware(5 * 60 * 1000, 2);

  router.post('/', otpLimiter, createOtp);
  router.post('/verify', verifyOtp);
  router.post('/resend', otpLimiter, resendOtp);

  return router;
};

export default RouteTemplate();