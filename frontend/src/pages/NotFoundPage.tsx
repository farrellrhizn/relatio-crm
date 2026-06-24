// frontend/src/pages/NotFoundPage.tsx
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#09090B] text-white">
      <div className="text-center">
        <h1 className="text-3xl font-semibold">404</h1>
        <p className="mt-2 text-zinc-400">Page not found</p>
        <Link to="/dashboard" className="mt-4 inline-block text-indigo-400">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}