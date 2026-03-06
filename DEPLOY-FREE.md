# Deploy for free (Vercel)

**No credit card. No domain.** You get a URL like `https://testgym2.vercel.app`.

---

## Steps

1. **Push your code to GitHub** (if you haven’t already)
   - Create a repo at [github.com/new](https://github.com/new), then:
   ```bash
   cd /Users/eitanlitvin/testVibe/testgym2
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Sign up at Vercel**  
   [vercel.com](https://vercel.com) → Sign up (use GitHub so it can see your repo).

3. **Import the project**
   - **Add New** → **Project** → choose your GitHub repo (e.g. `testgym2`).
   - Leave framework as **Next.js** (auto-detected). Click **Deploy**.

4. **Add Clerk env vars**
   - After the first deploy, go to the project → **Settings** → **Environment Variables**.
   - Add:
     - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` = your Clerk publishable key
     - `CLERK_SECRET_KEY` = your Clerk secret key  
   - Use **Production** keys from [dashboard.clerk.com](https://dashboard.clerk.com) (or test keys to try it out).
   - Click **Save**, then **Deployments** → open the ⋮ on the latest → **Redeploy** so the new env vars are used.

5. **Allow the URL in Clerk**  
   In Clerk Dashboard → your app → **Paths** / **Settings** → add your Vercel URL (e.g. `https://testgym2.vercel.app`) to **Allowed redirect URLs** and **Allowed origins**.

6. **Open your site**  
   Your live URL is on the Vercel project page (e.g. `https://testgym2.vercel.app`). Open it in Chrome.

---

**Summary:** GitHub → Vercel → import repo → add Clerk env vars → redeploy → add URL in Clerk. No payment, no domain.
