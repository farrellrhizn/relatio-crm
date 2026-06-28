import { Request, Response, NextFunction } from "express";
import {
  createProposalService,
  deleteProposalService,
  getProposalsService,
  getProposalByIdService,
  updateProposalService,
} from "../services/proposal.service";

export const getProposals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const proposals = await getProposalsService(req.user!.userId);
    res.json(proposals);
  } catch (error) {
    next(error);
  }
};

export const getProposalById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const proposal = await getProposalByIdService(Number(req.params.id), req.user!.userId);
    res.json(proposal);
  } catch (error) {
    next(error);
  }
};

export const createProposal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const proposal = await createProposalService(req.user!.userId, req.body);
    res.status(201).json(proposal);
  } catch (error) {
    next(error);
  }
};

export const updateProposal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const proposal = await updateProposalService(Number(req.params.id), req.user!.userId, req.body);
    res.json(proposal);
  } catch (error) {
    next(error);
  }
};

export const deleteProposal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteProposalService(Number(req.params.id), req.user!.userId);
    res.json({ message: "Proposal deleted successfully" });
  } catch (error) {
    next(error);
  }
};
