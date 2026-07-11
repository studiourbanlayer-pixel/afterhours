import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Calendar, MapPin, Users, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ListingDetail({ id }: { id: number }) {
  const [, navigate] = useLocation();
  const [quantity, setQuantity] = useState(1);
  const listingQuery = trpc.listings.getById.useQuery(id);
  const checkoutMutation = trpc.payment.createCheckout.useMutation();

  const listing = listingQuery.data;

  const handleBooking = async () => {
    if (!listing) return;
    
    try {
      const result = await checkoutMutation.mutateAsync({
        listingId: listing.id,
        quantity,
      });
      
      if (result.checkoutUrl) {
        window.open(result.checkoutUrl, "_blank");
        toast.success("Redirecting to checkout...");
      }
    } catch (error) {
      toast.error("Failed to create checkout session");
      console.error(error);
    }
  };

  if (listingQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h1>
          <Button onClick={() => navigate("/")}>Back to Browse</Button>
        </div>
      </div>
    );
  }

  const totalAmount = listing.ticketPriceCents * quantity;
  const commission = Math.round(totalAmount * 0.1);
  const hostPayout = totalAmount - commission;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <div className="lg:col-span-2">
            {listing.coverImageUrl && (
              <img
                src={listing.coverImageUrl}
                alt={listing.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}
            
            <Card className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{listing.title}</h1>
              
              <div className="space-y-3 mb-6 text-gray-600">
                {listing.eventDate && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span>{new Date(listing.eventDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}</span>
                  </div>
                )}
                {listing.venueAddress && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span>{listing.venueAddress}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>{listing.capacity} spots available</span>
                </div>
              </div>

              {listing.description && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">About this event</h2>
                  <p className="text-gray-600 whitespace-pre-wrap">{listing.description}</p>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24 h-fit">
              <div className="mb-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  ${(listing.ticketPriceCents / 100).toFixed(2)}
                </div>
                <p className="text-gray-600">per ticket</p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Tickets
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max={listing.capacity}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2 text-gray-600">
                    <span>Subtotal ({quantity} × ${(listing.ticketPriceCents / 100).toFixed(2)})</span>
                    <span>${(totalAmount / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2 text-gray-600">
                    <span>Platform fee (10%)</span>
                    <span>${(commission / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>${(totalAmount / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleBooking}
                disabled={checkoutMutation.isPending}
                className="w-full"
              >
                {checkoutMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Book Now"
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                You'll be redirected to Stripe to complete payment
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
