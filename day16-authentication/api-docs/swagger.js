import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Tracker API",
      version: "1.0.0",
      description: "API documentation for your Node.js backend",
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Task: {
          type: "object",
          properties: {
            _id: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            completed: { type: "boolean" },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
          },
        },
        TaskRequest: {
          type: "object",
          required: ["title"],
          properties: {
            title: { type: "string" },
            description: { type: "string" },
          },
        },

        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            role: { type: "string", enum: ["user", "admin"] },
            profileImage: { type: "string" },
            isVerified: { type: "boolean" },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string" },
            email: { type: "string" },
            password: { type: "string", minLength: 6 },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string" },
            password: { type: "string" },
          },
        },
        UploadResponse: {
          type: "object",
          properties: {
            url: { type: "string" },
          },
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"],
  // apis: ["./routes/**/*.js", "./routes/*.js", "./**/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

export { swaggerUi, swaggerSpec };

// // api-docs/swagger.js
// import swaggerJsDoc from "swagger-jsdoc";
// import swaggerUi from "swagger-ui-express";

// const options = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "Your API Documentation",
//       version: "1.0.0",
//       description: "API documentation for your Node.js backend",
//     },
//     servers: [
//       {
//         url: "http://localhost:3000",
//         description: "Local server",
//       },
//     ],
//   },
//   //   apis: ["./routes/*.js"], // where swagger should scan
//   apis: ["./routes/**/*.js"],
// };

// const swaggerSpec = swaggerJsDoc(options);

// export { swaggerUi, swaggerSpec };

// const options = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "Your API Documentation",
//       version: "1.0.0",
//       description: "API documentation for your Node.js backend",
//     },
//     servers: [{ url: "http://localhost:3000", description: "Local server" }],
//     components: {
//       securitySchemes: {
//         bearerAuth: {
//           type: "http",
//           scheme: "bearer",
//           bearerFormat: "JWT",
//         },
//       },
//       schemas: {
//         // We'll define User, Task, etc. later
//       },
//     },
//   },
//   apis: ["./routes/**/*.js", "./routes/*.js", "./**/*.js"],
// };

// const swaggerSpec = swaggerJsDoc(options);
// export { swaggerUi, swaggerSpec };
