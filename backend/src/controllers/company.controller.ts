import { Request, Response, NextFunction } from "express";
import {
  createCompanyService,
  deleteCompanyService,
  getCompaniesService,
  getCompanyByIdService,
  updateCompanyService,
} from "../services/company.service";

export const getCompanies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companies = await getCompaniesService(req.user!.userId);
    res.json(companies);
  } catch (error) {
    next(error);
  }
};

export const getCompanyById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const company = await getCompanyByIdService(Number(req.params.id), req.user!.userId);
    res.json(company);
  } catch (error) {
    next(error);
  }
};

export const createCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const company = await createCompanyService(req.user!.userId, req.body);
    res.status(201).json(company);
  } catch (error) {
    next(error);
  }
};

export const updateCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const company = await updateCompanyService(Number(req.params.id), req.user!.userId, req.body);
    res.json(company);
  } catch (error) {
    next(error);
  }
};

export const deleteCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteCompanyService(Number(req.params.id), req.user!.userId);
    res.json({ message: "Company deleted successfully" });
  } catch (error) {
    next(error);
  }
};
