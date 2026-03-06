# Deploy to Google Cloud (Cloud Run)

You get a **free URL** like `https://testgym2-xxxxx.run.app` — **no domain purchase needed.**

---

## Quick deploy (short steps, no domain)

1. **Install gcloud**  
   [cloud.google.com/sdk/docs/install](https://cloud.google.com/sdk/docs/install)

2. **Sign in and create a project**
   ```bash
   gcloud auth login
   gcloud projects create iron-fitness-app --name "Iron Fitness"
   gcloud config set project iron-fitness-app
   ```

3. **Turn on billing** (one-time)  
   [console.cloud.google.com/billing](https://console.cloud.google.com/billing) → link a billing account to the project. (Cloud Run has a free tier; you may not be charged for light use.)

4. **Enable APIs**
   ```bash
   gcloud services enable run.googleapis.com artifactregistry.googleapis.com
   ```

5. **Deploy** (from your project folder, replace the keys with your Clerk keys)
   ```bash
   cd /Users/eitanlitvin/testVibe/testgym2

   gcloud run deploy testgym2 \
     --source . \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_YOUR_KEY,CLERK_SECRET_KEY=sk_live_YOUR_KEY"
   ```

6. **Copy the URL** the CLI prints (e.g. `https://testgym2-xxxxx-uc.a.run.app`). That’s your live site — no domain needed.

7. **In Clerk**  
   [dashboard.clerk.com](https://dashboard.clerk.com) → your app → **Paths** / **Settings** → add that URL to **Allowed redirect URLs** and **Allowed origins**. Use your **Production** keys in the deploy command above (or keep test keys for a quick test).

Done. Open the URL in Chrome to use the app.

---

## Prerequisites (detailed)

1. **Google Cloud account** – [console.cloud.google.com](https://console.cloud.google.com)
2. **gcloud CLI** – [Install](https://cloud.google.com/sdk/docs/install), then sign in:
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

## One-time setup

1. **Create a project** (or pick an existing one):
   ```bash
   gcloud projects create YOUR_PROJECT_ID --name "Iron Fitness"
   gcloud config set project YOUR_PROJECT_ID
   ```

2. **Enable required APIs**:
   ```bash
   gcloud services enable run.googleapis.com
   gcloud services enable artifactregistry.googleapis.com
   ```

3. **Clerk (production)**  
   In [Clerk Dashboard](https://dashboard.clerk.com), create a **Production** application and add your Cloud Run URL to **Allowed redirect/origin URLs**. Use the **production** publishable and secret keys in the step below.

## Deploy

From the project root (where `Dockerfile` and `package.json` are):

```bash
gcloud run deploy testgym2 \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...,CLERK_SECRET_KEY=sk_live_..."
```

- Replace `pk_live_...` and `sk_live_...` with your **Clerk production** keys (or test keys for a staging deploy).
- Change `--region` if you want (e.g. `europe-west1`).
- After deploy, the CLI prints the service URL, e.g. `https://testgym2-xxxxx-uc.a.run.app`.

## Setting secrets (recommended for production)

Avoid putting keys in the command line. Use Secret Manager and reference them in Cloud Run:

1. **Create secrets** (one-time):
   ```bash
   echo -n "pk_live_YOUR_KEY" | gcloud secrets create clerk-publishable-key --data-file=-
   echo -n "sk_live_YOUR_KEY" | gcloud secrets create clerk-secret-key --data-file=-
   ```

2. **Deploy with secrets**:
   ```bash
   gcloud run deploy testgym2 \
     --source . \
     --region us-central1 \
     --allow-unauthenticated \
     --set-secrets "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=clerk-publishable-key:latest,CLERK_SECRET_KEY=clerk-secret-key:latest"
   ```

(Your Cloud Run service account needs `roles/secretmanager.secretAccessor` on these secrets.)

## After deploy

1. Open the Cloud Run URL in the browser.
2. In Clerk Dashboard, add that URL to **Allowed redirect URLs** and **Allowed origins** (e.g. `https://testgym2-xxxxx-uc.a.run.app`).
3. Sign in or sign up and test plan, schedule, and profile.

## Useful commands

| Command | Purpose |
|--------|--------|
| `gcloud run services describe testgym2 --region us-central1` | Service URL and status |
| `gcloud run services logs read testgym2 --region us-central1` | View logs |
| `gcloud run deploy testgym2 --source . --region us-central1` | Redeploy (same env/secrets) |
