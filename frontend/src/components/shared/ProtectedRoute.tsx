import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#09090B] text-white">
        <Loader2 className="h-10 w-10 animate-spin text-[#6366F1]" />
        <p className="mt-4 text-sm font-medium text-zinc-400">Loading your profile...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
