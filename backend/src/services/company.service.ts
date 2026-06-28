import {
  createCompany,
  deleteCompanyById,
  findAllCompanies,
  findCompanyById,
  updateCompanyById,
} from "../repositories/company.repository";
import { companySchema } from "../validations/schemas";

export const getCompaniesService = async (userId: number) => {
  return findAllCompanies(userId);
};

export const getCompanyByIdService = async (id: number, userId: number) => {
  const company = await findCompanyById(id, userId);
  if (!company) throw new Error("Company not found");
  return company;
};

export const createCompanyService = async (userId: number, data: any) => {
  const validated = companySchema.parse(data);
  return createCompany({
    name: validated.name,
    domain: validated.domain ?? null,
    phone: validated.phone ?? null,
    address: validated.address ?? null,
    userId,
  });
};

export const updateCompanyService = async (id: number, userId: number, data: any) => {
  await getCompanyByIdService(id, userId);
  const validated = companySchema.partial().parse(data);
  
  const updateData: any = {};
  if (validated.name !== undefined) updateData.name = validated.name;
  if (validated.domain !== undefined) updateData.domain = validated.domain ?? null;
  if (validated.phone !== undefined) updateData.phone = validated.phone ?? null;
  if (validated.address !== undefined) updateData.address = validated.address ?? null;

  return updateCompanyById(id, updateData);
};

export const deleteCompanyService = async (id: number, userId: number) => {
  await getCompanyByIdService(id, userId);
  return deleteCompanyById(id);
};
