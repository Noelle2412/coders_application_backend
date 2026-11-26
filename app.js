import express from "express";
import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./db/db.js";
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

const PORT = process.env.PORT;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB, server not started:", err);
  });

export default app;
