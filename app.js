import express from "express";
import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./db/db.js";
import { seedDatabase } from "./db/seed.js";
import codersRouters from "./routers/codersRouters.js";
import managersRouters from "./routers/managersRouters.js";
import challengesRouters from "./routers/challengesRouters.js";
import leaderboardRouters from "./routers/leaderboardRouters.js";
import statsRouters from "./routers/statsRouters.js";
import { verifyUserAccount } from "./controllers/verificationController.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("This is the Coders App backend!");
});

app.get("/verify", verifyUserAccount);

app.use("/coders", codersRouters);
app.use("/managers", managersRouters);
app.use("/challenges", challengesRouters);
app.use("/leaderboard", leaderboardRouters);
app.use("/stats", statsRouters);

// Global Error Handler for Mongoose CastError and other unhandled errors
app.use((err, req, res, next) => {
  if (err.name === "CastError") {
    return res.status(400).json({
      status: "fail",
      message: `Invalid ID format for value '${err.value}'.`,
    });
  }

  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    status: "error",
    message: err.message || "An unexpected error occurred.",
  });
});

const PORT = process.env.PORT;

connectDB()
  .then(async () => {
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB, server not started:", err);
  });

export default app;
