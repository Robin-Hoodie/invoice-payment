import { ErrorRequestHandler } from "express";
import { Result } from "express-validator";

export const validationErrorMiddleware: ErrorRequestHandler = (
  error,
  _,
  response,
  next
) => {
  if (response.headersSent) {
    return next(error);
  }
  if (!(error instanceof Result)) {
    return next(error);
  }
  response.status(400).json({
    errors: error.array(),
  });

  next();
};
