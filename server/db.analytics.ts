import { eq, sum } from "drizzle-orm";
import { getDb } from "./db";
import { listings, bookings } from "../drizzle/schema";

/**
 * Get aggregated stats for a host's listings
 */
export async function getHostListingStats(hostId: number) {
  const db = await getDb();
  if (!db) return [];

  const hostListings = await db
    .select({
      listingId: listings.id,
      listingTitle: listings.title,
      bookingCount: sum(bookings.quantity),
      totalRevenue: sum(bookings.totalAmountCents),
      totalCommission: sum(bookings.commissionCents),
      hostPayout: sum(bookings.hostPayoutCents),
    })
    .from(listings)
    .leftJoin(bookings, eq(listings.id, bookings.listingId))
    .where(eq(listings.hostId, hostId))
    .groupBy(listings.id);

  return hostListings;
}

/**
 * Get guest booking details with listing info
 */
export async function getGuestBookingDetails(guestId: number) {
  const db = await getDb();
  if (!db) return [];

  const bookingDetails = await db
    .select({
      bookingId: bookings.id,
      bookingStatus: bookings.status,
      quantity: bookings.quantity,
      totalAmountCents: bookings.totalAmountCents,
      createdAt: bookings.createdAt,
      listingId: listings.id,
      listingTitle: listings.title,
      eventDate: listings.eventDate,
      venueAddress: listings.venueAddress,
      coverImageUrl: listings.coverImageUrl,
    })
    .from(bookings)
    .innerJoin(listings, eq(bookings.listingId, listings.id))
    .where(eq(bookings.guestId, guestId));

  return bookingDetails;
}
