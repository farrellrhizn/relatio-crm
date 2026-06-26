import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { createLead, updateLead } from "../../services/leadService";
import type { Lead, LeadInput } from "../../services/leadService";
import { createCustomer } from "../../services/customerService";

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  lead?: Lead | null;
}

export default function LeadModal({ isOpen, onClose, onSuccess, lead }: LeadModalProps) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadInput>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      status: "new",
    },
  });

  useEffect(() => {
    if (lead) {
      reset({
        name: lead.name,
        email: lead.email || "",
        phone: lead.phone || "",
        company: lead.company || "",
        status: lead.status || "new",
      });
    } else {
      reset({
        name: "",
        email: "",
        phone: "",
        company: "",
        status: "new",
      });
    }
  }, [lead, reset, isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (data: LeadInput) => {
    setError("");
    setIsLoading(true);

    try {
      if (lead) {
        // Edit Mode
        await updateLead(lead.id, data);
        
        // If status is changed to 'won', automatically convert to a Customer
        if (data.status === "won" && lead.status !== "won") {
          await createCustomer({
            name: data.name,
            email: data.email,
            phone: data.phone,
            company: data.company,
          });
        }
      } else {
        // Create Mode
        await createLead(data);
        
        // If created directly as 'won', convert to Customer
        if (data.status === "won") {
          await createCustomer({
            name: data.name,
            email: data.email,
            phone: data.phone,
            company: data.company,
          });
        }
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md transform rounded-2xl border border-white/8 bg-[#18181B] p-6 shadow-2xl transition-all z-10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h3 className="text-lg font-semibold text-white">
            {lead ? "Edit Lead" : "Add New Lead"}
          </h3>
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
          <Input
            label="Name *"
            placeholder="John Doe"
            error={errors.name?.message}
            {...register("name", { required: "Name is required" })}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="john@company.com"
            error={errors.email?.message}
            {...register("email", {
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />

          <Input
            label="Phone Number"
            placeholder="+1 (555) 000-0000"
            {...register("phone")}
          />

          <Input
            label="Company"
            placeholder="Acme Corporation"
            {...register("company")}
          />

          {/* Status Select */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="lead-status" className="text-xs font-medium text-zinc-400">
              Status
            </label>
            <select
              id="lead-status"
              className="w-full px-4 py-2.5 text-sm bg-white/3 border border-white/10 focus:border-[#6366F1] rounded-xl text-white outline-none transition-all duration-200"
              {...register("status")}
            >
              <option value="new" className="bg-[#18181B]">New</option>
              <option value="contacted" className="bg-[#18181B]">Contacted</option>
              <option value="qualified" className="bg-[#18181B]">Qualified</option>
              <option value="proposal" className="bg-[#18181B]">Proposal</option>
              <option value="negotiation" className="bg-[#18181B]">Negotiation</option>
              <option value="won" className="bg-[#18181B]">Won (Convert to Customer)</option>
              <option value="lost" className="bg-[#18181B]">Lost</option>
            </select>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 border-t border-white/5 pt-4 mt-6">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              {lead ? "Save Changes" : "Create Lead"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
