Implement a workflow: Customer signup

Steps (in order):
  1. Account   — route /auth/signup: Name*, Email*, Password*
                 (Zod: valid email, password >= 8). Primary "Create account".
  2. Verify    — route /auth/verify: 6-digit code + "Resend". On success -> step 3.
  3. Company   — route /onboarding: full-page RecordForm, fields
                 Company name*, Domain, Country, Size. Primary "Finish".
  4. Done      — redirect to /dashboard with a welcome toast.
Entry point:       "Sign up" link on /auth/signin.
Success end state: a Customer + Organization record created; land on /dashboard.
Back / cancel:     Back returns to the previous step keeping input;
                   Cancel returns to /auth/signin.
Errors:            inline field errors; a failed verify keeps the code screen.
Data model:        Customer { name, email }, Organization { name, domain,
                   country, size }.
Building blocks:   AuthCard for steps 1-2 (copy app/_components/auth.tsx),
                   RecordForm formMode="page" for step 3.

Test scenarios (happy / unhappy):
  TC-1  Valid signup through all 3 steps    -> Customer + Organization created, land on /dashboard
  TC-2  Step 1 invalid email / short password -> inline errors, Next blocked
  TC-3  Step 2 wrong verify code             -> error, stays on code screen
  TC-4  Step 3 missing Company name          -> inline error, Finish blocked
  TC-5  Back from step 2 -> step 1           -> account input preserved
  TC-6  Cancel at any step                   -> returns to /auth/signin, nothing created

Done when: every step has loading/error/success, Zod validation, the scenarios
above pass, tokens, light + dark, a11y, lint + types + build pass.
