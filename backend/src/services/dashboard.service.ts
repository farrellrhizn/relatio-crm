import { prisma } from "../config/prisma";

export const getDashboardMetrics = async (userId: number) => {
  const totalLeads = await prisma.lead.count({
    where: { userId },
  });

  const totalCustomers = await prisma.customer.count({
    where: { userId },
  });

  const totalOpportunities = await prisma.opportunity.count({
    where: { userId },
  });

  const activeOppSum = await prisma.opportunity.aggregate({
    where: { userId, stage: { notIn: ["won", "lost"] } },
    _sum: { value: true },
  });

  const totalRevenueSum = await prisma.opportunity.aggregate({
    where: { userId, stage: "won" },
    _sum: { value: true },
  });

  const pipelineValue = activeOppSum._sum.value || 0;
  const totalRevenue = totalRevenueSum._sum.value || 0;

  // Simple conversion rate calculation
  let conversionRate = 0;
  if (totalLeads > 0) {
    conversionRate = (totalCustomers / totalLeads) * 100;
  } else if (totalCustomers > 0) {
    conversionRate = 100; // If there are customers but no leads (all leads became customers or were deleted)
  }

  const recentActivities = await prisma.activity.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      lead: {
        select: { name: true },
      },
      customer: {
        select: { name: true },
      },
    },
  });

  return {
    totalLeads,
    totalCustomers,
    totalOpportunities,
    pipelineValue,
    totalRevenue,
    conversionRate: conversionRate.toFixed(2), // returns string with 2 decimal points
    recentActivities,
  };
};

export const searchGlobalMetrics = async (userId: number, query: string) => {
  if (!query) return [];

  const [leads, customers, companies, opportunities, proposals] = await Promise.all([
    prisma.lead.findMany({
      where: { userId, name: { contains: query, mode: "insensitive" } },
      take: 3,
      select: { id: true, name: true, company: true },
    }),
    prisma.customer.findMany({
      where: { userId, name: { contains: query, mode: "insensitive" } },
      take: 3,
      select: { id: true, name: true, company: true },
    }),
    prisma.company.findMany({
      where: { userId, name: { contains: query, mode: "insensitive" } },
      take: 3,
      select: { id: true, name: true, domain: true },
    }),
    prisma.opportunity.findMany({
      where: { userId, title: { contains: query, mode: "insensitive" } },
      take: 3,
      select: { id: true, title: true, stage: true },
    }),
    prisma.proposal.findMany({
      where: { userId, title: { contains: query, mode: "insensitive" } },
      take: 3,
      select: { id: true, title: true, status: true },
    }),
  ]);

  const results: any[] = [];
  leads.forEach((l) => results.push({ id: l.id, type: "lead", title: l.name, subtitle: l.company }));
  customers.forEach((c) => results.push({ id: c.id, type: "customer", title: c.name, subtitle: c.company }));
  companies.forEach((co) => results.push({ id: co.id, type: "company", title: co.name, subtitle: co.domain }));
  opportunities.forEach((o) => results.push({ id: o.id, type: "opportunity", title: o.title, subtitle: o.stage }));
  proposals.forEach((p) => results.push({ id: p.id, type: "proposal", title: p.title, subtitle: p.status }));

  return results;
};

export const getNotificationsMetrics = async (userId: number) => {
  // Generate helpful dummy tasks or opportunities closing soon as notifications in a robust way
  const upcomingTasks = await prisma.task.findMany({
    where: { userId, status: { not: "completed" } },
    orderBy: { dueDate: "asc" },
    take: 5,
  });

  const soonClosingOpps = await prisma.opportunity.findMany({
    where: { userId, stage: { notIn: ["won", "lost"] } },
    orderBy: { closeDate: "asc" },
    take: 5,
  });

  const notifications: any[] = [];

  upcomingTasks.forEach((t) => {
    notifications.push({
      id: t.id,
      title: `Task Due Soon: ${t.title}`,
      description: t.description || `This task is flagged as ${t.priority} priority.`,
      read: false,
      createdAt: t.createdAt.toISOString(),
    });
  });

  soonClosingOpps.forEach((o) => {
    notifications.push({
      id: o.id + 1000, // avoid id collision
      title: `Opportunity Close Target: ${o.title}`,
      description: `Target closing date soon at stage: ${o.stage}. Value: $${o.value.toLocaleString()}`,
      read: false,
      createdAt: o.createdAt.toISOString(),
    });
  });

  return notifications;
};

export const readNotificationsMetrics = async (userId: number) => {
  // Soft operation, since system notifications are dynamically computed from tasks & opportunities.
  return { success: true };
};
