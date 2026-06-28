import api from "./api";

export interface Opportunity {
  id: number;
  title: string;
  value: number;
  stage: "qualification" | "proposal" | "negotiation" | "won" | "lost";
  closeDate?: string | null;
  createdAt: string;
  updatedAt: string;
  userId: number;
  leadId?: number | null;
  customerId?: number | null;
  companyId?: number | null;
  lead?: { name: string } | null;
  customer?: { name: string } | null;
  company?: { name: string } | null;
}

export interface OpportunityInput {
  title: string;
  value: number;
  stage: "qualification" | "proposal" | "negotiation" | "won" | "lost";
  closeDate?: string | null;
  leadId?: number | null;
  customerId?: number | null;
  companyId?: number | null;
}

export async function getOpportunities(): Promise<Opportunity[]> {
  const response = await api.get("/opportunities");
  return response.data;
}

export async function getOpportunityById(id: number): Promise<Opportunity> {
  const response = await api.get(`/opportunities/${id}`);
  return response.data;
}

export async function createOpportunity(data: OpportunityInput): Promise<Opportunity> {
  const response = await api.post("/opportunities", data);
  return response.data;
}

export async function updateOpportunity(id: number, data: Partial<OpportunityInput>): Promise<Opportunity> {
  const response = await api.put(`/opportunities/${id}`, data);
  return response.data;
}

export async function deleteOpportunity(id: number): Promise<void> {
  await api.delete(`/opportunities/${id}`);
}
