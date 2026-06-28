import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { createCompany, updateCompany } from "../../services/companyService";
import type { Company, CompanyInput } from "../../services/companyService";

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  company?: Company | null;
}

export default function CompanyModal({ isOpen, onClose, onSuccess, company }: CompanyModalProps) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompanyInput>({
    defaultValues: {
      name: "",
      domain: "",
      phone: "",
      address: "",
    },
  });

  useEffect(() => {
    if (company) {
      reset({
        name: company.name,
        domain: company.domain || "",
        phone: company.phone || "",
        address: company.address || "",
      });
    } else {
      reset({
        name: "",
        domain: "",
        phone: "",
        address: "",
      });
    }
  }, [company, reset, isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (data: CompanyInput) => {
    setError("");
    setIsLoading(true);

    try {
      if (company) {
        await updateCompany(company.id, data);
      } else {
        await createCompany(data);
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
            {company ? "Edit Company" : "Add New Company"}
          </h3>
          <button type="button" className="rounded-lg p-1 text-zinc-400 hover:text-white" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && <div className="mt-4 rounded-xl bg-rose-500/10 border border-rose-500/15 p-3 text-xs text-rose-400">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <Input
            label="Company Name *"
            placeholder="Acme Inc"
            error={errors.name?.message}
            {...register("name", { required: "Company Name is required" })}
          />

          <Input
            label="Domain"
            placeholder="acme.com"
            {...register("domain")}
          />

          <Input
            label="Phone"
            placeholder="+1 555-555-5555"
            {...register("phone")}
          />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="company-address" className="text-xs font-medium text-zinc-400">Address</label>
            <textarea
              id="company-address"
              placeholder="123 Main St..."
              className="w-full px-4 py-2.5 text-sm bg-white/3 border border-white/10 focus:border-[#6366F1] rounded-xl text-white outline-none placeholder-zinc-500"
              {...register("address")}
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-white/5 pt-4 mt-6">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              {company ? "Save Changes" : "Create Company"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
