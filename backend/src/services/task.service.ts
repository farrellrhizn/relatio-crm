import {
  createTask,
  deleteTaskById,
  findAllTasks,
  findTaskById,
  updateTaskById,
} from "../repositories/task.repository";
import { taskSchema } from "../validations/schemas";

export const getTasksService = async (userId: number) => {
  return findAllTasks(userId);
};

export const getTaskByIdService = async (id: number, userId: number) => {
  const task = await findTaskById(id, userId);
  if (!task) throw new Error("Task not found");
  return task;
};

export const createTaskService = async (userId: number, data: any) => {
  const validated = taskSchema.parse(data);
  return createTask({
    title: validated.title,
    description: validated.description ?? null,
    dueDate: validated.dueDate ? new Date(validated.dueDate) : null,
    status: validated.status ?? "todo",
    priority: validated.priority ?? "medium",
    userId,
  });
};

export const updateTaskService = async (id: number, userId: number, data: any) => {
  await getTaskByIdService(id, userId);
  const validated = taskSchema.partial().parse(data);
  
  const updateData: any = {};
  if (validated.title !== undefined) updateData.title = validated.title;
  if (validated.description !== undefined) updateData.description = validated.description ?? null;
  if (validated.dueDate !== undefined) {
    updateData.dueDate = validated.dueDate ? new Date(validated.dueDate) : null;
  }
  if (validated.status !== undefined) updateData.status = validated.status;
  if (validated.priority !== undefined) updateData.priority = validated.priority;

  return updateTaskById(id, updateData);
};

export const deleteTaskService = async (id: number, userId: number) => {
  await getTaskByIdService(id, userId);
  return deleteTaskById(id);
};
