import { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2, Users } from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import LeadModal from "../../components/leads/LeadModal";
import { getLeads, deleteLead } from "../../services/leadService";
import type { Lead } from "../../services/leadService";

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const fetchLeads = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await getLeads({
        page,
        limit: 10,
        search: searchTerm || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });
      setLeads(response.data);
      setTotalPages(response.totalPages);
    } catch {
      setError("Failed to fetch leads. Please check your backend connection.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [page, statusFilter]);

  // Handle server-side search with a slight delay
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(1);
      fetchLeads();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleOpenAddModal = () => {
    setSelectedLead(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (lead: Lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      try {
        await deleteLead(id);
        fetchLeads();
      } catch {
        alert("Failed to delete lead. Please try again.");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Leads</h1>
          <p className="text-sm text-zinc-400">
            Manage your sales opportunities and convert prospects to customers.
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={handleOpenAddModal}
        >
          Add Lead
        </Button>
      </div>

      {/* Filter and search card */}
      <Card className="p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex items-center w-full max-w-md bg-white/3 border border-white/8 rounded-xl px-3 py-2 focus-within:border-[#6366F1] transition-all">
          <Search className="h-4 w-4 text-zinc-500 mr-2.5" />
          <input
            type="text"
            placeholder="Search leads by name or company..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 text-sm bg-white/3 border border-white/8 focus:border-[#6366F1] rounded-xl text-white outline-none"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all" className="bg-[#18181B]">All Statuses</option>
          <option value="new" className="bg-[#18181B]">New</option>
          <option value="contacted" className="bg-[#18181B]">Contacted</option>
          <option value="qualified" className="bg-[#18181B]">Qualified</option>
          <option value="proposal" className="bg-[#18181B]">Proposal</option>
          <option value="negotiation" className="bg-[#18181B]">Negotiation</option>
          <option value="won" className="bg-[#18181B]">Won</option>
          <option value="lost" className="bg-[#18181B]">Lost</option>
        </select>
      </Card>

      {/* Leads listing */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#6366F1] border-t-transparent" />
        </div>
      ) : error ? (
        <Card className="flex flex-col items-center justify-center p-8 text-center border-rose-500/20 bg-rose-500/3">
          <p className="text-sm text-rose-400 font-medium">{error}</p>
          <Button variant="secondary" className="mt-4" onClick={fetchLeads}>
            Retry
          </Button>
        </Card>
      ) : leads.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-zinc-400 mb-4">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-white">No leads found</h3>
          <p className="mt-1 text-sm text-zinc-400 max-w-xs">
            {searchTerm
              ? `No results match your search term "${searchTerm}".`
              : "Start by adding your first sales lead to track opportunities."}
          </p>
          {!searchTerm && (
            <Button variant="secondary" className="mt-5" onClick={handleOpenAddModal}>
              Add Lead
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/5 bg-white/1 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Company</th>
                    <th className="px-6 py-4">Contact Info</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Created Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm text-zinc-300">
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="group hover:bg-white/1 transition-all duration-150"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{lead.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-zinc-400 font-medium">
                          {lead.companyRelation?.name || lead.company || "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4 space-y-0.5">
                        <div className="text-zinc-300">{lead.email || "—"}</div>
                        <div className="text-xs text-zinc-500">{lead.phone || ""}</div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={lead.status as any}>{lead.status}</Badge>
                      </td>
                      <td className="px-6 py-4 text-zinc-400">
                        {new Date(lead.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            title="Edit Lead"
                            type="button"
                            className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/5 hover:text-white"
                            onClick={() => handleOpenEditModal(lead)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            title="Delete Lead"
                            type="button"
                            className="rounded-lg p-1.5 text-zinc-400 hover:bg-rose-500/10 hover:text-rose-400"
                            onClick={() => handleDelete(lead.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-zinc-500">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal form */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchLeads}
        lead={selectedLead}
      />
    </div>
  );
}
