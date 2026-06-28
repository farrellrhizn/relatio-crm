import { useEffect, useState } from "react";
import { Users, UserCheck, Phone, Calendar, FileText, CheckCircle, Activity, ArrowUpRight, DollarSign, Briefcase } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Card from "../../components/ui/Card";
import { getDashboardData } from "../../services/dashboardService";
import type { DashboardData } from "../../services/dashboardService";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const result = await getDashboardData();
        setData(result);
      } catch {
        setError("Failed to fetch dashboard metrics.");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#6366F1] border-t-transparent" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 text-center border-rose-500/20 bg-rose-500/3">
        <p className="text-sm text-rose-400 font-medium">{error || "No data available."}</p>
      </Card>
    );
  }

  const { totalLeads, totalCustomers, totalOpportunities, pipelineValue, totalRevenue, conversionRate, recentActivities } = data;

  // Mock trend data based on actual database metrics for visual area chart
  const trendData = [
    { name: "Mon", Leads: Math.round(totalLeads * 0.4), Customers: Math.round(totalCustomers * 0.3) },
    { name: "Tue", Leads: Math.round(totalLeads * 0.5), Customers: Math.round(totalCustomers * 0.4) },
    { name: "Wed", Leads: Math.round(totalLeads * 0.75), Customers: Math.round(totalCustomers * 0.6) },
    { name: "Thu", Leads: Math.round(totalLeads * 0.8), Customers: Math.round(totalCustomers * 0.7) },
    { name: "Fri", Leads: Math.round(totalLeads * 0.9), Customers: Math.round(totalCustomers * 0.85) },
    { name: "Sat", Leads: Math.round(totalLeads * 0.95), Customers: Math.round(totalCustomers * 0.9) },
    { name: "Sun", Leads: totalLeads, Customers: totalCustomers },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "call":
        return <Phone className="h-4 w-4 text-blue-400" />;
      case "meeting":
        return <Calendar className="h-4 w-4 text-purple-400" />;
      case "note":
        return <FileText className="h-4 w-4 text-amber-400" />;
      case "follow-up":
        return <CheckCircle className="h-4 w-4 text-emerald-400" />;
      default:
        return <Activity className="h-4 w-4 text-zinc-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">Dashboard</h1>
        <p className="text-sm text-zinc-400">Welcome to your Relatio CRM business overview.</p>
      </div>

      {/* Row 1: KPI Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Leads Card */}
        <Card className="p-5 flex items-center justify-between hoverable">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Total Leads</p>
            <h3 className="text-3xl font-semibold text-white">{totalLeads}</h3>
            <p className="text-xs text-zinc-400 flex items-center gap-1 mt-1">
              <span className="text-emerald-400 font-medium inline-flex items-center gap-0.5">
                <ArrowUpRight className="h-3 w-3" />
                12.5%
              </span>
              from last week
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-[#6366F1]">
            <Users className="h-5 w-5" />
          </div>
        </Card>

        {/* Total Customers Card */}
        <Card className="p-5 flex items-center justify-between hoverable">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Active Customers</p>
            <h3 className="text-3xl font-semibold text-white">{totalCustomers}</h3>
            <p className="text-xs text-zinc-400 flex items-center gap-1 mt-1">
              <span className="text-emerald-400 font-medium inline-flex items-center gap-0.5">
                <ArrowUpRight className="h-3 w-3" />
                8.2%
              </span>
              from last week
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
            <UserCheck className="h-5 w-5" />
          </div>
        </Card>

        {/* Pipeline Value Card */}
        <Card className="p-5 flex items-center justify-between hoverable">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Pipeline Value</p>
            <h3 className="text-3xl font-semibold text-white">${pipelineValue.toLocaleString()}</h3>
            <p className="text-xs text-zinc-500 mt-1">
              Active deals: {totalOpportunities}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
            <Briefcase className="h-5 w-5" />
          </div>
        </Card>

        {/* Total Revenue Card */}
        <Card className="p-5 flex items-center justify-between hoverable">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Won Revenue</p>
            <h3 className="text-3xl font-semibold text-white">${totalRevenue.toLocaleString()}</h3>
            <p className="text-xs text-zinc-400 flex items-center gap-1 mt-1">
              Conversion: <span className="text-emerald-400 font-semibold">{conversionRate}%</span>
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
            <DollarSign className="h-5 w-5" />
          </div>
        </Card>
      </div>

      {/* Row 2: Bento Bento Grid (Chart & Recent Activities) */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Analytics Chart (Takes 2 columns on large screens) */}
        <Card className="p-5 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-white">Pipeline Activity</h3>
              <p className="text-xs text-zinc-400">Monthly leads and customers growth analytics</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <span className="h-2 w-2 rounded-full bg-[#6366F1]" />
                Leads
              </span>
              <span className="flex items-center gap-1.5 text-zinc-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Customers
              </span>
            </div>
          </div>
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34D399" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#34D399" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#18181B", borderColor: "rgba(255,255,255,0.08)", borderRadius: "12px" }}
                  labelStyle={{ color: "#A1A1AA", fontSize: "11px", fontWeight: 600 }}
                  itemStyle={{ fontSize: "12px", padding: "2px 0" }}
                />
                <Area type="monotone" dataKey="Leads" stroke="#6366F1" strokeWidth={2} fillOpacity={1} fill="url(#colorLeads)" />
                <Area type="monotone" dataKey="Customers" stroke="#34D399" strokeWidth={2} fillOpacity={1} fill="url(#colorCustomers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Activities Panel */}
        <Card className="p-5 space-y-4">
          <div>
            <h3 className="text-base font-semibold text-white">Recent Activities</h3>
            <p className="text-xs text-zinc-400">Latest updates on your customers & leads</p>
          </div>

          <div className="flow-root">
            {recentActivities.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center py-6">
                <Activity className="h-8 w-8 text-zinc-600 mb-2" />
                <p className="text-xs text-zinc-500">No recent activities logged.</p>
              </div>
            ) : (
              <ul className="-mb-8">
                {recentActivities.map((activity, idx) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {idx !== recentActivities.length - 1 && (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-white/5" aria-hidden="true" />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 border border-white/5">
                            {getActivityIcon(activity.type)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 pt-1.5">
                          <p className="text-xs font-semibold text-(--text-primary)">
                            {activity.content}
                          </p>
                          <p className="text-[10px] text-zinc-500 mt-0.5 flex items-center gap-1.5">
                            {activity.lead && (
                              <span className="text-[#6366F1] font-medium">Lead: {activity.lead.name}</span>
                            )}
                            {activity.customer && (
                              <span className="text-emerald-400 font-medium">Customer: {activity.customer.name}</span>
                            )}
                            <span>•</span>
                            <span>
                              {new Date(activity.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
