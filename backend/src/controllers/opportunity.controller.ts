import { Request, Response, NextFunction } from "express";
import {
  createOpportunityService,
  deleteOpportunityService,
  getOpportunitiesService,
  getOpportunityByIdService,
  updateOpportunityService,
} from "../services/opportunity.service";

export const getOpportunities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const opportunities = await getOpportunitiesService(req.user!.userId);
    res.json(opportunities);
  } catch (error) {
    next(error);
  }
};

export const getOpportunityById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const opportunity = await getOpportunityByIdService(Number(req.params.id), req.user!.userId);
    res.json(opportunity);
  } catch (error) {
    next(error);
  }
};

export const createOpportunity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const opportunity = await createOpportunityService(req.user!.userId, req.body);
    res.status(201).json(opportunity);
  } catch (error) {
    next(error);
  }
};

export const updateOpportunity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const opportunity = await updateOpportunityService(Number(req.params.id), req.user!.userId, req.body);
    res.json(opportunity);
  } catch (error) {
    next(error);
  }
};

export const deleteOpportunity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteOpportunityService(Number(req.params.id), req.user!.userId);
    res.json({ message: "Opportunity deleted successfully" });
  } catch (error) {
    next(error);
  }
};
