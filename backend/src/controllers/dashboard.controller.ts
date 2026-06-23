import { Request, Response } from "express";
import { getDashboardMetrics } from "../services/dashboard.service";

export const getDashboardDataController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const data = await getDashboardMetrics(req.user.userId);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};
