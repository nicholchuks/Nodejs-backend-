import cors from "cors";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

export const securityMiddleware = (app) => {
  // Secure HTTP headers
  app.use(helmet());

  app.use((req, res, next) => {
    mongoSanitize.sanitize(req.body);
    mongoSanitize.sanitize(req.params);
    mongoSanitize.sanitize(req.query);
    next();
  });

  // Clean user input from XSS (only body, not req.query)
  app.use((req, res, next) => {
    if (req.body && typeof req.body === "object") {
      try {
        xss()(req, res, next);
      } catch {
        next();
      }
    } else {
      next();
    }
  });

  // CORS setup
  const allowedOrigins = [
    "http://localhost:3000",
    "https://your-production-frontend.com",
  ];

  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin) return callback(null, true); // allow Postman
        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          console.warn(` Blocked CORS origin: ${origin}`);
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    })
  );

  // 🚦 Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
      success: false,
      message: "Too many requests from this IP, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use("/api", limiter);

  console.log("Security middleware safely initialized for Express 5");
};

// export const securityMiddleware = (app) => {
//   // 🧱 Secure HTTP headers
//   app.use(helmet());

//   // 🧼 Prevent NoSQL injection

//     app.use(mongoSanitize());

//   // 🧹 Prevent XSS
//     app.use(xss());

//   // ⚙️ Lightweight Express 5–safe parameter pollution guard
//   app.use((req, res, next) => {
//     for (const key in req.query) {
//       if (Array.isArray(req.query[key])) {
//         console.warn(`⚠️ Parameter pollution detected: ${key}`);
//         // Keep only the first value to neutralize the attack
//         req.query[key] = req.query[key][0];
//       }
//     }
//     next();
//   });

//   // 🌍 CORS setup
//   const allowedOrigins = [
//     "http://localhost:3000", // Dev frontend
//     "https://your-production-frontend.com", // Live frontend
//   ];

//   app.use(
//     cors({
//       origin: function (origin, callback) {
//         // Allow requests with no origin (like Postman or curl)
//         if (!origin) return callback(null, true);
//         if (allowedOrigins.includes(origin)) {
//           callback(null, true);
//         } else {
//           callback(new Error("Not allowed by CORS"));
//         }
//       },
//       credentials: true, // Allow cookies / auth headers
//     })
//   );

//   // 🚦 Rate limiting
//   const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // Limit each IP to 100 requests per window
//     message: {
//       success: false,
//       message: "Too many requests from this IP, please try again later.",
//     },
//     standardHeaders: true,
//     legacyHeaders: false,
//   });

//   // Apply limiter to all API routes
//   app.use("/api", limiter);

//   console.log("✅ Security middleware initialized safely");
// };

// export const securityMiddleware = (app) => {
//   // 🧱 Secure HTTP headers
//   app.use(helmet());

//   // 🧼 Prevent NoSQL injection
//   app.use(mongoSanitize());

//   // 🧹 Prevent XSS
//   app.use(xss());

//   // 🌍 CORS setup
//   const allowedOrigins = [
//     "http://localhost:3000",
//     "https://your-production-frontend.com",
//   ];

//   app.use(
//     cors({
//       origin: function (origin, callback) {
//         if (!origin) return callback(null, true);
//         if (allowedOrigins.includes(origin)) {
//           callback(null, true);
//         } else {
//           callback(new Error("Not allowed by CORS"));
//         }
//       },
//       credentials: true,
//     })
//   );

// 🚦 Rate limiting
//   const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 100,
//     message: {
//       success: false,
//       message: "Too many requests from this IP, please try again later.",
//     },
//     standardHeaders: true,
//     legacyHeaders: false,
//   });

//   app.use("/api", limiter);
// };

// export const securityMiddleware = (app) => {
//   // 🧱 Secure HTTP headers
//   app.use(helmet());

//   // 🧼 Prevent NoSQL injection
//   app.use(mongoSanitize());

//   // 🧹 Prevent XSS attacks
//   app.use(xss());

//   // ⚔️ Safe HPP middleware for Express 5
//   app.use((req, res, next) => {
//     try {
//       hpp()(req, res, next);
//     } catch (err) {
//       console.warn(`⚠️ HPP tried to modify req.query on ${req.originalUrl}`);
//       next();
//     }
//   });

//   // 🌍 CORS setup
//   const allowedOrigins = [
//     "http://localhost:3000",
//     "https://your-production-frontend.com",
//   ];

//   app.use(
//     cors({
//       origin: function (origin, callback) {
//         if (!origin) return callback(null, true);
//         if (allowedOrigins.includes(origin)) {
//           callback(null, true);
//         } else {
//           callback(new Error("Not allowed by CORS"));
//         }
//       },
//       credentials: true,
//     })
//   );

//   // ⚙️ Extra Helmet config
//   app.use(
//     helmet({
//       contentSecurityPolicy: {
//         useDefaults: true,
//         directives: {
//           "default-src": ["'self'"],
//           "img-src": ["'self'", "data:", "blob:", "https://res.cloudinary.com"],
//           "script-src": ["'self'", "https://cdn.jsdelivr.net"],
//           "style-src": [
//             "'self'",
//             "https://fonts.googleapis.com",
//             "'unsafe-inline'",
//           ],
//           "font-src": ["'self'", "https://fonts.gstatic.com"],
//         },
//       },
//       crossOriginEmbedderPolicy: false,
//     })
//   );

//   // 🚦 Global rate limiter (for all /api routes)
//   const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 100,
//     message: {
//       success: false,
//       message: "Too many requests from this IP, please try again later.",
//     },
//     standardHeaders: true,
//     legacyHeaders: false,
//   });

//   app.use("/api", limiter);
// };
