import api from "./api";

export interface Lead {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  companyId: number | null;
  companyRelation?: { name: string } | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadInput {
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  companyId?: number | null;
  status?: string;
}

export interface LeadsResponse {
  data: Lead[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getLeads(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}): Promise<LeadsResponse> {
  const response = await api.get("/leads", { params });
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
