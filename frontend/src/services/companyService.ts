import api from "./api";

export interface Company {
  id: number;
  name: string;
  domain?: string | null;
  phone?: string | null;
  address?: string | null;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

export interface CompanyInput {
  name: string;
  domain?: string | null;
  phone?: string | null;
  address?: string | null;
}

export async function getCompanies(): Promise<Company[]> {
  const response = await api.get("/companies");
  return response.data;
}

export async function getCompanyById(id: number): Promise<Company> {
  const response = await api.get(`/companies/${id}`);
  return response.data;
}

export async function createCompany(data: CompanyInput): Promise<Company> {
  const response = await api.post("/companies", data);
  return response.data;
}

export async function updateCompany(id: number, data: Partial<CompanyInput>): Promise<Company> {
  const response = await api.put(`/companies/${id}`, data);
  return response.data;
}

export async function deleteCompany(id: number): Promise<void> {
  await api.delete(`/companies/${id}`);
}
