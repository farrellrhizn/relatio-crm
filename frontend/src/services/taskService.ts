import api from "./api";

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  status: "todo" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
  userId: number;
}

export interface TaskInput {
  title: string;
  description?: string | null;
  dueDate?: string | null;
  status?: "todo" | "in_progress" | "completed";
  priority?: "low" | "medium" | "high";
}

export async function getTasks(): Promise<Task[]> {
  const response = await api.get("/tasks");
  return response.data;
}

export async function getTaskById(id: number): Promise<Task> {
  const response = await api.get(`/tasks/${id}`);
  return response.data;
}

export async function createTask(data: TaskInput): Promise<Task> {
  const response = await api.post("/tasks", data);
  return response.data;
}

export async function updateTask(id: number, data: Partial<TaskInput>): Promise<Task> {
  const response = await api.put(`/tasks/${id}`, data);
  return response.data;
}

export async function deleteTask(id: number): Promise<void> {
  await api.delete(`/tasks/${id}`);
}
