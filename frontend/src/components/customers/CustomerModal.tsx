import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { createCustomer, updateCustomer } from "../../services/customerService";
import type { Customer, CustomerInput } from "../../services/customerService";
import { getCompanies } from "../../services/companyService";
import type { Company } from "../../services/companyService";

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  customer?: Customer | null;
}

export default function CustomerModal({ isOpen, onClose, onSuccess, customer }: CustomerModalProps) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerInput>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      companyId: null,
    },
  });

  useEffect(() => {
    async function loadCompanies() {
      try {
        const data = await getCompanies();
        setCompanies(data);
      } catch {
        console.error("Failed to load companies");
      }
    }

    if (isOpen) {
      loadCompanies();
      if (customer) {
        reset({
          name: customer.name,
          email: customer.email || "",
          phone: customer.phone || "",
          company: customer.company || "",
          companyId: customer.companyId || null,
        });
      } else {
        reset({
          name: "",
          email: "",
          phone: "",
          company: "",
          companyId: null,
        });
      }
    }
  }, [customer, reset, isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (data: CustomerInput) => {
    setError("");
    setIsLoading(true);

    try {
      const payload = {
        ...data,
        companyId: data.companyId ? Number(data.companyId) : null,
      };

      if (customer) {
        // Edit Mode
        await updateCustomer(customer.id, payload);
      } else {
        // Create Mode
        await createCustomer(payload);
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
            {customer ? "Edit Customer" : "Add New Customer"}
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
            placeholder="Jane Doe"
            error={errors.name?.message}
            {...register("name", { required: "Name is required" })}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="jane@company.com"
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
            placeholder="+62 999-9999-9999"
            {...register("phone")}
          />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="customer-company" className="text-xs font-medium text-zinc-400">
              Associate with Company
            </label>
            <select
              id="customer-company"
              className="w-full px-4 py-2.5 text-sm bg-white/3 border border-white/10 focus:border-[#6366F1] rounded-xl text-white outline-none"
              {...register("companyId")}
            >
              <option value="" className="bg-[#18181B]">-- None --</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#18181B]">{c.name}</option>
              ))}
            </select>
          </div>

          <Input
            label="Company Name (Text fallback)"
            placeholder="Initech Solutions"
            {...register("company")}
          />

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 border-t border-white/5 pt-4 mt-6">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              {customer ? "Save Changes" : "Create Customer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
