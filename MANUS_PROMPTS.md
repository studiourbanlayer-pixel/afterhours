# AfterHours Manus Prompts

## Prompt 1: Fix "Failed to set up role"

**Issue:** The app shows "Failed to set up role" when a user selects Host or Guest after signing in. Debug this properly - don't guess.

**Debugging Steps:**

1. Find the relevant code after role selection - it should call `setRole` procedure
2. Check these causes in order, using browser console AND backend logs (not just the error message) to confirm which one is actually happening:

   a) **EMAIL CONFIRMATION REQUIRED:** If Supabase's "Confirm email" policy is enabled, the profile insert rows before there's an authenticated user, and the RLS check fails.
   
   b) **RLS POLICY MISMATCH:** Confirm the "users can insert own profile" policy on profiles table. Does it match exactly: `auth.uid() = user_id`? If fails.
   
   c) **MISSING SESSION AFTER SIGNUP:** Confirm the code uses the session returned directly from signup(), not one it assumes exists later.
   
   d) **ROLE VALUE MISMATCH:** Confirm the inserted role value is exactly 'host' / 'guest' - not a different label from a dropdown component.

3. **OPTIONAL IMPROVEMENTS (if time permits):**
   - Replace function public.handle_new_user() with a trigger that auto-creates the profile row when a new auth user begins signup; passing role as available during signup.
   - This removes the timing issue entirely.

4. Test the full flow yourself: sign up a new test user, select a role, confirm the profiles row is created with no error.

5. Commit and push to GitHub with a clear message: Update PROGRESS.md.

---

## Prompt 2: Build the Host Listing CRUD Flow

**Run this only after Prompt 1 is confirmed fixed and committed.**

Now that role setup works, build the Host listing CRUD flow exactly per CLAUDE.md section B: tRPC Listing Fare (title, description, venue address, event date, capacity, ticket price, cover image URL). Test the full flow with a real test account before committing. Commit and update PROGRESS.md as done.
