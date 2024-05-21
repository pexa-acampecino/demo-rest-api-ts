import express from "express";
import { createUser, getUserByEmail } from "../db/users";
import { random, authentication } from "../helpers";
import { AUTHENTICATION_COOKIE_NAME } from "../constants/cookies";

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.status(400).send({ message: "Invalid request" });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).send({ message: "Email already in use" });
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
    return res.status(500).send({ message: "Internal server error" });
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ message: "Invalid request" });
    }

    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );
    if (!user) {
      return res.status(404).send({ message: "Invalid username or password" });
    }

    if (
      user.authentication.password !==
      authentication(password, user.authentication.salt)
    ) {
      return res.status(401).send({ message: "Invalid username or password" });
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
    return res.status(500).send({ message: "Internal server error" });
  }
};
