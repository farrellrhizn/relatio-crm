import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(1, "Name is required"),
  domain: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
});

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable().optional(),
  dueDate: z.string().datetime().nullable().optional().or(z.string().nullable().optional()),
  status: z.enum(["todo", "in_progress", "completed"]).default("todo"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

export const opportunitySchema = z.object({
  title: z.string().min(1, "Title is required"),
  value: z.number().nonnegative("Value must be non-negative").default(0),
  stage: z.enum(["qualification", "proposal", "negotiation", "won", "lost"]).default("qualification"),
  closeDate: z.string().datetime().nullable().optional().or(z.string().nullable().optional()),
  leadId: z.number().nullable().optional(),
  customerId: z.number().nullable().optional(),
  companyId: z.number().nullable().optional(),
});

export const proposalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  value: z.number().nonnegative("Value must be non-negative").default(0),
  status: z.enum(["draft", "sent", "accepted", "rejected"]).default("draft"),
  validUntil: z.string().datetime().nullable().optional().or(z.string().nullable().optional()),
  leadId: z.number().nullable().optional(),
  customerId: z.number().nullable().optional(),
  companyId: z.number().nullable().optional(),
});
