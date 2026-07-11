# AfterHours MVP TODO

## Database & Backend
- [x] Update schema: profiles table with role field
- [x] Create listings table
- [x] Create bookings table
- [x] Run migrations via webdev_execute_sql
- [x] Add Stripe integration
- [x] Add database helper functions
- [x] Create tRPC procedures for all core features
- [x] Add analytics queries for host stats and guest booking details
- [x] Stripe webhook handler for payment confirmation

## Authentication & Onboarding
- [x] Build role selection flow on first login
- [x] Update profile with selected role (host/guest)
- [x] Redirect to role-specific dashboard after onboarding

## Host Features
- [x] Create listing form (title, description, venue, date, capacity, price)
- [ ] S3 image upload integration (form accepts URL only for MVP)
- [ ] Edit listing form
- [x] Soft-delete/cancel listing (status field)
- [x] Host dashboard with booking counts, revenue, event dates
- [x] Host analytics: aggregated revenue and booking stats

## Guest Features
- [x] Browse page: grid/list of active listings
- [x] Search bar (free-text search on title/description)
- [x] Listing detail page with full info
- [x] Sticky "Book Now" CTA on detail page
- [x] Guest dashboard: list own bookings with event details

## Booking & Payments
- [x] Booking form: quantity selection
- [x] Display totals: price × qty, 10% commission, host payout
- [x] Stripe checkout session creation
- [x] Record booking with commission split
- [x] Guest dashboard: list own bookings with event details
- [x] Stripe webhook handler for payment confirmation

## Navigation & Layout
- [x] Mobile-first responsive design
- [x] Bottom tab navigation (mobile): Browse, Dashboard, Profile
- [x] Desktop sidebar navigation (1024px+)
- [x] Two-column layout on desktop listing detail
- [x] Single-column stacked layout on mobile
- [x] Profile page with logout

## Polish & Testing
- [x] Vitest unit tests for core procedures (19/19 passing - auth, listings, profile, bookings, payment, analytics)
- [x] Visual verification across mobile/desktop (mobile 375x812 and desktop 1280x720 verified)
- [x] Responsive layout: bottom tabs (mobile), sidebar nav (desktop 1024px+)
- [ ] Error handling and edge cases
- [ ] Performance optimization
