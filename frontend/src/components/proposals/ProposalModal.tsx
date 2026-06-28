import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { createProposal, updateProposal } from "../../services/proposalService";
import type { Proposal, ProposalInput } from "../../services/proposalService";
import { getLeads } from "../../services/leadService";
import type { Lead } from "../../services/leadService";
import { getCustomers } from "../../services/customerService";
import type { Customer } from "../../services/customerService";
import { getCompanies } from "../../services/companyService";
import type { Company } from "../../services/companyService";

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  proposal?: Proposal | null;
}

export default function ProposalModal({ isOpen, onClose, onSuccess, proposal }: ProposalModalProps) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  
  const [relationMode, setRelationMode] = useState<"lead" | "customer">("lead");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProposalInput>({
    defaultValues: {
      title: "",
      value: 0,
      status: "draft",
      validUntil: "",
      leadId: null,
      customerId: null,
      companyId: null,
    },
  });

  const selectedLeadId = watch("leadId");
  const selectedCustomerId = watch("customerId");

  // Sync company from Lead
  useEffect(() => {
    if (selectedLeadId && relationMode === "lead") {
      const lead = leads.find((l) => l.id === Number(selectedLeadId));
      if (lead && lead.companyId) {
        setValue("companyId", lead.companyId);
      }
    }
  }, [selectedLeadId, leads, relationMode, setValue]);

  // Sync company from Customer
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
      if (proposal) {
        setRelationMode(proposal.customerId ? "customer" : "lead");
        reset({
          title: proposal.title,
          value: proposal.value,
          status: proposal.status,
          validUntil: proposal.validUntil ? new Date(proposal.validUntil).toISOString().slice(0, 16) : "",
          leadId: proposal.leadId || null,
          customerId: proposal.customerId || null,
          companyId: proposal.companyId || null,
        });
      } else {
        setRelationMode("lead");
        reset({
          title: "",
          value: 0,
          status: "draft",
          validUntil: "",
          leadId: null,
          customerId: null,
          companyId: null,
        });
      }
    }
  }, [proposal, reset, isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (data: ProposalInput) => {
    setError("");
    setIsLoading(true);

    try {
      const payload = {
        ...data,
        value: Number(data.value),
        leadId: relationMode === "lead" && data.leadId ? Number(data.leadId) : null,
        customerId: relationMode === "customer" && data.customerId ? Number(data.customerId) : null,
        companyId: data.companyId ? Number(data.companyId) : null,
        validUntil: data.validUntil ? new Date(data.validUntil).toISOString() : null,
      };

      if (proposal) {
        await updateProposal(proposal.id, payload);
      } else {
        await createProposal(payload);
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
            {proposal ? "Edit Proposal" : "Add Proposal"}
          </h3>
          <button type="button" className="rounded-lg p-1 text-zinc-400 hover:text-white" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && <div className="mt-4 rounded-xl bg-rose-500/10 border border-rose-500/15 p-3 text-xs text-rose-400">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <Input
            label="Proposal Title *"
            placeholder="Acme Enterprise Proposal"
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
            <label htmlFor="prop-status" className="text-xs font-medium text-zinc-400">Status</label>
            <select
              id="prop-status"
              className="w-full px-4 py-2.5 text-sm bg-white/3 border border-white/10 focus:border-[#6366F1] rounded-xl text-white outline-none"
              {...register("status")}
            >
              <option value="draft" className="bg-[#18181B]">Draft</option>
              <option value="sent" className="bg-[#18181B]">Sent</option>
              <option value="accepted" className="bg-[#18181B]">Accepted</option>
              <option value="rejected" className="bg-[#18181B]">Rejected</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="prop-validuntil" className="text-xs font-medium text-zinc-400">Valid Until</label>
            <input
              id="prop-validuntil"
              type="datetime-local"
              className="w-full px-4 py-2.5 text-sm bg-white/3 border border-white/10 focus:border-[#6366F1] rounded-xl text-white outline-none"
              {...register("validUntil")}
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
              <label htmlFor="prop-lead" className="text-xs font-medium text-zinc-400">Associated Lead</label>
              <select
                id="prop-lead"
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
              <label htmlFor="prop-customer" className="text-xs font-medium text-zinc-400">Associated Customer</label>
              <select
                id="prop-customer"
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
            <label htmlFor="prop-company" className="text-xs font-medium text-zinc-400">Associated Company</label>
            <select
              id="prop-company"
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
              {proposal ? "Save Changes" : "Create Proposal"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
