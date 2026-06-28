import {
  createOpportunity,
  deleteOpportunityById,
  findAllOpportunities,
  findOpportunityById,
  updateOpportunityById,
} from "../repositories/opportunity.repository";
import { opportunitySchema } from "../validations/schemas";
import { prisma } from "../config/prisma";

export const getOpportunitiesService = async (userId: number) => {
  return findAllOpportunities(userId);
};

export const getOpportunityByIdService = async (id: number, userId: number) => {
  const opportunity = await findOpportunityById(id, userId);
  if (!opportunity) throw new Error("Opportunity not found");
  return opportunity;
};

export const createOpportunityService = async (userId: number, data: any) => {
  const validated = opportunitySchema.parse(data);
  let finalCustomerId = validated.customerId ?? null;

  // If stage is won and there's a lead, convert lead to customer
  if (validated.stage === "won" && validated.leadId) {
    const lead = await prisma.lead.findFirst({ where: { id: validated.leadId, userId } });
    if (lead) {
      await prisma.lead.update({ where: { id: lead.id }, data: { status: "won" } });
      
      let customer = await prisma.customer.findFirst({ where: { email: lead.email, userId } });
      if (!customer) {
        customer = await prisma.customer.create({
          data: {
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            company: lead.company,
            userId,
          }
        });
      }
      finalCustomerId = customer.id;
    }
  }

  return createOpportunity({
    title: validated.title,
    value: validated.value ?? 0,
    stage: validated.stage ?? "qualification",
    closeDate: validated.closeDate ? new Date(validated.closeDate) : null,
    leadId: validated.leadId ?? null,
    customerId: finalCustomerId,
    companyId: validated.companyId ?? null,
    userId,
  });
};

export const updateOpportunityService = async (id: number, userId: number, data: any) => {
  const existing = await getOpportunityByIdService(id, userId);
  const validated = opportunitySchema.partial().parse(data);

  const finalStage = validated.stage || existing.stage;
  const finalLeadId = validated.leadId !== undefined ? validated.leadId : existing.leadId;
  let finalCustomerId = validated.customerId !== undefined ? (validated.customerId ?? null) : existing.customerId;

  if (finalStage === "won" && finalLeadId && existing.stage !== "won") {
    const lead = await prisma.lead.findFirst({ where: { id: finalLeadId, userId } });
    if (lead) {
      await prisma.lead.update({ where: { id: lead.id }, data: { status: "won" } });
      let customer = await prisma.customer.findFirst({ where: { email: lead.email, userId } });
      if (!customer) {
        customer = await prisma.customer.create({
          data: {
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            company: lead.company,
            userId,
          }
        });
      }
      finalCustomerId = customer.id;
    }
  }

  const updateData: any = {};
  if (validated.title !== undefined) updateData.title = validated.title;
  if (validated.value !== undefined) updateData.value = validated.value;
  if (validated.stage !== undefined) updateData.stage = validated.stage;
  if (validated.closeDate !== undefined) {
    updateData.closeDate = validated.closeDate ? new Date(validated.closeDate) : null;
  }
  if (validated.leadId !== undefined) updateData.leadId = validated.leadId ?? null;
  if (validated.customerId !== undefined || finalCustomerId !== existing.customerId) {
    updateData.customerId = finalCustomerId;
  }
  if (validated.companyId !== undefined) updateData.companyId = validated.companyId ?? null;

  return updateOpportunityById(id, updateData);
};

export const deleteOpportunityService = async (id: number, userId: number) => {
  await getOpportunityByIdService(id, userId);
  return deleteOpportunityById(id);
};
