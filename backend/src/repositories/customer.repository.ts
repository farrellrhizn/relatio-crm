import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

export const createCustomer = async (
  data: Prisma.CustomerUncheckedCreateInput
) => {
  return prisma.customer.create({
    data,
  });
};

export const findAllCustomers = async (
  userId: number,
  params: {
    skip?: number;
    take?: number;
    search?: string;
  } = {}
) => {
  const { skip, take, search } = params;

  const whereClause: Prisma.CustomerWhereInput = {
    userId,
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [data, total] = await Promise.all([
    prisma.customer.findMany({
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
    prisma.customer.count({
      where: whereClause,
    }),
  ]);

  return { data, total };
};

export const findCustomerById = async (
  id: number,
  userId: number
) => {
  return prisma.customer.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      companyRelation: true,
    },
  });
};

export const updateCustomerById = async (
  id: number,
  data: Prisma.CustomerUpdateInput
) => {
  return prisma.customer.update({
    where: {
      id,
    },
    data,
  });
};

export const deleteCustomerById = async (id: number) => {
  return prisma.customer.delete({
    where: {
      id,
    },
  });
};
