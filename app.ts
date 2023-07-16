import express, { Application } from "express";
import authRoute from "./src/routes/auth-route";
import testRoute from "./src/routes/test-route";
import {
  logErrorMiddleware,
  returnError,
  unknownRoute,
} from "./src/middlewares/error-handler";

const app: Application = express();

app.set("trust proxy", 1);
app.use("/api/ecommerce/v1/auth", authRoute);
app.use("/api/ecommerce/v1/test", testRoute);

app.use(unknownRoute);
app.use(logErrorMiddleware);
app.use(returnError);
export default app;
