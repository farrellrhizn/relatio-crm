import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { findByEmail, createUser } from "../repositories/user.repository";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
) => {
  const existingUser = await findByEmail(email);

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return createUser(name, email, hashedPassword);
};

export const loginUser = async (
  email: string,
  password: string
) => {
  const user = await findByEmail(email);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1d",
    }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};
