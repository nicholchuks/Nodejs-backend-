// server.js
import express from "express";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();
app.use(express.json());

app.use("/api/tasks", taskRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
