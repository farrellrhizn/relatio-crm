import {
  createCustomer,
  deleteCustomerById,
  findAllCustomers,
  findCustomerById,
  updateCustomerById,
} from "../repositories/customer.repository";

type CustomerInput = {
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  companyId?: number | null;
};

const cleanCustomerInput = (data: Partial<CustomerInput>) => {
  return {
    ...(data.name !== undefined && { name: data.name }),
    ...(data.email !== undefined && { email: data.email }),
    ...(data.phone !== undefined && { phone: data.phone }),
    ...(data.company !== undefined && { company: data.company }),
    ...(data.companyId !== undefined && { companyId: data.companyId }),
  };
};

const validateCustomerId = (id: number) => {
  if (Number.isNaN(id)) {
    throw new Error("Invalid customer id");
  }
};

export const createCustomerService = async (
  userId: number,
  data: CustomerInput
) => {
  if (!data.name) {
    throw new Error("Name is required");
  }

  const cleaned = cleanCustomerInput(data);

  return createCustomer({
    name: data.name,
    userId,
    email: cleaned.email ?? null,
    phone: cleaned.phone ?? null,
    company: cleaned.company ?? null,
    companyId: cleaned.companyId ?? null,
  });
};

export const getCustomersService = async (
  userId: number,
  params: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}
) => {
  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit && params.limit > 0 ? params.limit : 10;
  const skip = (page - 1) * limit;

  const { data, total } = await findAllCustomers(userId, {
    skip,
    take: limit,
    ...(params.search && { search: params.search }),
  });

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const getCustomerByIdService = async (
  userId: number,
  id: number
) => {
  validateCustomerId(id);

  const customer = await findCustomerById(id, userId);

  if (!customer) {
    throw new Error("Customer not found");
  }

  return customer;
};

export const updateCustomerService = async (
  userId: number,
  id: number,
  data: Partial<CustomerInput>
) => {
  validateCustomerId(id);
  await getCustomerByIdService(userId, id);

  const cleaned = cleanCustomerInput(data);
  const updateData: any = {};
  if (cleaned.name !== undefined) updateData.name = cleaned.name;
  if (cleaned.email !== undefined) updateData.email = cleaned.email ?? null;
  if (cleaned.phone !== undefined) updateData.phone = cleaned.phone ?? null;
  if (cleaned.company !== undefined) updateData.company = cleaned.company ?? null;
  if (cleaned.companyId !== undefined) updateData.companyId = cleaned.companyId ?? null;

  return updateCustomerById(id, updateData);
};

export const deleteCustomerService = async (
  userId: number,
  id: number
) => {
  validateCustomerId(id);
  await getCustomerByIdService(userId, id);

  return deleteCustomerById(id);
};
