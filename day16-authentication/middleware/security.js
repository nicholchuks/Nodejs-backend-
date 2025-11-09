import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";

export const securityMiddleware = (app) => {
  // 🧱 Set secure HTTP headers
  app.use(helmet());
  // 🧼 Sanitize data to prevent NoSQL injection
  app.use(mongoSanitize());

  // 🧹 Clean user input from XSS
  app.use(xss());
};
