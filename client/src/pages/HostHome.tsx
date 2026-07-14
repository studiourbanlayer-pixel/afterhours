import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Plus, Megaphone, Calendar, Users, TrendingUp } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function HostHome() {
  const [, navigate] = useLocation();
  const { data: listings, isLoading } = trpc.listings.getHostListings.useQuery();
  const { data: analyticsData } = trpc.analytics.getHostStats.useQuery();

  const handleCreateListing = () => {
    navigate("/create-listing");
  };

  const handleEditListing = (id: number) => {
    navigate(`/edit-listing/${id}`);
  };

  const handleListingDetail = (id: number) => {
    navigate(`/listing/${id}`);
  };

  // Calculate totals from analytics data
  const stats = {
    totalListings: analyticsData?.length || 0,
    totalBookings: analyticsData?.reduce(
      (sum: number, item: any) => sum + (parseInt(item.bookingCount) || 0),
      0
    ) || 0,
    totalRevenue: analyticsData?.reduce(
      (sum: number, item: any) => sum + (parseInt(item.totalRevenue) || 0),
      0
    ) || 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between flex-col sm:flex-row gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Megaphone className="w-6 h-6" />
                <h1 className="text-4xl font-bold">Host a Party</h1>
              </div>
              <p className="text-indigo-100 text-lg">
                Create and manage your events, reach your audience
              </p>
            </div>
            <Button
              onClick={handleCreateListing}
              size="lg"
              className="bg-white text-indigo-600 hover:bg-gray-100 gap-2 font-semibold"
            >
              <Plus className="w-5 h-5" />
              Create Event
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Events</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalListings}
                </p>
              </div>
              <Megaphone className="w-10 h-10 text-indigo-600 opacity-20" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalBookings}
                </p>
              </div>
              <Users className="w-10 h-10 text-blue-600 opacity-20" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${(stats.totalRevenue / 100).toFixed(2)}
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-600 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Tab Header */}
        <div className="mb-8">
          <div className="flex gap-4 border-b">
            <button className="pb-3 px-2 border-b-2 border-indigo-600 text-indigo-600 font-semibold flex items-center gap-2">
              <Megaphone className="w-5 h-5" />
              My Listings
            </button>
          </div>
        </div>

        {/* Listings Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading your events...</p>
          </div>
        ) : listings && listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing: any) => (
              <Card
                key={listing.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                {listing.coverImageUrl && (
                  <div className="h-48 bg-gradient-to-br from-indigo-400 to-purple-600 overflow-hidden">
                    <img
                      src={listing.coverImageUrl}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                    {listing.title}
                  </h3>

                  {/* Details */}
                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(listing.eventDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{listing.capacity} capacity</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mb-4 pb-4 border-b">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        listing.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {listing.status === "active" ? "Active" : "Cancelled"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEditListing(listing.id)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleListingDetail(listing.id)}
                      size="sm"
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                    >
                      View
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No events yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first event and start reaching your audience
            </p>
            <Button
              onClick={handleCreateListing}
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Event
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
