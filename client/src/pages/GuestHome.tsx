import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { Search, MapPin, Calendar, Ticket, Sparkles } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function GuestHome() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const { data: allListings, isLoading } = trpc.listings.getActive.useQuery();

  // Filter listings based on search and price
  const listings = allListings?.filter((listing: any) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = !maxPrice || listing.ticketPriceCents <= maxPrice * 100;
    return matchesSearch && matchesPrice;
  }) ?? [];

  const handleListingClick = (id: number) => {
    navigate(`/listing/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6" />
            <h1 className="text-4xl font-bold">Discover Events</h1>
          </div>
          <p className="text-blue-100 text-lg mb-8">
            Find and book amazing events happening near you
          </p>

          {/* Search Bar */}
          <div className="flex gap-3 flex-col sm:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-white text-gray-900"
              />
            </div>
            <div className="w-full sm:w-32">
              <Input
                type="number"
                placeholder="Max price"
                value={maxPrice ?? ""}
                onChange={(e) =>
                  setMaxPrice(e.target.value ? parseInt(e.target.value) : null)
                }
                className="h-12"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Tab Header */}
        <div className="mb-8">
          <div className="flex gap-4 border-b">
            <button className="pb-3 px-2 border-b-2 border-blue-600 text-blue-600 font-semibold flex items-center gap-2">
              <Ticket className="w-5 h-5" />
              Discover
            </button>
          </div>
        </div>

        {/* Listings Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading events...</p>
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings?.map((listing: any) => (
              <Card
                key={listing.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleListingClick(Number(listing.id))}
              >
                {/* Image */}
                {listing.coverImageUrl && (
                  <div className="h-48 bg-gradient-to-br from-blue-400 to-indigo-600 overflow-hidden">
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
                      <MapPin className="w-4 h-4" />
                      <span className="line-clamp-1">{listing.venueAddress}</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-xs text-gray-500">Price per ticket</p>
                      <p className="text-lg font-bold text-blue-600">
                        ${(listing.ticketPriceCents / 100).toFixed(2)}
                      </p>
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Book Now
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No events found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filters to find more events
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
