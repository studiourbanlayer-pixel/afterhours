import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { getOrCreateProfile, updateProfile, createListing, getListingById, getActiveListings, getHostListings, updateListing, createBooking, getGuestBookings, getListingBookings } from "./db";
import { getHostListingStats, getGuestBookingDetails } from "./db.analytics";
import { z } from "zod";
import Stripe from "stripe";
import { storagePut } from "./storage";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  profile: router({
    getOrCreate: protectedProcedure.query(async ({ ctx }) => {
      return getOrCreateProfile(ctx.user.id);
    }),
    setRole: protectedProcedure.input(z.enum(["host", "guest"])).mutation(async ({ ctx, input }) => {
      await updateProfile(ctx.user.id, { platformRole: input });
      return { success: true };
    }),
  }),

  listings: router({
    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        venueAddress: z.string().optional(),
        eventDate: z.date(),
        capacity: z.number().int().positive(),
        ticketPriceCents: z.number().int().positive(),
        coverImageUrl: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return createListing({
          hostId: ctx.user.id,
          ...input,
        });
      }),
    getById: publicProcedure.input(z.number()).query(async ({ input }) => {
      return getListingById(input);
    }),
    getActive: publicProcedure.query(async () => {
      return getActiveListings();
    }),
    getHostListings: protectedProcedure.query(async ({ ctx }) => {
      return getHostListings(ctx.user.id);
    }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        venueAddress: z.string().optional(),
        eventDate: z.date().optional(),
        capacity: z.number().int().positive().optional(),
        ticketPriceCents: z.number().int().positive().optional(),
        coverImageUrl: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        const listing = await getListingById(id);
        if (!listing || listing.hostId !== ctx.user.id) {
          throw new Error("Unauthorized");
        }
        await updateListing(id, data);
        return { success: true };
      }),
    uploadCoverImage: protectedProcedure
      .input(z.object({
        fileName: z.string(),
        fileData: z.string(),
        mimeType: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          const buffer = Buffer.from(input.fileData, "base64");
          const fileKey = `listings/${ctx.user.id}/${Date.now()}-${input.fileName}`;
          const { url } = await storagePut(fileKey, buffer, input.mimeType);
          return { url };
        } catch (error) {
          console.error("Image upload failed:", error);
          throw new Error("Failed to upload image");
        }
      }),
    cancel: protectedProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
      const listing = await getListingById(input);
      if (!listing || listing.hostId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }
      await updateListing(input, { status: "cancelled" });
      return { success: true };
    }),
  }),

  bookings: router({
    getGuestBookings: protectedProcedure.query(async ({ ctx }) => {
      return getGuestBookings(ctx.user.id);
    }),
    getListingBookings: protectedProcedure.input(z.number()).query(async ({ ctx, input }) => {
      const listing = await getListingById(input);
      if (!listing || listing.hostId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }
      return getListingBookings(input);
    }),
  }),

  payment: router({
    createCheckout: protectedProcedure
      .input(z.object({
        listingId: z.number(),
        quantity: z.number().int().positive(),
      }))
      .mutation(async ({ ctx, input }) => {
        const listing = await getListingById(input.listingId);
        if (!listing) throw new Error("Listing not found");
        if (listing.status !== "active") throw new Error("Listing is not active");
        if (listing.capacity < input.quantity) throw new Error("Not enough capacity");

        const totalCents = listing.ticketPriceCents * input.quantity;
        const commissionCents = Math.round(totalCents * 0.1);
        const hostPayoutCents = totalCents - commissionCents;

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: listing.title,
                },
                unit_amount: listing.ticketPriceCents,
              },
              quantity: input.quantity,
            },
          ],
          mode: "payment",
          success_url: `${ctx.req.headers.origin}/bookings?success=true`,
          cancel_url: `${ctx.req.headers.origin}/listings/${input.listingId}`,
          customer_email: ctx.user.email || undefined,
          metadata: {
            userId: ctx.user.id.toString(),
            listingId: input.listingId.toString(),
            quantity: input.quantity.toString(),
            totalCents: totalCents.toString(),
            commissionCents: commissionCents.toString(),
            hostPayoutCents: hostPayoutCents.toString(),
          },
        });

        return { checkoutUrl: session.url };
      }),
  }),

  analytics: router({
    getHostStats: protectedProcedure.query(async ({ ctx }) => {
      return getHostListingStats(ctx.user.id);
    }),
  }),

  bookingDetails: router({
    getGuestBookingDetails: protectedProcedure.query(async ({ ctx }) => {
      return getGuestBookingDetails(ctx.user.id);
    }),
  }),
});

export type AppRouter = typeof appRouter;
