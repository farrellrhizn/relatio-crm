import api from "./api";

export interface Lead {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadInput {
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  status?: string;
}

export async function getLeads(): Promise<Lead[]> {
  const response = await api.get("/leads");
  return response.data;
}

export async function createLead(data: LeadInput): Promise<Lead> {
  const response = await api.post("/leads", data);
  return response.data;
}

export async function updateLead(id: number, data: Partial<LeadInput>): Promise<Lead> {
  const response = await api.put(`/leads/${id}`, data);
  return response.data;
}

export async function deleteLead(id: number): Promise<void> {
  await api.delete(`/leads/${id}`);
}
