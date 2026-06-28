import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

export const createLead = async (data: Prisma.LeadUncheckedCreateInput) => {
  return prisma.lead.create({
    data,
  });
};

export const findAllLeads = async (
  userId: number,
  params: {
    skip?: number;
    take?: number;
    search?: string;
    status?: string;
  } = {}
) => {
  const { skip, take, search, status } = params;

  const whereClause: Prisma.LeadWhereInput = {
    userId,
    ...(status && { status }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [data, total] = await Promise.all([
    prisma.lead.findMany({
      where: whereClause,
      include: {
        companyRelation: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      ...(skip !== undefined && { skip }),
      ...(take !== undefined && { take }),
    }),
    prisma.lead.count({
      where: whereClause,
    }),
  ]);

  return { data, total };
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
    include: {
      companyRelation: true,
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
