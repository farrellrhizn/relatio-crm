import { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2, FileText } from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { getProposals, deleteProposal } from "../../services/proposalService";
import type { Proposal } from "../../services/proposalService";
import ProposalModal from "../../components/proposals/ProposalModal";

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [filteredProposals, setFilteredProposals] = useState<Proposal[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  const fetchProposals = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getProposals();
      setProposals(data);
      setFilteredProposals(data);
    } catch {
      setError("Failed to fetch proposals.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const results = proposals.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        (p.company && p.company.name.toLowerCase().includes(term))
    );
    setFilteredProposals(results);
  }, [searchTerm, proposals]);

  const handleOpenAddModal = () => {
    setSelectedProposal(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this proposal?")) {
      try {
        await deleteProposal(id);
        fetchProposals();
      } catch {
        alert("Failed to delete proposal.");
      }
    }
  };

  const getStatusBadgeVariant = (status: Proposal["status"]) => {
    switch (status) {
      case "accepted":
        return "won";
      case "rejected":
        return "lost";
      case "sent":
        return "proposal";
      default:
        return "new";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Proposals</h1>
          <p className="text-sm text-zinc-400">Manage your business proposals and quotes sent to prospects.</p>
        </div>
        <Button variant="primary" className="text-white!" leftIcon={<Plus className="h-4 w-4" />} onClick={handleOpenAddModal}>
          Add Proposal
        </Button>
      </div>

      <Card className="p-4">
        <div className="relative flex items-center w-full max-w-md bg-white/3 border border-white/8 rounded-xl px-3 py-2 focus-within:border-[#6366F1] transition-all">
          <Search className="h-4 w-4 text-zinc-500 mr-2.5" />
          <input
            type="text"
            placeholder="Search proposals by title or company..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#6366F1] border-t-transparent" />
        </div>
      ) : error ? (
        <Card className="flex flex-col items-center justify-center p-8 text-center border-rose-500/20 bg-rose-500/3">
          <p className="text-sm text-rose-400 font-medium">{error}</p>
          <Button variant="secondary" className="mt-4" onClick={fetchProposals}>Retry</Button>
        </Card>
      ) : filteredProposals.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-zinc-400 mb-4">
            <FileText className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-white">No proposals found</h3>
          <p className="mt-1 text-sm text-zinc-400 max-w-xs">
            {searchTerm ? `No results match "${searchTerm}".` : "Draft and track proposals sent to leads and customers."}
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/1 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Associated Entity</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Value</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Valid Until</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-zinc-300">
                {filteredProposals.map((proposal) => (
                  <tr key={proposal.id} className="group hover:bg-white/1 transition-all duration-150">
                    <td className="px-6 py-4 font-semibold text-white">{proposal.title}</td>
                    <td className="px-6 py-4 text-zinc-400">
                      {proposal.lead && <span className="text-[#6366F1]">Lead: {proposal.lead.name}</span>}
                      {proposal.customer && <span className="text-emerald-400">Customer: {proposal.customer.name}</span>}
                      {!proposal.lead && !proposal.customer && "—"}
                    </td>
                    <td className="px-6 py-4 text-zinc-400">{proposal.company?.name || "—"}</td>
                    <td className="px-6 py-4 text-white font-semibold">${proposal.value.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusBadgeVariant(proposal.status)}>{proposal.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-zinc-400">
                      {proposal.validUntil ? new Date(proposal.validUntil).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/5 hover:text-white"
                          onClick={() => handleOpenEditModal(proposal)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="rounded-lg p-1.5 text-zinc-400 hover:bg-rose-500/10 hover:text-rose-400"
                          onClick={() => handleDelete(proposal.id)}
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
      )}

      <ProposalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchProposals}
        proposal={selectedProposal}
      />
    </div>
  );
}
