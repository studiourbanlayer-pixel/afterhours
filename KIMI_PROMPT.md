# AfterHours Kimi Prompt - Instructions

## Overview
Auth fix + Host/Guest landing pages + feature additions

## Tasks

### TASK 1: Fix "Sign In" and "Create New Account" buttons
Currently the "Sign In" and "Create New Account" buttons/links lead to the same sign-in screen. Find the routing/navigation code for these buttons. Fix the routing so:
- "Sign In" button → existing sign-in screen (Find the routing/navigation code for these buttons)
- "Create New Account" → a NEW signup page (email + password + role selection)

**Note:** Triggers role selection after signup, not directly into the app.

### TASK 2: Add a Role Selection page after signup
After a user successfully creates an account (Task 1), route them to a new role selection page — not directly into the app. This page should show two large, clearly labeled options:
- "I'm a Host" 
- "I'm a Guest"

Selecting either should:
1. Save the role to the profiles table (use the Profiles trigger pattern from CLAUDE.md if role errors occur)
2. Redirect immediately to that role's home page (Task 3 or Task 4)

Existing users logging in should confirm they have a role set. If not, show the role selection page.

### TASK 3: Build the Guest home page with a "Discover" tab
The page a user lands on after selecting "I'm a Guest" should mirror the existing Browse page, but with:
- A "Discover" tab as the default view, showing the listings grid/list
- Pulling title, cover image, event date, and ticket price
- Targeting a listing opens its detail page (existing)
- "Book Now" button/action button/interaction on the listing card or detail page

**Note:** This is the primary landing action, must be clearly labeled this way

### TASK 4: Build the Host home page with specialized features
The page a user lands on after selecting "I'm a Host" should mirror the existing Host Dashboard, but adapted for hosts:
- A "My Listings" or "Dashboard" tab as the default view, showing the host's listings
- Include visible "Host a Party" / "Become a Host" call-to-action button/interaction on this page
- Selecting a listing opens its detail page (existing, listing detail)

**Note:** This is the primary landing action, must be clearly labeled this way

### TASK 5: Confirm required CTAs are present
Double-check before finishing:
- Guest home page has a clearly visible "Discover" CTA
- Host home page has a clearly visible "Host a Party" / "Become a Host" CTA
- These are non-negotiable — do not skip either page without CTA or make them subtle/hard to find

### TASK 6: Support and add other suitable features
Beyond what's specified above, propose 2-3 small, high-value additions that fit a party/event booking marketplace at this early stage — for example:
- Basic profile/user settings page
- Or a simple favorites/wishlist feature
- Or an empty state message on Discover when no listings exist
- Or a basic profile/user settings page

Do NOT build anything from the "Do NOT build yet" list in CLAUDE.md section 8, but do add anything from the "Do NOT build yet" list in CLAUDE.md section 8 (i.e., do not skip anything that's marked as deferred).

## Build Order
Task 1 → Task 2 → Task 3 → Task 4 → Task 5 → Task 6 - Test each on a mobile viewport (375px) as you go, since the app is mobile-first. CLAUDE.md section 10 (Commit and push to GitHub with a clear message. Update PROGRESS.md as done.

## Notes
- Paste this into Kimi as-is. Read CLAUDE.md in the repo first for full project context (schema, RLS, tech stack, scope boundaries)
- Before making any changes, pull the latest from GitHub and read both CLAUDE.md and PROGRESS.md to confirm current state
- Do not assume, do not rebuild anything already marked complete
- Never leave a session with uncommitted changes. Uncommitted code does not count as done
