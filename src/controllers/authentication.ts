import express from "express";
import { createUser, getUserByEmail } from "../db/users";
import { random, authentication } from "../helpers";
import { AUTHENTICATION_COOKIE_NAME } from "../constants/cookies";
import {
  ApplicationError,
  AuthenticationError,
  BadRequestError,
  NotFoundError,
} from "../errors";

export const register = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return next(new BadRequestError("Invalid request"));
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return next(new BadRequestError("Email already in use"));
    }

    const salt = random(128);

    const user = await createUser({
      email,
      username,
      authentication: {
        password: authentication(password, salt),
        salt,
      },
    });

    return res.status(201).send(user).end();
  } catch (error) {
    console.error(error);
    return next(new ApplicationError());
  }
};

export const login = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new BadRequestError("Invalid request"));
    }

    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );
    if (!user) {
      return next(new NotFoundError("Invalid username or password"));
    }

    if (
      user.authentication.password !==
      authentication(password, user.authentication.salt)
    ) {
      return next(new AuthenticationError("Invalid username or password"));
    }

    const salt = random(128);
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );
    await user.save();

    res.cookie(AUTHENTICATION_COOKIE_NAME, user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });

    return res.status(200).send(user).end();
  } catch (error) {
    console.error(error);
    return next(new ApplicationError());
  }
};
