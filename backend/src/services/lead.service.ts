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
};

const cleanLeadInput = (data: Partial<LeadInput>) => {
  return {
    ...(data.name !== undefined && { name: data.name }),
    ...(data.email !== undefined && { email: data.email }),
    ...(data.phone !== undefined && { phone: data.phone }),
    ...(data.company !== undefined && { company: data.company }),
    ...(data.status !== undefined && { status: data.status }),
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

  return createLead({
    name: data.name,
    userId,
    ...cleanLeadInput(data),
  });
};

export const getLeadsService = async (userId: number) => {
  return findAllLeads(userId);
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

  return updateLeadById(id, cleanLeadInput(data));
};

export const deleteLeadService = async (
  userId: number,
  id: number
) => {
  validateLeadId(id);
  await getLeadByIdService(userId, id);

  return deleteLeadById(id);
};
