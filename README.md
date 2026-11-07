# Loretto Central School admissions

A school admissions website and enquiry dashboard designed for Cloudflare Workers, D1, and Clerk Google sign-in. The current school copy and imagery are starter content; replace it with school-approved facilities, syllabus, activities, dates, and admission rules before launch.

## What is included

- Home page with an admission poster modal, school overview, facilities, and activities.
- Admission overview page with process and policy copy managed through the admin content editor.
- Google sign-in gate for parents and staff, through Clerk.
- Enquiry form for student, parent, class, new/transfer admission, previous school, address, religion, and an optional Aadhaar number.
- Staff dashboard at `/admin` with enquiry list, contact details, status updates, and a content manager for school identity, page copy, images, facilities, activities, gallery, admission rules, form labels and options, poster, footer, and dashboard labels.
- Worker API and D1 migrations. Website content loads from the `site_content` table in D1; migration `0002_seed_settings.sql` seeds the starter content document. Staff edits replace that document through the admin API. Aadhaar is validated in transit but only its final four digits are saved.

## Local setup

1. Install Node.js 20 or newer, then run `npm install`.
2. Create a Clerk development application and enable Google as a social connection. Copy `.env.example` to `.env.local` and set `VITE_CLERK_PUBLISHABLE_KEY` to that instance’s publishable key.
3. Copy `.dev.vars.example` to `.dev.vars`, then set the Clerk issuer and secret key from the same Clerk instance:

   ```
   CLERK_ISSUER=https://your-clerk-domain.clerk.accounts.dev
   CLERK_SECRET_KEY=sk_test_...
   CLERK_AUTHORIZED_PARTIES=http://localhost:5173,https://admission.lorettocentralschool.edu.in
   ADMIN_EMAILS=admissions@lorettocentralschool.edu.in
   ```

4. Create a D1 database, copy its ID into `wrangler.jsonc`, and apply the schema with `npx wrangler d1 migrations apply loretto-admissions --local`.
5. Run `npm run dev` for the frontend. For the Worker and D1 together, build first and use `npx wrangler dev`.

## Cloudflare deployment

1. The production D1 database ID and custom domain are configured in `wrangler.jsonc`. For a new account, create a database with `npx wrangler d1 create loretto-admissions` and replace the ID there.
2. Create a Clerk production instance, enable Google sign-in, and configure your Google OAuth credentials. Set the production secret with `npx wrangler secret put CLERK_SECRET_KEY`; set `CLERK_ISSUER`, `CLERK_AUTHORIZED_PARTIES`, and `ADMIN_EMAILS` as Worker variables. The issuer must exactly match the `iss` claim from this Clerk instance, and authorized parties must include the app origin.
3. Apply the production migration: `npx wrangler d1 migrations apply loretto-admissions --remote`.
4. Build and deploy with the production publishable key available at build time (for example, `VITE_CLERK_PUBLISHABLE_KEY=pk_live_... npm run deploy`), then add `admission.lorettocentralschool.edu.in` as the Worker custom domain in Cloudflare. The school's DNS zone must be active on Cloudflare.
5. In Clerk production settings, add/verify the custom domain and configure the Google OAuth authorized redirect URI shown by Clerk. Set the production publishable key in `.env.local` before building. Production Google sign-in needs custom Google OAuth credentials, and Google's OAuth consent screen must be in production before the public can sign in.

The public pages are ready for content review. The admin panel can edit the website copy and school details listed above. The promotional poster illustration is CSS artwork, and all initial school details are starter copy; replace these with school-approved facts and images before launch.

## Identity and access

Set `ADMIN_EMAILS` to a comma-separated list of staff email addresses. A signed-in user whose verified primary email matches this list can use the dashboard. Keep the Clerk secret key out of source control. The dashboard and API should only be enabled after a staff member has verified the allowlist and production Clerk configuration.
