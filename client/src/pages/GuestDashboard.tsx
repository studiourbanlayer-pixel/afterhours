import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Loader2, Calendar, Ticket, MapPin } from "lucide-react";

export default function GuestDashboard() {
  const bookingDetailsQuery = trpc.bookingDetails.getGuestBookingDetails.useQuery();
  const bookings = bookingDetailsQuery.data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-1">View and manage your event tickets</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {bookingDetailsQuery.isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : bookings.length === 0 ? (
          <Card className="p-12 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h2>
            <p className="text-gray-600">Browse events and book your first tickets</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.bookingId} className="p-6 hover:shadow-lg transition-shadow">
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Event Image */}
                  {booking.coverImageUrl && (
                    <div className="md:col-span-1">
                      <img
                        src={booking.coverImageUrl}
                        alt={booking.listingTitle}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Event Details */}
                  <div className={booking.coverImageUrl ? "md:col-span-1" : "md:col-span-2"}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{booking.listingTitle}</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      {booking.eventDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(booking.eventDate).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      )}
                      {booking.venueAddress && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{booking.venueAddress}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Ticket className="w-4 h-4" />
                        {booking.quantity} ticket{booking.quantity !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>

                  {/* Booking Info */}
                  <div className="md:col-span-1 flex flex-col justify-between">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Total Amount</div>
                      <div className="text-2xl font-bold text-blue-600">
                        ${(booking.totalAmountCents / 100).toFixed(2)}
                      </div>
                    </div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      booking.bookingStatus === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : booking.bookingStatus === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {booking.bookingStatus}
                    </span>
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
