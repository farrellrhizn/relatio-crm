import api from "./api";

export interface GlobalSearchItem {
  id: number;
  type: "lead" | "customer" | "company" | "opportunity" | "proposal";
  title: string;
  subtitle?: string | null;
}

export async function searchGlobal(query: string): Promise<GlobalSearchItem[]> {
  const response = await api.get("/dashboard/search", { params: { query } });
  return response.data;
}

export interface NotificationItem {
  id: number;
  title: string;
  description: string;
  read: boolean;
  createdAt: string;
}

export async function getNotifications(): Promise<NotificationItem[]> {
  const response = await api.get("/dashboard/notifications");
  return response.data;
}

export async function markNotificationsAsRead(): Promise<void> {
  await api.put("/dashboard/notifications/read");
}
