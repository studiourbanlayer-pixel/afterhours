# AfterHours Implementation Plan - Consolidated

## Issue 1: "Failed to set up role" Bug

**Root Cause:** Session cookie not properly set after OAuth login, causing `setRole` protected procedure to fail with "Please login (10001)" error.

**Solution:** Add auth check in RoleSelectionPage and retry logic with delay.

**Files to modify:**
- `client/src/pages/RoleSelectionPage.tsx` - Add useAuth hook, check user exists, add retry logic
- `client/src/pages/Home.tsx` - Redirect to role selection if user has no role

## Issue 2: Bland UI After Login

**Current State:** Home page just shows role-based routing without proper landing pages.

**Solution:** Build proper guest/host landing pages with CTAs and features.

## Kimi Prompt Tasks

### TASK 1: Fix Sign In / Create Account Flow
- LoginPage buttons should use startLogin() ✅ (Already fixed)
- Create separate signup page with email/password form
- Route signup → role selection → home page

### TASK 2: Role Selection Page
- Already exists, but needs auth check fix
- Add loading state and retry logic
- Ensure role is persisted correctly

### TASK 3: Guest Landing Page
- Create guest home with "Discover" tab
- Show listings grid with title, image, date, price
- Add prominent "Discover" CTA button

### TASK 4: Host Landing Page
- Create host home with "My Listings" tab
- Show host's listings with management options
- Add prominent "Host a Party" CTA button

### TASK 5: High-Value Features
- Profile settings page (edit name, email)
- Favorites/wishlist for guests
- Empty state messages
- User avatar/initials

### TASK 6: Testing & Deployment
- Test on mobile (375px)
- Verify all CTAs visible
- Push all commits to GitHub
- Update PROGRESS.md

## Implementation Order

1. Fix role setup bug (RoleSelectionPage auth check + retry)
2. Create signup page
3. Build guest landing page with Discover tab
4. Build host landing page with Host a Party CTA
5. Add high-value features (profile, favorites, empty states)
6. Test and push to GitHub

## Key Files

**Frontend:**
- `client/src/pages/RoleSelectionPage.tsx` - Fix auth check
- `client/src/pages/SignupPage.tsx` - NEW
- `client/src/pages/GuestHome.tsx` - NEW (Discover tab)
- `client/src/pages/HostHome.tsx` - NEW (My Listings tab)
- `client/src/pages/ProfileSettings.tsx` - NEW
- `client/src/App.tsx` - Update routing

**Backend:**
- No changes needed (existing procedures work)

**Database:**
- No schema changes needed

## Commit Strategy

- Commit 1: Fix role setup bug + auth check
- Commit 2: Add signup page + routing
- Commit 3: Build guest landing page with Discover tab
- Commit 4: Build host landing page with Host a Party CTA
- Commit 5: Add profile settings and favorites
- Commit 6: Final testing and polish
