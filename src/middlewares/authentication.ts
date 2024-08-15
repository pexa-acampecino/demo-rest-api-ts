import express from "express";
import { get, merge } from "lodash";
import { AUTHENTICATION_COOKIE_NAME } from "../constants/cookies";
import { getUserBySessionToken } from "../db/users";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies[AUTHENTICATION_COOKIE_NAME];

    if (!sessionToken) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    const user = await getUserBySessionToken(sessionToken);
    if (!user) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    merge(req, { identity: user });

    return next();
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

export const isOwner = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { id } = req.params;
  const currentUserId = get(req, "identity._id") as string;

  if (!currentUserId) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  if (id !== currentUserId.toString()) {
    return res.status(403).send({ message: "Forbidden" });
  }

  next();
};
