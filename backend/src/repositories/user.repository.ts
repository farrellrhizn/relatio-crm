import { prisma } from "../config/prisma";

export const findByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const findById = async (id: number) => {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
};

export const createUser = async (
  name: string,
  email: string,
  password: string
) => {
  return prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });
};

export const updatePassword = async (id: number, password: string) => {
  return prisma.user.update({
    where: { id },
    data: { password },
  });
};
