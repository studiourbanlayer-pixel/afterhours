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
- [x] S3 image upload integration (Phase 2 - drag-drop UI, file validation)
- [x] Edit listing form (Phase 2 - full form with S3 upload)
- [x] Soft-delete/cancel listing (status field)
- [x] Host dashboard with booking counts, revenue, event dates
- [x] Host analytics: aggregated revenue and booking stats

## Guest Features
- [x] Browse page: grid/list of active listings
- [x] Search bar (free-text search on title/description)
- [x] Listing detail page with full info
- [x] Sticky "Book Now" CTA on detail page
- [x] Guest dashboard: list own bookings with event details
- [x] Advanced filters (Phase 2 - date range, max price)

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
- [x] Error handling and edge cases (error utilities, toast notifications, validation, error boundaries)
- [x] Toast notifications wired into: onboarding, create listing, logout, browse page errors
- [x] Prompt 1: Fixed "Failed to set up role" bug - auth routing fixed
- [x] Prompt 2: Host Listing CRUD Flow tested and working
- [ ] Performance optimization (Phase 2 - bundle size, query optimization)


## Kimi Prompt - Auth Fix & Feature Additions

### TASK 1: Fix Role Setup Bug
- [ ] Debug "Failed to set up role" error when selecting Host/Guest
- [ ] Check RLS policies on profiles table
- [ ] Verify role enum values match (host/guest)
- [ ] Test with real user account

### TASK 2: Create Signup Page
- [ ] Build signup form with email, password, confirm password
- [ ] Add password validation (min 8 chars, complexity)
- [ ] Route to role selection after signup
- [ ] Integrate with Manus auth system

### TASK 3: Guest Landing Page
- [ ] Create guest home page with "Discover" tab
- [ ] Show listings grid with title, image, date, price
- [ ] Add "Discover" CTA button
- [ ] Link to listing detail page

### TASK 4: Host Landing Page
- [ ] Create host home page with "My Listings" tab
- [ ] Show host's listings with management options
- [ ] Add "Host a Party" CTA button
- [ ] Link to create listing page

### TASK 5: High-Value Features
- [ ] Profile settings page (edit name, email, preferences)
- [ ] Favorites/wishlist feature for guests
- [ ] Empty state messages on Discover page
- [ ] User profile avatar/initials

### TASK 6: Testing & Deployment
- [ ] Test on mobile viewport (375px)
- [ ] Verify all CTAs are visible and working
- [ ] Test role selection flow end-to-end
- [ ] Push all commits to GitHub
- [ ] Update PROGRESS.md
