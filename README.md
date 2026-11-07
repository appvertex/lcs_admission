# Loretto Central School admissions

A school admissions website and enquiry dashboard designed for Cloudflare Workers, D1, and Clerk Google sign-in. The current school copy and imagery are starter content; replace it with school-approved facilities, syllabus, activities, dates, and admission rules before launch.

## What is included

- Home page with an admission poster modal, school overview, facilities, and activities.
- Admission overview page with an editable-in-code process and policy copy.
- Google sign-in gate for parents and staff, through Clerk.
- Enquiry form for student, parent, class, new/transfer admission, previous school, address, religion, and an optional Aadhaar number.
- Staff dashboard at `/admin` with enquiry list, contact details, status updates, and website content editing for the promotion text, facilities, activities, syllabus note, admission steps, and overview notes.
- Worker API and D1 migration. Aadhaar is validated in transit but only its final four digits are saved.

## Local setup

1. Install Node.js 20 or newer, then run `npm install`.
2. Create a Clerk application and enable Google as a social connection. Set `VITE_CLERK_PUBLISHABLE_KEY` in `.env.local`.
3. Set the Clerk issuer and secret key in `.dev.vars`:

   ```
   CLERK_ISSUER=https://your-clerk-domain.clerk.accounts.dev
   CLERK_SECRET_KEY=sk_test_...
   ADMIN_EMAILS=admissions@lorettocentralschool.edu.in
   ```

4. Create a D1 database, copy its ID into `wrangler.jsonc`, and apply the schema with `npx wrangler d1 migrations apply loretto-admissions --local`.
5. Run `npm run dev` for the frontend. For the Worker and D1 together, build first and use `npx wrangler dev`.

## Cloudflare deployment

1. Create the D1 database: `npx wrangler d1 create loretto-admissions`, then put its returned ID into `wrangler.jsonc`.
2. Set production values with `npx wrangler secret put CLERK_SECRET_KEY`; set `CLERK_ISSUER` and `ADMIN_EMAILS` as Worker variables.
3. Apply the production migration: `npx wrangler d1 migrations apply loretto-admissions --remote`.
4. Build and deploy with the production publishable key available at build time (for example, `VITE_CLERK_PUBLISHABLE_KEY=pk_live_... npm run deploy`), then add `admission.lorettocentralschool.edu.in` as the Worker custom domain in Cloudflare. The school's DNS zone must be active on Cloudflare.
5. In Clerk production settings, add the custom domain and configure the Google OAuth authorized redirect URI shown by Clerk. Production Google sign-in needs custom Google OAuth credentials, and Google's OAuth consent screen must be in production before the public can sign in.

The public pages are ready for content review. The admin panel can edit the website copy and school details listed above. The promotional poster illustration is CSS artwork, and all initial school details are starter copy; replace these with school-approved facts and images before launch.

## Identity and access

Set `ADMIN_EMAILS` to a comma-separated list of staff email addresses. A signed-in user whose verified primary email matches this list can use the dashboard. Keep the Clerk secret key out of source control. The dashboard and API should only be enabled after a staff member has verified the allowlist and production Clerk configuration.
