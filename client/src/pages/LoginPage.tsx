import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Ticket, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [, navigate] = useLocation();

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

        {/* Login Card */}
        <Card className="p-8 shadow-2xl">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to your account to continue</p>
            </div>

            {/* Login Button */}
            <Button
              onClick={() => navigate("/role-selection")}
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
            >
              Sign In with Manus
              <ArrowRight className="w-4 h-4" />
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Sign Up */}
            <div className="text-center">
              <p className="text-gray-600 mb-4">Don't have an account?</p>
              <Button
                onClick={() => navigate("/role-selection")}
                variant="outline"
                size="lg"
                className="w-full"
              >
                Create Account
              </Button>
            </div>

            {/* Features */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center mb-3">Why join AfterHours?</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  Discover unique events
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  Easy ticket booking
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  Secure payments
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-blue-100 text-sm">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
