import { Request, Response } from "express";
import {
  createCustomerService,
  deleteCustomerService,
  getCustomerByIdService,
  getCustomersService,
  updateCustomerService,
} from "../services/customer.service";

export const createCustomerController = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const customer = await createCustomerService(req.user.userId, req.body);

    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong",
    });
  }
};

export const getCustomersController = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const { page, limit, search } = req.query;

    const customers = await getCustomersService(req.user.userId, {
      ...(page && { page: Number(page) }),
      ...(limit && { limit: Number(limit) }),
      ...(search && { search: String(search) }),
    });

    res.status(200).json(customers);
  } catch (error) {
    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong",
    });
  }
};

export const getCustomerByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const id = Number(req.params.id);
    const customer = await getCustomerByIdService(req.user.userId, id);

    res.status(200).json(customer);
  } catch (error) {
    res.status(404).json({
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong",
    });
  }
};

export const updateCustomerController = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const id = Number(req.params.id);
    const customer = await updateCustomerService(
      req.user.userId,
      id,
      req.body
    );

    res.status(200).json(customer);
  } catch (error) {
    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong",
    });
  }
};

export const deleteCustomerController = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const id = Number(req.params.id);
    await deleteCustomerService(req.user.userId, id);

    res.status(200).json({
      message: "Customer deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong",
    });
  }
};
