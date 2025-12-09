import rateLimit from "express-rate-limit";

const rateLimitMiddleware = (windowMs, maxRequests) => {
  return rateLimit({
    windowMs,
    max: maxRequests,
    message: { message: "Too many requests, please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

export default rateLimitMiddleware;
