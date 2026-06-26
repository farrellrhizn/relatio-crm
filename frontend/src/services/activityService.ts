import api from "./api";

export interface Activity {
  id: number;
  type: string; // e.g., "note", "call", "meeting", "follow-up"
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  leadId?: number | null;
  customerId?: number | null;
  lead?: { name: string } | null;
  customer?: { name: string } | null;
}

export interface ActivityInput {
  type: string;
  content: string;
  leadId?: number | null;
  customerId?: number | null;
}

export async function getActivities(leadId?: number, customerId?: number): Promise<Activity[]> {
  const params: any = {};
  if (leadId) params.leadId = leadId;
  if (customerId) params.customerId = customerId;

  const response = await api.get("/activities", { params });
  return response.data;
}

export async function createActivity(data: ActivityInput): Promise<Activity> {
  const response = await api.post("/activities", data);
  return response.data;
}

export async function deleteActivity(id: number): Promise<void> {
  await api.delete(`/activities/${id}`);
}
