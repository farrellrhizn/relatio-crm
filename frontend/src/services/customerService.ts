import api from "./api";

export interface Customer {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  companyId: number | null;
  companyRelation?: { name: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerInput {
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  companyId?: number | null;
}

export interface CustomersResponse {
  data: Customer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getCustomers(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<CustomersResponse> {
  const response = await api.get("/customers", { params });
  return response.data;
}

export async function createCustomer(data: CustomerInput): Promise<Customer> {
  const response = await api.post("/customers", data);
  return response.data;
}

export async function updateCustomer(id: number, data: Partial<CustomerInput>): Promise<Customer> {
  const response = await api.put(`/customers/${id}`, data);
  return response.data;
}

export async function deleteCustomer(id: number): Promise<void> {
  await api.delete(`/customers/${id}`);
}
