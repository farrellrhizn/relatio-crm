import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

export const createActivity = async (data: Prisma.ActivityUncheckedCreateInput) => {
  return prisma.activity.create({
    data,
  });
};

export const findAllActivities = async (userId: number, filters?: { leadId?: number; customerId?: number }) => {
  return prisma.activity.findMany({
    where: {
      userId,
      ...filters,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      lead: {
        select: { name: true }
      },
      customer: {
        select: { name: true }
      }
    }
  });
};

export const findActivityById = async (id: number, userId: number) => {
  return prisma.activity.findFirst({
    where: {
      id,
      userId,
    }
  });
};

export const updateActivity = async (id: number, data: Prisma.ActivityUncheckedUpdateInput) => {
  return prisma.activity.update({
    where: { id },
    data,
  });
};

export const deleteActivity = async (id: number) => {
  return prisma.activity.delete({
    where: { id },
  });
};
