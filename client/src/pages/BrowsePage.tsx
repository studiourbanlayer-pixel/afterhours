import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Calendar, MapPin, Users, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, navigate] = useLocation();
  const listingsQuery = trpc.listings.getActive.useQuery();

  const listings = listingsQuery.data || [];
  const filteredListings = listings.filter((listing) =>
    listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (listingsQuery.error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Failed to load events</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Browse Events</h1>
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {listingsQuery.isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No events found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/listings/${listing.id}`)}>
                {listing.coverImageUrl && (
                  <img src={listing.coverImageUrl} alt={listing.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{listing.title}</h3>
                  {listing.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{listing.description}</p>
                  )}
                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    {listing.eventDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(listing.eventDate).toLocaleDateString()}
                      </div>
                    )}
                    {listing.venueAddress && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{listing.venueAddress}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {listing.capacity} spots available
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-600">${(listing.ticketPriceCents / 100).toFixed(2)}</span>
                    <Button size="sm">View Details</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
