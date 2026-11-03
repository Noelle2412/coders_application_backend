import express from "express";
import dotenv from "dotenv";
dotenv.config();
import codersRouters from "./routers/codersRouters.js";
import managersRouters from "./routers/managersRouters.js";
import challengesRouters from "./routers/challengesRouters.js";
import leaderboardRouters from "./routers/leaderboardRouters.js";
import statsRouters from "./routers/statsRouters.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("This is the Coders App backend!");
});

app.use("/coders", codersRouters);
app.use("/managers", managersRouters);
app.use("/challenges", challengesRouters);
app.use("/leaderboard", leaderboardRouters);
app.use("/stats", statsRouters);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

export default app;
