import { prisma } from "../config/prisma";
import { Prisma } from "@prisma/client";

export const createProposal = async (data: Prisma.ProposalUncheckedCreateInput) => {
  return prisma.proposal.create({ data });
};

export const findAllProposals = async (userId: number) => {
  return prisma.proposal.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      lead: { select: { name: true } },
      customer: { select: { name: true } },
      company: { select: { name: true } },
    },
  });
};

export const findProposalById = async (id: number, userId: number) => {
  return prisma.proposal.findFirst({
    where: { id, userId },
    include: {
      lead: { select: { name: true } },
      customer: { select: { name: true } },
      company: { select: { name: true } },
    },
  });
};

export const updateProposalById = async (id: number, data: Prisma.ProposalUpdateInput) => {
  return prisma.proposal.update({
    where: { id },
    data,
    include: {
      lead: { select: { name: true } },
      customer: { select: { name: true } },
      company: { select: { name: true } },
    },
  });
};

export const deleteProposalById = async (id: number) => {
  return prisma.proposal.delete({
    where: { id },
  });
};
