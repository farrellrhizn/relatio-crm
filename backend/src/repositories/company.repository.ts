import { prisma } from "../config/prisma";
import { Prisma } from "@prisma/client";

export const createCompany = async (data: Prisma.CompanyUncheckedCreateInput) => {
  return prisma.company.create({ data });
};

export const findAllCompanies = async (userId: number) => {
  return prisma.company.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const findCompanyById = async (id: number, userId: number) => {
  return prisma.company.findFirst({
    where: { id, userId },
  });
};

export const updateCompanyById = async (id: number, data: Prisma.CompanyUpdateInput) => {
  return prisma.company.update({
    where: { id },
    data,
  });
};

export const deleteCompanyById = async (id: number) => {
  return prisma.company.delete({
    where: { id },
  });
};
