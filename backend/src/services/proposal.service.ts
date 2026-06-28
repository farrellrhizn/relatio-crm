import {
  createProposal,
  deleteProposalById,
  findAllProposals,
  findProposalById,
  updateProposalById,
} from "../repositories/proposal.repository";
import { proposalSchema } from "../validations/schemas";

export const getProposalsService = async (userId: number) => {
  return findAllProposals(userId);
};

export const getProposalByIdService = async (id: number, userId: number) => {
  const proposal = await findProposalById(id, userId);
  if (!proposal) throw new Error("Proposal not found");
  return proposal;
};

export const createProposalService = async (userId: number, data: any) => {
  const validated = proposalSchema.parse(data);
  return createProposal({
    title: validated.title,
    value: validated.value ?? 0,
    status: validated.status ?? "draft",
    validUntil: validated.validUntil ? new Date(validated.validUntil) : null,
    leadId: validated.leadId ?? null,
    customerId: validated.customerId ?? null,
    companyId: validated.companyId ?? null,
    userId,
  });
};

export const updateProposalService = async (id: number, userId: number, data: any) => {
  await getProposalByIdService(id, userId);
  const validated = proposalSchema.partial().parse(data);

  const updateData: any = {};
  if (validated.title !== undefined) updateData.title = validated.title;
  if (validated.value !== undefined) updateData.value = validated.value;
  if (validated.status !== undefined) updateData.status = validated.status;
  if (validated.validUntil !== undefined) {
    updateData.validUntil = validated.validUntil ? new Date(validated.validUntil) : null;
  }
  if (validated.leadId !== undefined) updateData.leadId = validated.leadId ?? null;
  if (validated.customerId !== undefined) updateData.customerId = validated.customerId ?? null;
  if (validated.companyId !== undefined) updateData.companyId = validated.companyId ?? null;

  return updateProposalById(id, updateData);
};

export const deleteProposalService = async (id: number, userId: number) => {
  await getProposalByIdService(id, userId);
  return deleteProposalById(id);
};
