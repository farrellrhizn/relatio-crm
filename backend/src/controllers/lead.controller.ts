import { Request, Response } from "express";
import {
  createLeadService,
  deleteLeadService,
  getLeadByIdService,
  getLeadsService,
  updateLeadService,
} from "../services/lead.service";

export const createLeadController = async (
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

    const lead = await createLeadService(req.user.userId, req.body);

    res.status(201).json(lead);
  } catch (error) {
    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong",
    });
  }
};

export const getLeadsController = async (
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

    const leads = await getLeadsService(req.user.userId);

    res.status(200).json(leads);
  } catch (error) {
    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong",
    });
  }
};

export const getLeadByIdController = async (
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
    const lead = await getLeadByIdService(req.user.userId, id);

    res.status(200).json(lead);
  } catch (error) {
    res.status(404).json({
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong",
    });
  }
};

export const updateLeadController = async (
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
    const lead = await updateLeadService(req.user.userId, id, req.body);

    res.status(200).json(lead);
  } catch (error) {
    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong",
    });
  }
};

export const deleteLeadController = async (
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
    await deleteLeadService(req.user.userId, id);

    res.status(200).json({
      message: "Lead deleted successfully",
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
