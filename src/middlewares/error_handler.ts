import express from "express";
import { ErrorHandler } from "../errors";

export const errorHandler: express.ErrorRequestHandler = (
  error: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (error instanceof ErrorHandler) {
    return res.status(error.status).send(error.serialize());
  }
  return res.status(501).send({ message: "Internal server errors" });
};
