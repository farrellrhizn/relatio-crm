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
