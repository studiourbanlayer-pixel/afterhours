import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Calendar, MapPin, Users, AlertCircle, ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [, navigate] = useLocation();
  const listingsQuery = trpc.listings.getActive.useQuery();

  const listings = listingsQuery.data || [];
  
  const filteredListings = listings.filter((listing) => {
    // Search filter
    const matchesSearch = 
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    // Date range filter
    if (dateFrom || dateTo) {
      const eventDate = new Date(listing.eventDate);
      if (dateFrom) {
        const fromDate = new Date(dateFrom);
        if (eventDate < fromDate) return false;
      }
      if (dateTo) {
        const toDate = new Date(dateTo);
        if (eventDate > toDate) return false;
      }
    }

    // Price filter
    if (maxPrice) {
      const maxPriceValue = parseFloat(maxPrice);
      const listingPrice = listing.ticketPriceCents / 100;
      if (listingPrice > maxPriceValue) return false;
    }

    return true;
  });

  const handleResetFilters = () => {
    setDateFrom("");
    setDateTo("");
    setMaxPrice("");
    setSearchQuery("");
  };

  const hasActiveFilters = dateFrom || dateTo || maxPrice || searchQuery;

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
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <DropdownMenu open={showFilters} onOpenChange={setShowFilters}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Calendar className="w-4 h-4" />
                    Filters
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Filter Events</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <div className="p-4 space-y-4">
                    {/* Date Range */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date Range
                      </label>
                      <div className="space-y-2">
                        <div>
                          <label className="text-xs text-gray-600">From</label>
                          <Input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">To</label>
                          <Input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Max Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Price
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">$</span>
                        <Input
                          type="number"
                          placeholder="No limit"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          step="0.01"
                          min="0"
                          className="flex-1"
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleResetFilters}
                        className="flex-1"
                      >
                        Reset
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setShowFilters(false)}
                        className="flex-1"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">
                  Showing {filteredListings.length} of {listings.length} events
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetFilters}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
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
            <p className="text-gray-500 text-lg">
              {hasActiveFilters ? "No events match your filters" : "No events found"}
            </p>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={handleResetFilters}
                className="mt-4"
              >
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <Card
                key={listing.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/listings/${listing.id}`)}
              >
                {listing.coverImageUrl && (
                  <img
                    src={listing.coverImageUrl}
                    alt={listing.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {listing.title}
                  </h3>
                  {listing.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {listing.description}
                    </p>
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{listing.capacity} tickets</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        ${(listing.ticketPriceCents / 100).toFixed(2)}
                      </span>
                    </div>
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
