import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import api from "../../services/api";
import { User, Shield, Sliders, LogOut, Sun, Moon } from "lucide-react";

type ActiveTab = "profile" | "security" | "preferences";

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [activeTab, setActiveTab] = useState<ActiveTab>("profile");

  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmitPassword = async (data: any) => {
    setPasswordSuccess("");
    setPasswordError("");

    if (data.newPassword !== data.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.put("/auth/change-password", {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      setPasswordSuccess("Password updated successfully.");
      reset();
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || "Failed to update password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header section */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-(--text-primary)">Settings</h1>
        <p className="text-sm text-zinc-400">Manage your user account settings and system preferences.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Navigation Tabs */}
        <div className="space-y-1">
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-left transition-colors ${
              activeTab === "profile"
                ? "bg-white/10 text-white border border-white/5"
                : "text-zinc-400 hover:text-white hover:bg-white/3"
            }`}
          >
            <User className="h-4 w-4 text-[#6366F1]" />
            Account Profile
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-left transition-colors ${
              activeTab === "security"
                ? "bg-white/10 text-white border border-white/5"
                : "text-zinc-400 hover:text-white hover:bg-white/3"
            }`}
          >
            <Shield className="h-4 w-4 text-[#6366F1]" />
            Security & Password
          </button>
          <button
            onClick={() => setActiveTab("preferences")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-left transition-colors ${
              activeTab === "preferences"
                ? "bg-white/10 text-white border border-white/5"
                : "text-zinc-400 hover:text-white hover:bg-white/3"
            }`}
          >
            <Sliders className="h-4 w-4 text-[#6366F1]" />
            CRM Preferences
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-6">
          {activeTab === "profile" && (
            <Card className="p-6 space-y-6">
              <h3 className="text-base font-semibold text-(--text-primary)">Account Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Full Name</p>
                  <p className="text-sm text-(--text-primary) font-medium mt-1">{user?.name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Email Address</p>
                  <p className="text-sm text-(--text-primary) font-medium mt-1">{user?.email || "N/A"}</p>
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
          )}

          {activeTab === "security" && (
            <Card className="p-6 space-y-6">
              <h3 className="text-base font-semibold text-(--text-primary)">Security & Change Password</h3>

              {passwordSuccess && (
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/15 p-3 text-xs text-emerald-400">
                  {passwordSuccess}
                </div>
              )}
              {passwordError && (
                <div className="rounded-xl bg-rose-500/10 border border-rose-500/15 p-3 text-xs text-rose-400">
                  {passwordError}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-4">
                <Input
                  label="Current Password *"
                  type="password"
                  placeholder="••••••••"
                  error={errors.oldPassword?.message}
                  {...register("oldPassword", { required: "Current password is required" })}
                />
                <Input
                  label="New Password *"
                  type="password"
                  placeholder="••••••••"
                  error={errors.newPassword?.message}
                  {...register("newPassword", {
                    required: "New password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" },
                  })}
                />
                <Input
                  label="Confirm New Password *"
                  type="password"
                  placeholder="••••••••"
                  error={errors.confirmPassword?.message}
                  {...register("confirmPassword", { required: "Please confirm your password" })}
                />
                <div className="flex justify-end pt-2">
                  <Button type="submit" variant="primary" isLoading={isSubmitting}>
                    Update Password
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {activeTab === "preferences" && (
            <Card className="p-6 space-y-6">
              <h3 className="text-base font-semibold text-(--text-primary)">CRM Preferences</h3>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-semibold text-(--text-primary)">Interface Theme</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Toggle between dark and light styles.</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all"
                >
                  {theme === "dark" ? (
                    <>
                      <Sun className="h-4 w-4 text-amber-400" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4 text-[#6366F1]" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>
              </div>
            </Card>
          )}

          {/* Danger zone (Logout) */}
          <Card className="p-6 border-rose-500/15 bg-rose-500/1 space-y-4">
            <div>
              <h3 className="text-base font-semibold text-(--text-primary)">Sign Out</h3>
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
