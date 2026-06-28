import { Request, Response, NextFunction } from "express";
import {
  createTaskService,
  deleteTaskService,
  getTasksService,
  getTaskByIdService,
  updateTaskService,
} from "../services/task.service";

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tasks = await getTasksService(req.user!.userId);
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await getTaskByIdService(Number(req.params.id), req.user!.userId);
    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await createTaskService(req.user!.userId, req.body);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await updateTaskService(Number(req.params.id), req.user!.userId, req.body);
    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteTaskService(Number(req.params.id), req.user!.userId);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};
