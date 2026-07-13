import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Loader2, Users, Megaphone, ArrowLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { showSuccess, showError } from "@/lib/toast";

export default function RoleSelectionPage() {
  const [, navigate] = useLocation();
  const setRoleMutation = trpc.profile.setRole.useMutation();

  const handleSelectRole = async (role: "host" | "guest") => {
    try {
      await setRoleMutation.mutateAsync(role);
      showSuccess(`Welcome, ${role}!`);
      navigate("/");
    } catch (error) {
      showError("Failed to set role. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Role
          </h1>
          <p className="text-xl text-gray-600">
            Select how you'd like to use AfterHours
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Guest Card */}
          <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-500">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">I'm a Guest</h2>
              <p className="text-gray-600 mb-6">
                Discover amazing events and book tickets easily
              </p>

              {/* Features */}
              <ul className="space-y-2 mb-8 text-sm text-gray-600 text-left">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  Browse events in your area
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  Book tickets securely
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  Manage your bookings
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  Get event reminders
                </li>
              </ul>

              <Button
                onClick={() => handleSelectRole("guest")}
                disabled={setRoleMutation.isPending}
                size="lg"
                className="w-full"
              >
                {setRoleMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  "Continue as Guest"
                )}
              </Button>
            </div>
          </Card>

          {/* Host Card */}
          <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-indigo-500">
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Megaphone className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">I'm a Host</h2>
              <p className="text-gray-600 mb-6">
                Create and manage events, reach your audience
              </p>

              {/* Features */}
              <ul className="space-y-2 mb-8 text-sm text-gray-600 text-left">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                  Create unlimited events
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                  Set custom ticket prices
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                  Track bookings & revenue
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                  Instant payouts
                </li>
              </ul>

              <Button
                onClick={() => handleSelectRole("host")}
                disabled={setRoleMutation.isPending}
                size="lg"
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                {setRoleMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  "Continue as Host"
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Info */}
        <div className="text-center mt-12">
          <p className="text-gray-600">
            You can change your role anytime in your profile settings
          </p>
        </div>
      </div>
    </div>
  );
}
