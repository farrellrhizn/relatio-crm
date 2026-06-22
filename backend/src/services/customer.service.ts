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
};

const cleanCustomerInput = (data: Partial<CustomerInput>) => {
  return {
    ...(data.name !== undefined && { name: data.name }),
    ...(data.email !== undefined && { email: data.email }),
    ...(data.phone !== undefined && { phone: data.phone }),
    ...(data.company !== undefined && { company: data.company }),
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

  return createCustomer({
    name: data.name,
    userId,
    ...cleanCustomerInput(data),
  });
};

export const getCustomersService = async (userId: number) => {
  return findAllCustomers(userId);
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

  return updateCustomerById(id, cleanCustomerInput(data));
};

export const deleteCustomerService = async (
  userId: number,
  id: number
) => {
  validateCustomerId(id);
  await getCustomerByIdService(userId, id);

  return deleteCustomerById(id);
};
