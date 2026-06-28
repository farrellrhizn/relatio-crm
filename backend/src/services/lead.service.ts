import {
  createLead,
  deleteLeadById,
  findAllLeads,
  findLeadById,
  updateLeadById,
} from "../repositories/lead.repository";

type LeadInput = {
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  status?: string;
  companyId?: number | null;
};

const cleanLeadInput = (data: Partial<LeadInput>) => {
  return {
    ...(data.name !== undefined && { name: data.name }),
    ...(data.email !== undefined && { email: data.email }),
    ...(data.phone !== undefined && { phone: data.phone }),
    ...(data.company !== undefined && { company: data.company }),
    ...(data.status !== undefined && { status: data.status }),
    ...(data.companyId !== undefined && { companyId: data.companyId }),
  };
};

const validateLeadId = (id: number) => {
  if (Number.isNaN(id)) {
    throw new Error("Invalid lead id");
  }
};

export const createLeadService = async (
  userId: number,
  data: LeadInput
) => {
  if (!data.name) {
    throw new Error("Name is required");
  }

  const cleaned = cleanLeadInput(data);

  return createLead({
    name: data.name,
    userId,
    status: cleaned.status ?? "new",
    email: cleaned.email ?? null,
    phone: cleaned.phone ?? null,
    company: cleaned.company ?? null,
    companyId: cleaned.companyId ?? null,
  });
};

export const getLeadsService = async (
  userId: number,
  params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  } = {}
) => {
  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit && params.limit > 0 ? params.limit : 10;
  const skip = (page - 1) * limit;

  const { data, total } = await findAllLeads(userId, {
    skip,
    take: limit,
    ...(params.search && { search: params.search }),
    ...(params.status && { status: params.status }),
  });

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const getLeadByIdService = async (
  userId: number,
  id: number
) => {
  validateLeadId(id);

  const lead = await findLeadById(id, userId);

  if (!lead) {
    throw new Error("Lead not found");
  }

  return lead;
};

export const updateLeadService = async (
  userId: number,
  id: number,
  data: Partial<LeadInput>
) => {
  validateLeadId(id);
  await getLeadByIdService(userId, id);

  const cleaned = cleanLeadInput(data);
  const updateData: any = {};
  if (cleaned.name !== undefined) updateData.name = cleaned.name;
  if (cleaned.email !== undefined) updateData.email = cleaned.email ?? null;
  if (cleaned.phone !== undefined) updateData.phone = cleaned.phone ?? null;
  if (cleaned.company !== undefined) updateData.company = cleaned.company ?? null;
  if (cleaned.status !== undefined) updateData.status = cleaned.status;
  if (cleaned.companyId !== undefined) updateData.companyId = cleaned.companyId ?? null;

  return updateLeadById(id, updateData);
};

export const deleteLeadService = async (
  userId: number,
  id: number
) => {
  validateLeadId(id);
  await getLeadByIdService(userId, id);

  return deleteLeadById(id);
};
