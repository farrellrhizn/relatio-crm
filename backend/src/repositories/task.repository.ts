import { prisma } from "../config/prisma";
import { Prisma } from "@prisma/client";

export const createTask = async (data: Prisma.TaskUncheckedCreateInput) => {
  return prisma.task.create({ data });
};

export const findAllTasks = async (userId: number) => {
  return prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const findTaskById = async (id: number, userId: number) => {
  return prisma.task.findFirst({
    where: { id, userId },
  });
};

export const updateTaskById = async (id: number, data: Prisma.TaskUpdateInput) => {
  return prisma.task.update({
    where: { id },
    data,
  });
};

export const deleteTaskById = async (id: number) => {
  return prisma.task.delete({
    where: { id },
  });
};
