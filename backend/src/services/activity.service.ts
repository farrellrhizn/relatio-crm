import {
  createActivity,
  findAllActivities,
  findActivityById,
  updateActivity,
  deleteActivity,
} from "../repositories/activity.repository";

type ActivityInput = {
  type: string;
  content: string;
  leadId?: number;
  customerId?: number;
};

const validateActivityId = (id: number) => {
  if (Number.isNaN(id)) {
    throw new Error("Invalid activity id");
  }
};

export const createNewActivity = async (userId: number, data: ActivityInput) => {
  if (!data.type || !data.content) {
    throw new Error("Type and content are required");
  }

  return createActivity({
    type: data.type,
    content: data.content,
    leadId: data.leadId ?? null,
    customerId: data.customerId ?? null,
    userId,
  });
};

export const getActivities = async (userId: number, leadId?: number, customerId?: number) => {
  const filters: any = {};
  if (leadId && !Number.isNaN(leadId)) filters.leadId = leadId;
  if (customerId && !Number.isNaN(customerId)) filters.customerId = customerId;
  
  return findAllActivities(userId, filters);
};

export const getActivityById = async (id: number, userId: number) => {
  validateActivityId(id);

  const activity = await findActivityById(id, userId);
  if (!activity) {
    throw new Error("Activity not found");
  }

  return activity;
};

export const updateExistingActivity = async (id: number, userId: number, data: Partial<ActivityInput>) => {
  validateActivityId(id);

  const activity = await findActivityById(id, userId);
  if (!activity) {
    throw new Error("Activity not found");
  }

  const cleanData = {
    ...(data.type !== undefined && { type: data.type }),
    ...(data.content !== undefined && { content: data.content }),
    ...(data.leadId !== undefined && { leadId: data.leadId }),
    ...(data.customerId !== undefined && { customerId: data.customerId }),
  };

  return updateActivity(id, cleanData);
};

export const removeActivity = async (id: number, userId: number) => {
  validateActivityId(id);

  const activity = await findActivityById(id, userId);
  if (!activity) {
    throw new Error("Activity not found");
  }

  return deleteActivity(id);
};
