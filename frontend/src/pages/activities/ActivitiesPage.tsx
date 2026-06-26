import { useEffect, useState } from "react";
import { Plus, Search, Phone, Calendar, FileText, CheckCircle, Activity, Trash2, Filter } from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import ActivityModal from "../../components/activities/ActivityModal";
import { getActivities, deleteActivity } from "../../services/activityService";
import type { Activity as ActivityType } from "../../services/activityService";

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchActivities = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getActivities();
      setActivities(data);
      setFilteredActivities(data);
    } catch {
      setError("Failed to fetch activity logs.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Handle client-side search and filtering
  useEffect(() => {
    let result = activities;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (act) =>
          act.content.toLowerCase().includes(term) ||
          (act.lead && act.lead.name.toLowerCase().includes(term)) ||
          (act.customer && act.customer.name.toLowerCase().includes(term))
      );
    }

    if (typeFilter !== "all") {
      result = result.filter((act) => act.type === typeFilter);
    }

    setFilteredActivities(result);
  }, [searchTerm, typeFilter, activities]);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this activity log?")) {
      try {
        await deleteActivity(id);
        fetchActivities();
      } catch {
        alert("Failed to delete activity log. Please try again.");
      }
    }
  };

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

  const getActivityTitle = (type: string) => {
    switch (type) {
      case "call":
        return "Phone Call Logged";
      case "meeting":
        return "Meeting Scheduled/Held";
      case "note":
        return "Catatan / Note Created";
      case "follow-up":
        return "Follow-up Logged";
      default:
        return "Activity Logged";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Activities</h1>
          <p className="text-sm text-zinc-400">
            Track communication logs, meeting results, and notes with prospects and customers.
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setIsModalOpen(true)}
        >
          Log Activity
        </Button>
      </div>

      {/* Filter and search card */}
      <Card className="p-4 grid gap-4 sm:grid-cols-3">
        {/* Search */}
        <div className="relative flex items-center bg-white/3 border border-white/8 rounded-xl px-3 py-2 focus-within:border-[#6366F1] transition-all sm:col-span-2">
          <Search className="h-4 w-4 text-zinc-500 mr-2.5" />
          <input
            type="text"
            placeholder="Search activity logs or names..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Dropdown filter */}
        <div className="relative flex items-center bg-white/3 border border-white/8 rounded-xl px-3 py-2 focus-within:border-[#6366F1] transition-all">
          <Filter className="h-4 w-4 text-zinc-500 mr-2.5" />
          <select
            className="w-full bg-transparent text-sm text-white outline-none border-none cursor-pointer"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all" className="bg-[#18181B]">All Types</option>
            <option value="note" className="bg-[#18181B]">Notes</option>
            <option value="call" className="bg-[#18181B]">Calls</option>
            <option value="meeting" className="bg-[#18181B]">Meetings</option>
            <option value="follow-up" className="bg-[#18181B]">Follow-ups</option>
          </select>
        </div>
      </Card>

      {/* Activities Timeline */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#6366F1] border-t-transparent" />
        </div>
      ) : error ? (
        <Card className="flex flex-col items-center justify-center p-8 text-center border-rose-500/20 bg-rose-500/3">
          <p className="text-sm text-rose-400 font-medium">{error}</p>
          <Button variant="secondary" className="mt-4" onClick={fetchActivities}>
            Retry
          </Button>
        </Card>
      ) : filteredActivities.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-zinc-400 mb-4">
            <Activity className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-white">No activities logged</h3>
          <p className="mt-1 text-sm text-zinc-400 max-w-xs">
            {searchTerm || typeFilter !== "all"
              ? "No activities match your filters."
              : "Log calls, notes, or meetings to track relationships with contacts."}
          </p>
          {!searchTerm && typeFilter === "all" && (
            <Button variant="secondary" className="mt-5" onClick={() => setIsModalOpen(true)}>
              Log Activity
            </Button>
          )}
        </Card>
      ) : (
        <Card className="p-6">
          <div className="flow-root">
            <ul className="-mb-8">
              {filteredActivities.map((activity, idx) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {idx !== filteredActivities.length - 1 && (
                      <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-white/5" aria-hidden="true" />
                    )}
                    <div className="relative flex items-start space-x-3 group">
                      {/* Icon column */}
                      <div>
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/3 border border-white/8 transition-all group-hover:border-white/15">
                          {getActivityIcon(activity.type)}
                        </span>
                      </div>
                      
                      {/* Details Content */}
                      <div className="min-w-0 flex-1 py-1">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <span className="text-sm font-semibold text-white">
                              {getActivityTitle(activity.type)}
                            </span>
                            <span className="ml-2 text-xs text-zinc-500">
                              {new Date(activity.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          
                          {/* Trash button */}
                          <button
                            title="Delete Log"
                            type="button"
                            className="rounded-lg p-1.5 text-zinc-500 hover:bg-rose-500/10 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all duration-150"
                            onClick={() => handleDelete(activity.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Associated target indicator */}
                        {(activity.lead || activity.customer) && (
                          <div className="text-xs text-zinc-400 mt-1.5 inline-flex items-center gap-1.5 rounded-lg bg-white/3 border border-white/5 px-2 py-0.5">
                            {activity.lead && (
                              <>
                                <span className="font-semibold text-zinc-500">Lead:</span>
                                <span className="text-[#6366F1] font-medium">{activity.lead.name}</span>
                              </>
                            )}
                            {activity.customer && (
                              <>
                                <span className="font-semibold text-zinc-500">Customer:</span>
                                <span className="text-emerald-400 font-medium">{activity.customer.name}</span>
                              </>
                            )}
                          </div>
                        )}

                        <div className="mt-2 text-sm text-zinc-300 leading-relaxed max-w-2xl whitespace-pre-wrap">
                          {activity.content}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      )}

      {/* Log Activity Modal */}
      <ActivityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchActivities}
      />
    </div>
  );
}
