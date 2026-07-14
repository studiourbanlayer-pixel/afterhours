import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ListingDetail from "./pages/ListingDetail";
import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import RoleSelectionPage from "./pages/RoleSelectionPage";
import GuestHome from "./pages/GuestHome";
import HostHome from "./pages/HostHome";
import BrowsePage from "./pages/BrowsePage";
import GuestDashboard from "./pages/GuestDashboard";
import HostDashboard from "./pages/HostDashboard";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogOut, Home as HomeIcon, LayoutGrid, User } from "lucide-react";
import { useIsMobile } from "@/hooks/useMobile";

function NavigationBar() {
  const { user, logout } = useAuth();
  const [location, navigate] = useLocation();
  const isMobile = useIsMobile();

  if (!user) return null;

  if (isMobile) {
    // Mobile bottom tab navigation
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex justify-around items-center h-16">
          <Button
            variant={location === "/" ? "default" : "ghost"}
            size="sm"
            onClick={() => navigate("/")}
            className="flex flex-col items-center gap-1"
          >
            <LayoutGrid className="w-5 h-5" />
            <span className="text-xs">Browse</span>
          </Button>
          <Button
            variant={location === "/dashboard" ? "default" : "ghost"}
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="flex flex-col items-center gap-1"
          >
            <HomeIcon className="w-5 h-5" />
            <span className="text-xs">Dashboard</span>
          </Button>
          <Button
            variant={location === "/profile" ? "default" : "ghost"}
            size="sm"
            onClick={() => navigate("/profile")}
            className="flex flex-col items-center gap-1"
          >
            <User className="w-5 h-5" />
            <span className="text-xs">Profile</span>
          </Button>
        </div>
      </div>
    );
  }

  // Desktop sidebar navigation
  return (
    <div className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 z-40 flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-blue-600">AfterHours</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Button
          variant={location === "/" ? "default" : "ghost"}
          className="w-full justify-start gap-2"
          onClick={() => navigate("/")}
        >
          <LayoutGrid className="w-5 h-5" />
          Browse Events
        </Button>
        <Button
          variant={location === "/dashboard" ? "default" : "ghost"}
          className="w-full justify-start gap-2"
          onClick={() => navigate("/dashboard")}
        >
          <HomeIcon className="w-5 h-5" />
          Dashboard
        </Button>
        <Button
          variant={location === "/profile" ? "default" : "ghost"}
          className="w-full justify-start gap-2"
          onClick={() => navigate("/profile")}
        >
          <User className="w-5 h-5" />
          Profile
        </Button>
      </nav>
      <div className="p-4 border-t">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 text-red-600 hover:text-red-700"
          onClick={logout}
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}

function Router() {
  const { user, loading } = useAuth();
  const isMobile = useIsMobile();
  const mainContentClass = isMobile ? "pb-20" : "ml-64";

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login/signup pages if not authenticated
  if (!user) {
    return (
      <Switch>
        <Route path={"/"} component={LoginPage} />
        <Route path={"/signup"} component={SignupPage} />
        <Route component={LoginPage} />
      </Switch>
    );
  }

  return (
    <div className="flex">
      <NavigationBar />
      <div className={`flex-1 ${mainContentClass}`}>
        <Switch>
          <Route path={"/"} component={Home} />
          <Route path={"/role-selection"} component={RoleSelectionPage} />
          <Route path={"/guest"} component={GuestHome} />
          <Route path={"/browse"} component={BrowsePage} />
          <Route path={"/guest-dashboard"} component={GuestDashboard} />
          <Route path={"/host"} component={HostHome} />
          <Route path={"/host-dashboard"} component={HostDashboard} />
          <Route path={"/listing/:id"} component={({ params }) => <ListingDetail id={parseInt(params.id)} />} />
          <Route path={"/create-listing"} component={CreateListing} />
          <Route path={"/edit-listing/:id"} component={({ params }) => <EditListing id={parseInt(params.id)} />} />
          <Route path={"/profile"} component={ProfilePage} />
          <Route path={"/404"} component={NotFound} />
          {/* Final fallback route */}
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
