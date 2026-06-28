import { Request, Response, NextFunction } from "express";
import { getDashboardMetrics, searchGlobalMetrics, getNotificationsMetrics, readNotificationsMetrics } from "../services/dashboard.service";

export const getDashboardDataController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const data = await getDashboardMetrics(req.user.userId);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const searchGlobalController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const query = req.query.query ? String(req.query.query) : "";
    const results = await searchGlobalMetrics(req.user.userId, query);
    res.json(results);
  } catch (error) {
    next(error);
  }
};

export const getNotificationsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const notifications = await getNotificationsMetrics(req.user.userId);
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

export const markNotificationsAsReadController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    await readNotificationsMetrics(req.user.userId);
    res.json({ message: "Notifications marked as read" });
  } catch (error) {
    next(error);
  }
};
