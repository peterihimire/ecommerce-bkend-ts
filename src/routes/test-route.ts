import { RequestHandler, Router } from "express";
import { httpStatusCodes } from "../utils/http-status-codes";

const router = Router();

const testFunction: RequestHandler = (req, res, next) => {
  try {
    res.status(httpStatusCodes.OK).json({
      status: "success",
      msg: "Ecommerce Test API was initiated successfully!",
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = httpStatusCodes.INTERNAL_SERVER;
    }
    next(error);
  }
};

router.get("/test-api", testFunction);

export default router;
