import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, User, Mail, Settings, Shield, Bell, Heart } from "lucide-react";
import { showSuccess, showError } from "@/lib/toast";
import { useState } from "react";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"profile" | "preferences" | "account">("profile");
  const [favorites, setFavorites] = useState<number[]>([]);

  const handleLogout = async () => {
    try {
      await logout();
      showSuccess("You've been logged out");
      navigate("/");
    } catch (error) {
      showError("Failed to logout. Please try again.");
      console.error(error);
    }
  };

  const getInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account and preferences</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-white">{getInitials()}</span>
                </div>
                <h3 className="font-bold text-gray-900">{user?.name || "User"}</h3>
                <p className="text-sm text-gray-600">{user?.email}</p>
                <div className="mt-3">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                    {user?.role === "admin" ? "Host" : "Guest"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${
                    activeTab === "profile"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <User className="w-4 h-4 inline mr-2" />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab("preferences")}
                  className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${
                    activeTab === "preferences"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Bell className="w-4 h-4 inline mr-2" />
                  Preferences
                </button>
                <button
                  onClick={() => setActiveTab("account")}
                  className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${
                    activeTab === "account"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Shield className="w-4 h-4 inline mr-2" />
                  Account
                </button>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <p className="text-gray-900">{user?.name || "Not set"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="flex items-center gap-2 text-gray-900">
                      <Mail className="w-4 h-4" />
                      {user?.email}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Type
                    </label>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                      {user?.role === "admin" ? "Host" : "Guest"}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Member Since
                    </label>
                    <p className="text-gray-900">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Event Notifications</p>
                      <p className="text-sm text-gray-600">Get notified about new events</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Booking Reminders</p>
                      <p className="text-sm text-gray-600">Reminders before your bookings</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Marketing Emails</p>
                      <p className="text-sm text-gray-600">Special offers and promotions</p>
                    </div>
                    <input type="checkbox" className="w-5 h-5" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Weekly Digest</p>
                      <p className="text-sm text-gray-600">Summary of events in your area</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>
                </div>
              </Card>
            )}

            {/* Account Tab */}
            {activeTab === "account" && (
              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Account Status</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                      <div>
                        <p className="font-medium text-green-900">Account Status</p>
                        <p className="text-sm text-green-700">Active and verified</p>
                      </div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Last Login</p>
                        <p className="text-sm text-gray-600">
                          {user?.lastSignedIn
                            ? new Date(user.lastSignedIn).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-red-200 bg-red-50">
                  <h2 className="text-xl font-bold text-red-900 mb-6">Danger Zone</h2>
                  <div className="space-y-3">
                    <Button
                      onClick={handleLogout}
                      className="w-full justify-start gap-2 bg-red-600 hover:bg-red-700 text-white"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 text-red-600 hover:text-red-700 border-red-200"
                    >
                      <User className="w-4 h-4" />
                      Delete Account
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
