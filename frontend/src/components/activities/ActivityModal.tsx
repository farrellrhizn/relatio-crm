import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import Button from "../ui/Button";
import { createActivity } from "../../services/activityService";
import type { ActivityInput } from "../../services/activityService";
import { getLeads } from "../../services/leadService";
import type { Lead } from "../../services/leadService";
import { getCustomers } from "../../services/customerService";
import type { Customer } from "../../services/customerService";

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormFields extends ActivityInput {
  relationType: "none" | "lead" | "customer";
}

export default function ActivityModal({ isOpen, onClose, onSuccess }: ActivityModalProps) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormFields>({
    defaultValues: {
      type: "note",
      content: "",
      relationType: "none",
      leadId: null,
      customerId: null,
    },
  });

  const relationType = watch("relationType");

  useEffect(() => {
    async function loadRelations() {
      try {
        const [leadsData, customersData] = await Promise.all([getLeads(), getCustomers()]);
        setLeads(leadsData);
        setCustomers(customersData);
      } catch {
        console.error("Failed to load relation options");
      }
    }

    if (isOpen) {
      loadRelations();
      reset({
        type: "note",
        content: "",
        relationType: "none",
        leadId: null,
        customerId: null,
      });
      setError("");
    }
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: FormFields) => {
    setError("");
    setIsLoading(true);

    try {
      const payload: ActivityInput = {
        type: data.type,
        content: data.content,
      };

      if (data.relationType === "lead" && data.leadId) {
        payload.leadId = Number(data.leadId);
      } else if (data.relationType === "customer" && data.customerId) {
        payload.customerId = Number(data.customerId);
      }

      await createActivity(payload);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to log activity.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-md transform rounded-2xl border border-white/8 bg-[#18181B] p-6 shadow-2xl z-10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h3 className="text-lg font-semibold text-white">Log New Activity</h3>
          <button
            type="button"
            className="rounded-lg p-1 text-zinc-400 hover:bg-white/5 hover:text-white"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mt-4 rounded-xl bg-rose-500/10 border border-rose-500/15 p-3 text-xs text-rose-400">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          {/* Activity Type */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="activity-type" className="text-xs font-medium text-zinc-400">
              Activity Type
            </label>
            <select
              id="activity-type"
              className="w-full px-4 py-2.5 text-sm bg-white/3 border border-white/10 focus:border-[#6366F1] rounded-xl text-white outline-none"
              {...register("type")}
            >
              <option value="note" className="bg-[#18181B]">Note</option>
              <option value="call" className="bg-[#18181B]">Call</option>
              <option value="meeting" className="bg-[#18181B]">Meeting</option>
              <option value="follow-up" className="bg-[#18181B]">Follow-up</option>
            </select>
          </div>

          {/* Relation Selector */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="relation-type" className="text-xs font-medium text-zinc-400">
              Associate With
            </label>
            <select
              id="relation-type"
              className="w-full px-4 py-2.5 text-sm bg-white/3 border border-white/10 focus:border-[#6366F1] rounded-xl text-white outline-none"
              {...register("relationType")}
            >
              <option value="none" className="bg-[#18181B]">None</option>
              <option value="lead" className="bg-[#18181B]">Lead (Prospect)</option>
              <option value="customer" className="bg-[#18181B]">Customer</option>
            </select>
          </div>

          {/* Lead Select options */}
          {relationType === "lead" && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="lead-relation" className="text-xs font-medium text-zinc-400">
                Select Lead *
              </label>
              <select
                id="lead-relation"
                className="w-full px-4 py-2.5 text-sm bg-white/3 border border-white/10 focus:border-[#6366F1] rounded-xl text-white outline-none"
                {...register("leadId", { required: "Please select a lead" })}
              >
                <option value="" className="bg-[#18181B]">-- Select a Lead --</option>
                {leads.map((lead) => (
                  <option key={lead.id} value={lead.id} className="bg-[#18181B]">
                    {lead.name} {lead.company ? `(${lead.company})` : ""}
                  </option>
                ))}
              </select>
              {errors.leadId && <p className="text-xs text-rose-400">{errors.leadId.message}</p>}
            </div>
          )}

          {/* Customer Select options */}
          {relationType === "customer" && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="customer-relation" className="text-xs font-medium text-zinc-400">
                Select Customer *
              </label>
              <select
                id="customer-relation"
                className="w-full px-4 py-2.5 text-sm bg-white/3 border border-white/10 focus:border-[#6366F1] rounded-xl text-white outline-none"
                {...register("customerId", { required: "Please select a customer" })}
              >
                <option value="" className="bg-[#18181B]">-- Select a Customer --</option>
                {customers.map((cust) => (
                  <option key={cust.id} value={cust.id} className="bg-[#18181B]">
                    {cust.name} {cust.company ? `(${cust.company})` : ""}
                  </option>
                ))}
              </select>
              {errors.customerId && <p className="text-xs text-rose-400">{errors.customerId.message}</p>}
            </div>
          )}

          {/* Log Details Content */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="activity-content" className="text-xs font-medium text-zinc-400">
              Details *
            </label>
            <textarea
              id="activity-content"
              rows={4}
              placeholder="Spoke with client regarding negotiations, agreement looks positive..."
              className="w-full px-4 py-2.5 text-sm bg-white/3 border border-white/10 focus:border-[#6366F1] rounded-xl text-white outline-none placeholder-zinc-500"
              {...register("content", { required: "Details are required" })}
            />
            {errors.content && <p className="text-xs text-rose-400">{errors.content.message}</p>}
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 border-t border-white/5 pt-4 mt-6">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              Log Activity
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
