import { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2, Building, Globe, MapPin, Phone } from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { getCompanies, deleteCompany } from "../../services/companyService";
import type { Company } from "../../services/companyService";
import CompanyModal from "../../components/companies/CompanyModal";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const fetchCompanies = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getCompanies();
      setCompanies(data);
      setFilteredCompanies(data);
    } catch {
      setError("Failed to fetch companies.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const results = companies.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        (c.domain && c.domain.toLowerCase().includes(term))
    );
    setFilteredCompanies(results);
  }, [searchTerm, companies]);

  const handleOpenAddModal = () => {
    setSelectedCompany(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (company: Company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this company?")) {
      try {
        await deleteCompany(id);
        fetchCompanies();
      } catch {
        alert("Failed to delete company.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Companies</h1>
          <p className="text-sm text-zinc-400">Manage client organizations and key details.</p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={handleOpenAddModal}>
          Add Company
        </Button>
      </div>

      <Card className="p-4">
        <div className="relative flex items-center w-full max-w-md bg-white/3 border border-white/8 rounded-xl px-3 py-2 focus-within:border-[#6366F1] transition-all">
          <Search className="h-4 w-4 text-zinc-500 mr-2.5" />
          <input
            type="text"
            placeholder="Search companies by name or domain..."
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
          <Button variant="secondary" className="mt-4" onClick={fetchCompanies}>
            Retry
          </Button>
        </Card>
      ) : filteredCompanies.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-zinc-400 mb-4">
            <Building className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-white">No companies found</h3>
          <p className="mt-1 text-sm text-zinc-400 max-w-xs">
            {searchTerm ? `No results match "${searchTerm}".` : "Add companies to associate with leads and customers."}
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCompanies.map((c) => (
            <Card key={c.id} className="p-5 flex flex-col justify-between hoverable min-h-[160px]">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-white">{c.name}</h3>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      className="p-1 text-zinc-400 hover:text-white"
                      onClick={() => handleOpenEditModal(c)}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      className="p-1 text-zinc-400 hover:text-rose-400"
                      onClick={() => handleDelete(c.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs text-zinc-400">
                  {c.domain && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-3.5 w-3.5 text-zinc-500" />
                      <a href={`https://${c.domain}`} target="_blank" rel="noreferrer" className="hover:text-indigo-400">
                        {c.domain}
                      </a>
                    </div>
                  )}
                  {c.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-zinc-500" />
                      <span>{c.phone}</span>
                    </div>
                  )}
                  {c.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                      <span className="truncate">{c.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <CompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchCompanies}
        company={selectedCompany}
      />
    </div>
  );
}
