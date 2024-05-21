import express from "express";

import { getUsers, deleteUserById, getUserById } from "../db/users";
import { ApplicationError, BadRequestError, NotFoundError } from "../errors";

export const getAllUsers = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const users = await getUsers();
    return res.status(200).send(users).end();
  } catch (error) {
    console.error(error);
    return next(new ApplicationError());
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    await deleteUserById(id);
    return res.status(204).end();
  } catch (error) {
    console.error(error);
    return next(new ApplicationError());
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const { username } = req.body;
    if (!username) {
      return next(new BadRequestError("Invalid request"));
    }

    const user = await getUserById(id);
    if (!user) {
      return next(new NotFoundError("User not found"));
    }

    user.username = username;
    await user.save();

    return res.status(200).json(user).end();
  } catch (error) {
    console.error(error);
    return next(new ApplicationError());
  }
};
