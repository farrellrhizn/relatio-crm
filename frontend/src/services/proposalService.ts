import api from "./api";

export interface Proposal {
  id: number;
  title: string;
  value: number;
  status: "draft" | "sent" | "accepted" | "rejected";
  validUntil?: string | null;
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

export interface ProposalInput {
  title: string;
  value: number;
  status: "draft" | "sent" | "accepted" | "rejected";
  validUntil?: string | null;
  leadId?: number | null;
  customerId?: number | null;
  companyId?: number | null;
}

export async function getProposals(): Promise<Proposal[]> {
  const response = await api.get("/proposals");
  return response.data;
}

export async function getProposalById(id: number): Promise<Proposal> {
  const response = await api.get(`/proposals/${id}`);
  return response.data;
}

export async function createProposal(data: ProposalInput): Promise<Proposal> {
  const response = await api.post("/proposals", data);
  return response.data;
}

export async function updateProposal(id: number, data: Partial<ProposalInput>): Promise<Proposal> {
  const response = await api.put(`/proposals/${id}`, data);
  return response.data;
}

export async function deleteProposal(id: number): Promise<void> {
  await api.delete(`/proposals/${id}`);
}
