import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import Onboarding from "./Onboarding";
import BrowsePage from "./BrowsePage";
import HostDashboard from "./HostDashboard";
import GuestDashboard from "./GuestDashboard";

export default function Home() {
  const { user, loading } = useAuth();
  const [location] = useLocation();
  const profileQuery = trpc.profile.getOrCreate.useQuery(undefined, { enabled: !!user });

  if (loading || profileQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to AfterHours</h1>
          <p className="text-gray-600 mb-8">Please sign in to continue</p>
        </div>
      </div>
    );
  }

  const profile = profileQuery.data;
  const platformRole = profile?.platformRole;

  // Show onboarding if no role selected
  if (!platformRole) {
    return <Onboarding />;
  }

  // Route based on role and location
  if (platformRole === "host") {
    if (location === "/dashboard" || location === "/") {
      return <HostDashboard />;
    }
  } else if (platformRole === "guest") {
    if (location === "/dashboard") {
      return <GuestDashboard />;
    }
    return <BrowsePage />;
  }

  return <BrowsePage />;
}
