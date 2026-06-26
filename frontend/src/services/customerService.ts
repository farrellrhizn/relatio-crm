import api from "./api";

export interface Customer {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerInput {
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
}

export async function getCustomers(): Promise<Customer[]> {
  const response = await api.get("/customers");
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
