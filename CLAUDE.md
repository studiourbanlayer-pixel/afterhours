# AfterHours Build Specifications

## Project Overview

**AfterHours** is a mobile-first event ticketing marketplace where hosts can list events and guests can discover, book, and pay for tickets. The platform automatically handles a 10% commission via Stripe, with the remaining 90% going to the host.

## Architecture

- **Frontend:** React 19 + Tailwind CSS 4 + Wouter routing
- **Backend:** Express 4 + tRPC 11 + Drizzle ORM
- **Database:** MySQL/TiDB with Drizzle migrations
- **Payments:** Stripe (test mode with webhook handling)
- **Auth:** Manus OAuth with role-based profiles (host/guest)
- **Storage:** S3 for cover images (pending implementation)

## Database Schema

### profiles
- userId (int, PK)
- platformRole (enum: 'host' | 'guest')
- stripeAccountId (varchar, nullable)
- createdAt, updatedAt (timestamps)

### listings
- id (int, PK, autoincrement)
- hostId (int, FK → users.id)
- title (text)
- description (text, nullable)
- venueAddress (varchar, nullable)
- eventDate (timestamp)
- capacity (int)
- ticketPriceCents (int)
- coverImageUrl (varchar, nullable)
- status (enum: 'active' | 'cancelled')
- createdAt, updatedAt (timestamps)

### bookings
- id (int, PK, autoincrement)
- listingId (int, FK → listings.id)
- guestId (int, FK → users.id)
- quantity (int)
- totalAmountCents (int)
- commissionCents (int, 10% of total)
- hostPayoutCents (int, 90% of total)
- stripePaymentIntentId (varchar)
- status (enum: 'pending' | 'confirmed' | 'failed')
- createdAt, updatedAt (timestamps)

## Feature Checklist

### Phase 1: Core MVP (✅ COMPLETE)
- [x] Role-based onboarding (host/guest selection)
- [x] Host listing creation form
- [x] Guest browse page with search
- [x] Listing detail page with booking CTA
- [x] Booking form with quantity selection
- [x] Stripe checkout session creation
- [x] Stripe webhook handler for payment confirmation
- [x] Host dashboard with analytics
- [x] Guest dashboard with booking history
- [x] Mobile-first responsive UI
- [x] Bottom tab nav (mobile) + sidebar nav (desktop)
- [x] Profile page with logout

### Phase 2: Polish & Advanced Features (🔧 IN PROGRESS)
- [ ] S3 image upload integration
- [ ] Edit listing form (backend ready, UI pending)
- [ ] Date range filters on browse page
- [ ] Category filters
- [ ] Unit tests with Vitest
- [ ] Error handling improvements
- [ ] Loading states and skeletons
- [ ] Toast notifications for all actions
- [ ] Mobile responsiveness testing
- [ ] Performance optimization

### Phase 3: Production Ready (⏭️ NEXT)
- [ ] Authorization checks (deferred per requirements)
- [ ] Rate limiting
- [ ] Input validation & sanitization
- [ ] Stripe live mode setup
- [ ] Email notifications
- [ ] Refund handling
- [ ] Admin dashboard

## File Structure

```
/afterhours
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx (role-based router)
│   │   │   ├── Onboarding.tsx (role selection)
│   │   │   ├── BrowsePage.tsx (guest listings)
│   │   │   ├── ListingDetail.tsx (booking page)
│   │   │   ├── CreateListing.tsx (host form)
│   │   │   ├── HostDashboard.tsx (host analytics)
│   │   │   ├── GuestDashboard.tsx (guest bookings)
│   │   │   ├── ProfilePage.tsx (user profile)
│   │   ├── components/ (UI components)
│   │   ├── lib/trpc.ts (tRPC client)
│   │   ├── App.tsx (routing & navigation)
│   │   ├── index.css (global styles)
│   ├── index.html
│   ├── vite.config.ts
├── server/
│   ├── routers.ts (tRPC procedures)
│   ├── db.ts (database queries)
│   ├── db.analytics.ts (aggregation queries)
│   ├── webhooks.ts (Stripe webhook handler)
│   ├── listings.test.ts (unit tests)
│   ├── _core/ (framework internals)
├── drizzle/
│   ├── schema.ts (database tables)
│   ├── migrations/ (SQL migrations)
├── shared/
│   ├── const.ts (constants)
│   ├── types.ts (shared types)
├── CLAUDE.md (this file)
├── PROGRESS.md (status tracking)
├── todo.md (task checklist)
├── package.json
├── tsconfig.json
├── vite.config.ts
```

## Workflow Rules

1. **Before starting each session:** Pull latest from GitHub, read PROGRESS.md and this file
2. **After each feature:** Commit immediately with clear message (e.g., "Add host listing creation form")
3. **Update PROGRESS.md** after every commit with current status
4. **Never leave uncommitted changes** — commit working code first, then report blockers
5. **Authorization is deferred** — focus on core features first, auth checks come later

## Key Procedures (tRPC)

### Auth
- `auth.me` - Get current user
- `auth.logout` - Clear session

### Profile
- `profile.getOrCreate` - Get or create user profile
- `profile.updateRole` - Set platformRole (host/guest)

### Listings
- `listings.create` - Create new listing (host only)
- `listings.getActive` - Get all active listings (public)
- `listings.getById` - Get listing by ID (public)
- `listings.getHostListings` - Get user's listings (host only)
- `listings.cancel` - Soft-delete listing (host only)

### Bookings
- `bookings.getGuestBookings` - Get user's bookings (guest only)
- `bookingDetails.getGuestBookingDetails` - Get bookings with event details

### Analytics
- `analytics.getHostStats` - Get aggregated stats (host only)

### Payments
- `payment.createCheckout` - Create Stripe checkout session

## Testing

Run tests:
```bash
pnpm test
```

Test Stripe payments with card: `4242 4242 4242 4242`

## Deployment

- Dev: `pnpm dev` (Vite + Express)
- Build: `pnpm build` (Vite + esbuild)
- Start: `pnpm start` (production)

## Notes

- All prices stored in cents (multiply by 100)
- All timestamps stored as UTC
- Commission is exactly 10% of total, rounded to nearest cent
- Stripe test mode only (live keys pending KYC)
- S3 integration pending (currently accepts URL only)
