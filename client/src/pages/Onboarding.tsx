import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Loader2, Users, Calendar } from "lucide-react";
import { useState } from "react";

export default function Onboarding() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [selectedRole, setSelectedRole] = useState<"host" | "guest" | null>(null);
  const setRoleMutation = trpc.profile.setRole.useMutation();

  const handleSelectRole = async (role: "host" | "guest") => {
    setSelectedRole(role);
    try {
      await setRoleMutation.mutateAsync(role);
      navigate("/");
    } catch (error) {
      console.error("Failed to set role:", error);
      setSelectedRole(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to AfterHours</h1>
          <p className="text-lg text-gray-600">Choose how you'd like to get started</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Host Card */}
          <Card className="p-8 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleSelectRole("host")}>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Host</h2>
              <p className="text-gray-600 mb-6">
                List your events and venues. Earn 90% of ticket sales after our 10% platform fee.
              </p>
              <Button
                disabled={setRoleMutation.isPending && selectedRole === "host"}
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectRole("host");
                }}
              >
                {setRoleMutation.isPending && selectedRole === "host" ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  "I'm a Host"
                )}
              </Button>
            </div>
          </Card>

          {/* Guest Card */}
          <Card className="p-8 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleSelectRole("guest")}>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Guest</h2>
              <p className="text-gray-600 mb-6">
                Discover and book tickets to amazing events in your area. Simple, secure checkout.
              </p>
              <Button
                disabled={setRoleMutation.isPending && selectedRole === "guest"}
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectRole("guest");
                }}
              >
                {setRoleMutation.isPending && selectedRole === "guest" ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  "I'm a Guest"
                )}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
