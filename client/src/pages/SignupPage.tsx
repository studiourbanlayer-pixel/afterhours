import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Ticket } from "lucide-react";
import { startLogin } from "@/const";
import { showSuccess, showError } from "@/lib/toast";

export default function SignupPage() {
  const [, navigate] = useLocation();

  const handleSignup = () => {
    try {
      startLogin();
      showSuccess("Redirecting to sign up...");
    } catch (error) {
      showError("Failed to start signup. Please try again.");
      console.error(error);
    }
  };

  const handleSignIn = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Ticket className="w-10 h-10 text-white" />
            <h1 className="text-4xl font-bold text-white">AfterHours</h1>
          </div>
          <p className="text-blue-100 text-lg">Discover & Book Amazing Events</p>
        </div>

        {/* Signup Card */}
        <Card className="p-8 shadow-2xl">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-600">Join AfterHours to start your journey</p>
            </div>

            {/* OAuth Signup */}
            <div className="space-y-3">
              <Button
                onClick={handleSignup}
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                Sign Up with Manus
              </Button>

              <p className="text-center text-sm text-gray-600">
                Secure authentication powered by Manus
              </p>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-gray-600 mb-4">Already have an account?</p>
              <Button
                onClick={handleSignIn}
                variant="outline"
                size="lg"
                className="w-full"
              >
                Sign In
              </Button>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-blue-100 text-sm">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
