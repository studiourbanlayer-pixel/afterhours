import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Edit2, Trash2, Calendar, Users, DollarSign } from "lucide-react";

export default function HostDashboard() {
  const [, navigate] = useLocation();
  const listingsQuery = trpc.listings.getHostListings.useQuery();
  const statsQuery = trpc.analytics.getHostStats.useQuery();
  const cancelMutation = trpc.listings.cancel.useMutation();
  
  const listings = listingsQuery.data || [];
  const stats = statsQuery.data || [];

  const statsByListingId = new Map(stats.map((s) => [s.listingId, s]));

  const totalRevenue = stats.reduce((sum, s) => sum + (Number(s.hostPayout) || 0), 0) || 0;
  const totalBookings = stats.reduce((sum, s) => sum + (Number(s.bookingCount) || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Host Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your events and track bookings</p>
            </div>
            <Button onClick={() => navigate("/create-listing")} className="gap-2">
              <Plus className="w-4 h-4" />
              Create Event
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="text-sm text-gray-600">Total Bookings</div>
              <div className="text-2xl font-bold text-gray-900">{totalBookings}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-gray-600">Revenue (after 10%)</div>
              <div className="text-2xl font-bold text-green-600">${(totalRevenue / 100).toFixed(2)}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-gray-600">Active Events</div>
              <div className="text-2xl font-bold text-gray-900">{listings.filter(l => l.status === 'active').length}</div>
            </Card>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {listingsQuery.isLoading || statsQuery.isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : listings.length === 0 ? (
          <Card className="p-12 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No events yet</h2>
            <p className="text-gray-600 mb-6">Create your first event to start accepting bookings</p>
            <Button onClick={() => navigate("/create-listing")}>Create Your First Event</Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {listings.map((listing) => {
              const stat = statsByListingId.get(listing.id);
              const bookingCount = Number(stat?.bookingCount) || 0;
              const hostPayout = Number(stat?.hostPayout) || 0;

              return (
                <Card key={listing.id} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{listing.title}</h3>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        {listing.eventDate && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(listing.eventDate).toLocaleDateString()}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          {bookingCount} bookings
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-lg font-semibold text-green-600">
                          ${(hostPayout / 100).toFixed(2)}
                        </span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        listing.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {listing.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => navigate(`/edit-listing/${listing.id}`)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        disabled={cancelMutation.isPending}
                        onClick={async () => {
                          try {
                            await cancelMutation.mutateAsync(listing.id);
                            listingsQuery.refetch();
                            statsQuery.refetch();
                          } catch (error) {
                            console.error("Failed to cancel listing:", error);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
