import express from "express";

const app = express();

app.set("trust proxy", 1);

export default app;
