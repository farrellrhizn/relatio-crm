import { Request, Response } from "express";
import {
  createNewActivity,
  getActivities,
  getActivityById,
  updateExistingActivity,
  removeActivity,
} from "../services/activity.service";

export const createActivityController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const activity = await createNewActivity(req.user.userId, req.body);
    res.status(201).json(activity);
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

export const getActivitiesController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const leadId = req.query.leadId ? Number(req.query.leadId) : undefined;
    const customerId = req.query.customerId ? Number(req.query.customerId) : undefined;

    const activities = await getActivities(req.user.userId, leadId, customerId);
    res.status(200).json(activities);
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

export const getActivityByIdController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const id = Number(req.params.id);
    const activity = await getActivityById(id, req.user.userId);
    res.status(200).json(activity);
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

export const updateActivityController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const id = Number(req.params.id);
    const activity = await updateExistingActivity(id, req.user.userId, req.body);
    res.status(200).json(activity);
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

export const deleteActivityController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const id = Number(req.params.id);
    await removeActivity(id, req.user.userId);
    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};
