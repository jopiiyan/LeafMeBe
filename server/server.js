import cors from "cors";

import express from "express";

import posts from "./routes/posts.js";

const app = express();

const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use("/api/water", posts);

app.listen(port, () => {
  console.log(`Listening at port ${port} `);
});
