import { prisma } from "../config/prisma";
import { Prisma } from "@prisma/client";

export const createOpportunity = async (data: Prisma.OpportunityUncheckedCreateInput) => {
  return prisma.opportunity.create({ data });
};

export const findAllOpportunities = async (userId: number) => {
  return prisma.opportunity.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      lead: { select: { name: true } },
      customer: { select: { name: true } },
      company: { select: { name: true } },
    },
  });
};

export const findOpportunityById = async (id: number, userId: number) => {
  return prisma.opportunity.findFirst({
    where: { id, userId },
    include: {
      lead: { select: { name: true } },
      customer: { select: { name: true } },
      company: { select: { name: true } },
    },
  });
};

export const updateOpportunityById = async (id: number, data: Prisma.OpportunityUpdateInput) => {
  return prisma.opportunity.update({
    where: { id },
    data,
    include: {
      lead: { select: { name: true } },
      customer: { select: { name: true } },
      company: { select: { name: true } },
    },
  });
};

export const deleteOpportunityById = async (id: number) => {
  return prisma.opportunity.delete({
    where: { id },
  });
};
