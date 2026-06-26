import { useAuthStore } from "../../store/authStore";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { User, Shield, Sliders, LogOut } from "lucide-react";

export default function SettingsPage() {
  const { user, logout } = useAuthStore();

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header section */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">Settings</h1>
        <p className="text-sm text-zinc-400">Manage your user account settings and system preferences.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Navigation Tabs Mock */}
        <div className="space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-white bg-white/5 border border-white/5 rounded-xl text-left">
            <User className="h-4 w-4 text-[#6366F1]" />
            Account Profile
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/3 rounded-xl text-left transition-colors">
            <Shield className="h-4 w-4" />
            Security & Password
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/3 rounded-xl text-left transition-colors">
            <Sliders className="h-4 w-4" />
            CRM Preferences
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile details */}
          <Card className="p-6 space-y-6">
            <h3 className="text-base font-semibold text-white">Account Information</h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Full Name</p>
                <p className="text-sm text-white font-medium mt-1">{user?.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Email Address</p>
                <p className="text-sm text-white font-medium mt-1">{user?.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Role</p>
                <p className="text-sm text-[#6366F1] font-semibold mt-1">Super Admin</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Workspace</p>
                <p className="text-sm text-zinc-300 font-medium mt-1">Personal CRM</p>
              </div>
            </div>
          </Card>

          {/* Danger zone (Logout) */}
          <Card className="p-6 border-rose-500/15 bg-rose-500/1 space-y-4">
            <div>
              <h3 className="text-base font-semibold text-white">Sign Out</h3>
              <p className="text-xs text-zinc-500 mt-1">Log out of your current session on this device.</p>
            </div>
            
            <Button 
              variant="danger" 
              leftIcon={<LogOut className="h-4 w-4" />}
              onClick={logout}
            >
              Log Out
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
