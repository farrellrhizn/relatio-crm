import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

export const createLead = async (data: Prisma.LeadUncheckedCreateInput) => {
  return prisma.lead.create({
    data,
  });
};

export const findAllLeads = async (userId: number) => {
  return prisma.lead.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const findLeadById = async (
  id: number,
  userId: number
) => {
  return prisma.lead.findFirst({
    where: {
      id,
      userId,
    },
  });
};

export const updateLeadById = async (
  id: number,
  data: Prisma.LeadUpdateInput
) => {
  return prisma.lead.update({
    where: {
      id,
    },
    data,
  });
};

export const deleteLeadById = async (id: number) => {
  return prisma.lead.delete({
    where: {
      id,
    },
  });
};
