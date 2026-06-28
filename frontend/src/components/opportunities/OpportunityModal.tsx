import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { createOpportunity, updateOpportunity } from "../../services/opportunityService";
import type { Opportunity, OpportunityInput } from "../../services/opportunityService";
import { getLeads } from "../../services/leadService";
import type { Lead } from "../../services/leadService";
import { getCustomers } from "../../services/customerService";
import type { Customer } from "../../services/customerService";
import { getCompanies } from "../../services/companyService";
import type { Company } from "../../services/companyService";

interface OpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  opportunity?: Opportunity | null;
}

export default function OpportunityModal({ isOpen, onClose, onSuccess, opportunity }: OpportunityModalProps) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);

  // Track field state to toggle visibility
  const [relationMode, setRelationMode] = useState<"lead" | "customer">("lead");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<OpportunityInput>({
    defaultValues: {
      title: "",
      value: 0,
      stage: "qualification",
      closeDate: "",
      leadId: null,
      customerId: null,
      companyId: null,
    },
  });

  const selectedLeadId = watch("leadId");
  const selectedCustomerId = watch("customerId");

  // Automatically fetch company based on selected lead
  useEffect(() => {
    if (selectedLeadId && relationMode === "lead") {
      const lead = leads.find((l) => l.id === Number(selectedLeadId));
      if (lead && lead.companyId) {
        setValue("companyId", lead.companyId);
      }
    }
  }, [selectedLeadId, leads, relationMode, setValue]);

  // Automatically fetch company based on selected customer
  useEffect(() => {
    if (selectedCustomerId && relationMode === "customer") {
      const customer = customers.find((c) => c.id === Number(selectedCustomerId));
      if (customer && customer.companyId) {
        setValue("companyId", customer.companyId);
      }
    }
  }, [selectedCustomerId, customers, relationMode, setValue]);

  useEffect(() => {
    async function loadRelations() {
      try {
        const [leadsData, customersData, companiesData] = await Promise.all([
          getLeads(),
          getCustomers(),
          getCompanies(),
        ]);
        setLeads(leadsData.data);
        setCustomers(customersData.data);
        setCompanies(companiesData);
      } catch {
        console.error("Failed to load options");
      }
    }

    if (isOpen) {
      loadRelations();
      if (opportunity) {
        setRelationMode(opportunity.customerId ? "customer" : "lead");
        reset({
          title: opportunity.title,
          value: opportunity.value,
          stage: opportunity.stage,
          closeDate: opportunity.closeDate ? new Date(opportunity.closeDate).toISOString().slice(0, 16) : "",
          leadId: opportunity.leadId || null,
          customerId: opportunity.customerId || null,
          companyId: opportunity.companyId || null,
        });
      } else {
        setRelationMode("lead");
        reset({
          title: "",
          value: 0,
          stage: "qualification",
          closeDate: "",
          leadId: null,
          customerId: null,
          companyId: null,
        });
      }
    }
  }, [opportunity, reset, isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (data: OpportunityInput) => {
    setError("");
    setIsLoading(true);

    try {
      const payload = {
        ...data,
        value: Number(data.value),
        leadId: relationMode === "lead" && data.leadId ? Number(data.leadId) : null,
        customerId: relationMode === "customer" && data.customerId ? Number(data.customerId) : null,
        companyId: data.companyId ? Number(data.companyId) : null,
        closeDate: data.closeDate ? new Date(data.closeDate).toISOString() : null,
      };

      if (opportunity) {
        await updateOpportunity(opportunity.id, payload);
      } else {
        await createOpportunity(payload);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-md transform rounded-2xl border border-white/8 bg-[#18181B] p-6 shadow-2xl z-10">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h3 className="text-lg font-semibold text-white">
            {opportunity ? "Edit Opportunity" : "Add Opportunity"}
          </h3>
          <button type="button" className="rounded-lg p-1 text-zinc-400 hover:text-white" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && <div className="mt-4 rounded-xl bg-rose-500/10 border border-rose-500/15 p-3 text-xs text-rose-400">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <Input
            label="Deal / Opportunity Title *"
            placeholder="Acme Enterprise Subscription"
            error={errors.title?.message}
            {...register("title", { required: "Title is required" })}
          />

          <Input
            label="Value ($) *"
            type="number"
            placeholder="5000"
            error={errors.value?.message}
            {...register("value", { required: "Value is required" })}
          />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="opp-stage" className="text-xs font-medium text-zinc-400">Pipeline Stage</label>
            <select
              id="opp-stage"
              className="w-full px-4 py-2.5 text-sm bg-white/3 border border-white/10 focus:border-[#6366F1] rounded-xl text-white outline-none"
              {...register("stage")}
            >
              <option value="qualification" className="bg-[#18181B]">Qualification</option>
              <option value="proposal" className="bg-[#18181B]">Proposal</option>
              <option value="negotiation" className="bg-[#18181B]">Negotiation</option>
              <option value="won" className="bg-[#18181B]">Won (Convert to Customer)</option>
              <option value="lost" className="bg-[#18181B]">Lost</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="opp-closedate" className="text-xs font-medium text-zinc-400">Target Close Date</label>
            <input
              id="opp-closedate"
              type="datetime-local"
              className="w-full px-4 py-2.5 text-sm bg-white/3 border border-white/10 focus:border-[#6366F1] rounded-xl text-white outline-none"
              {...register("closeDate")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-400">Relation Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                <input
                  type="radio"
                  checked={relationMode === "lead"}
                  onChange={() => {
                    setRelationMode("lead");
                    setValue("customerId", null);
                  }}
                  className="h-4 w-4 text-[#6366F1] focus:ring-[#6366F1] border-white/10 bg-white/3"
                />
                Lead
              </label>
              <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                <input
                  type="radio"
                  checked={relationMode === "customer"}
                  onChange={() => {
                    setRelationMode("customer");
                    setValue("leadId", null);
                  }}
                  className="h-4 w-4 text-[#6366F1] focus:ring-[#6366F1] border-white/10 bg-white/3"
                />
                Customer
              </label>
            </div>
          </div>

          {relationMode === "lead" ? (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="opp-lead" className="text-xs font-medium text-zinc-400">Associated Lead</label>
              <select
                id="opp-lead"
                className="w-full px-4 py-2.5 text-sm bg-white/3 border border-white/10 focus:border-[#6366F1] rounded-xl text-white outline-none"
                {...register("leadId")}
              >
                <option value="" className="bg-[#18181B]">-- None --</option>
                {leads.map((l) => (
                  <option key={l.id} value={l.id} className="bg-[#18181B]">{l.name}</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="opp-customer" className="text-xs font-medium text-zinc-400">Associated Customer</label>
              <select
                id="opp-customer"
                className="w-full px-4 py-2.5 text-sm bg-white/3 border border-white/10 focus:border-[#6366F1] rounded-xl text-white outline-none"
                {...register("customerId")}
              >
                <option value="" className="bg-[#18181B]">-- None --</option>
                {customers.map((cust) => (
                  <option key={cust.id} value={cust.id} className="bg-[#18181B]">{cust.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="opp-company" className="text-xs font-medium text-zinc-400">Associated Company</label>
            <select
              id="opp-company"
              className="w-full px-4 py-2.5 text-sm bg-white/3 border border-white/10 focus:border-[#6366F1] rounded-xl text-white outline-none"
              {...register("companyId")}
            >
              <option value="" className="bg-[#18181B]">-- None --</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#18181B]">{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 border-t border-white/5 pt-4 mt-6">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              {opportunity ? "Save Changes" : "Create Opportunity"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
