import { useEffect, useState } from "react";
import { Plus, DollarSign, ArrowRight, Edit2, Trash2 } from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { getOpportunities, deleteOpportunity, updateOpportunity } from "../../services/opportunityService";
import type { Opportunity } from "../../services/opportunityService";
import OpportunityModal from "../../components/opportunities/OpportunityModal";

const STAGES: Opportunity["stage"][] = ["qualification", "proposal", "negotiation", "won", "lost"];

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

  const fetchOpportunities = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getOpportunities();
      setOpportunities(data);
    } catch {
      setError("Failed to fetch opportunities.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const handleOpenAddModal = () => {
    setSelectedOpportunity(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (opp: Opportunity) => {
    setSelectedOpportunity(opp);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this opportunity?")) {
      try {
        await deleteOpportunity(id);
        fetchOpportunities();
      } catch {
        alert("Failed to delete opportunity.");
      }
    }
  };

  const handleMoveStage = async (opp: Opportunity, nextStage: Opportunity["stage"]) => {
    try {
      await updateOpportunity(opp.id, { stage: nextStage });
      fetchOpportunities();
    } catch {
      alert("Failed to update stage.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Opportunities & Sales Pipeline</h1>
          <p className="text-sm text-zinc-400">Track pipeline stages, values, and close dates for deals.</p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={handleOpenAddModal}>
          Add Opportunity
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#6366F1] border-t-transparent" />
        </div>
      ) : error ? (
        <Card className="flex flex-col items-center justify-center p-8 text-center border-rose-500/20 bg-rose-500/3">
          <p className="text-sm text-rose-400 font-medium">{error}</p>
          <Button variant="secondary" className="mt-4" onClick={fetchOpportunities}>Retry</Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-5 overflow-x-auto min-w-[1000px] pb-4">
          {STAGES.map((stage) => {
            const stageOpps = opportunities.filter((o) => o.stage === stage);
            const stageTotalValue = stageOpps.reduce((sum, o) => sum + o.value, 0);

            return (
              <div key={stage} className="flex flex-col gap-4 bg-white/2 border border-white/5 rounded-2xl p-4 min-h-[500px]">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold capitalize text-white">
                    {stage.replace("_", " ")}
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/5 text-zinc-400">
                    {stageOpps.length}
                  </span>
                </div>
                <div className="text-xs font-semibold text-zinc-500">
                  Total: ${stageTotalValue.toLocaleString()}
                </div>

                <div className="flex-1 space-y-3">
                  {stageOpps.map((opp) => (
                    <Card key={opp.id} className="p-3.5 space-y-3 hoverable bg-white/3 border border-white/8">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-white truncate">{opp.title}</h4>
                          <div className="flex gap-1">
                            <button type="button" className="p-0.5 text-zinc-400 hover:text-white" onClick={() => handleOpenEditModal(opp)}>
                              <Edit2 className="h-3 w-3" />
                            </button>
                            <button type="button" className="p-0.5 text-zinc-400 hover:text-rose-400" onClick={() => handleDelete(opp.id)}>
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        {opp.company && <p className="text-xs text-zinc-500 mt-0.5 truncate">{opp.company.name}</p>}
                        {opp.lead && <p className="text-xs text-[#6366F1] mt-0.5 truncate">Lead: {opp.lead.name}</p>}
                        {opp.customer && <p className="text-xs text-emerald-400 mt-0.5 truncate">Cust: {opp.customer.name}</p>}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-white flex items-center">
                          <DollarSign className="h-3.5 w-3.5 text-zinc-500" />
                          {opp.value.toLocaleString()}
                        </div>
                        
                        {stage !== "won" && stage !== "lost" && (
                          <button
                            type="button"
                            className="p-1 rounded bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
                            onClick={() => {
                              const nextIdx = STAGES.indexOf(stage) + 1;
                              if (nextIdx < STAGES.length) handleMoveStage(opp, STAGES[nextIdx]);
                            }}
                            title="Move to next stage"
                          >
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <OpportunityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchOpportunities}
        opportunity={selectedOpportunity}
      />
    </div>
  );
}
