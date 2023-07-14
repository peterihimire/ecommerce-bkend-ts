import express from "express";
import authRoute from "./src/routes/auth-route";

const app = express();

app.set("trust proxy", 1);
app.use("/api/ecommerce/v1/auth", authRoute);

export default app;
