# Google OAuth Setup Guide for MenuFlow

## Quick Fix for the Error

The error `"Unsupported provider: provider is not enabled"` means Google OAuth is not yet enabled in your Supabase project. Follow these steps to fix it:

---

## Step 1: Get Your Supabase Callback URL

You need your Supabase project's callback URL. It follows this format:

```
https://[YOUR_PROJECT_REF].supabase.co/auth/v1/callback
```

### How to find it:

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your MenuFlow project
3. Go to **Settings** (gear icon in sidebar)
4. Go to **API** section
5. Look for **URL** - it will be something like `https://abcdefghijk.supabase.co`
6. Your callback URL is: `https://abcdefghijk.supabase.co/auth/v1/callback`

**Write it down - you'll need it in Step 2!**

---

## Step 2: Create Google OAuth Credentials

### 2.1 Go to Google Cloud Console

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account

### 2.2 Create or Select a Project

1. Click the project dropdown at the top
2. Click **"New Project"**
3. Name it "MenuFlow" (or any name you like)
4. Click **Create**
5. Wait for it to be created, then select it

### 2.3 Enable Google+ API

1. In the left sidebar, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"**
3. Click on it and click **"Enable"**

### 2.4 Configure OAuth Consent Screen

1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Select **"External"** (unless you have a Google Workspace)
3. Click **Create**
4. Fill in the required fields:
   - **App name:** MenuFlow
   - **User support email:** Your email
   - **Developer contact email:** Your email
5. Click **"Save and Continue"**
6. On "Scopes" page, click **"Save and Continue"**
7. On "Test users" page, you can add your email as a test user
8. Click **"Save and Continue"**
9. Click **"Back to Dashboard"**

### 2.5 Create OAuth Client ID

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** at the top
3. Select **"OAuth client ID"**
4. Choose **"Web application"**
5. Name it: "MenuFlow Web"
6. Under **"Authorized JavaScript origins"**, add:
   ```
   http://localhost:5173
   https://your-production-domain.com (if you have one)
   ```
7. Under **"Authorized redirect URIs"**, add:
   ```
   https://[YOUR_PROJECT_REF].supabase.co/auth/v1/callback
   ```
   ⚠️ **Use the exact URL from Step 1!**

8. Click **"Create"**
9. A dialog will appear with your credentials:
   - **Client ID** (looks like: `123456789-abc123.apps.googleusercontent.com`)
   - **Client Secret** (looks like: `GOCSPX-abc123xyz`)
   
   **📋 Copy both of these - you need them for Step 3!**

---

## Step 3: Enable Google in Supabase

### 3.1 Go to Supabase Authentication Settings

1. Open [Supabase Dashboard](https://app.supabase.com/)
2. Select your MenuFlow project
3. In the left sidebar, click **"Authentication"**
4. Click **"Providers"**

### 3.2 Enable Google Provider

1. Scroll down to find **"Google"**
2. Toggle the switch to **ON** (it should turn green)
3. You'll see fields appear:
   - **Client ID (for OAuth):** Paste the Client ID from Step 2
   - **Client Secret (for OAuth):** Paste the Client Secret from Step 2
4. Click **"Save"**

---

## Step 4: Test It Out

1. Go to your MenuFlow app at `/login`
2. Click the **"Continue with Google"** button
3. You should be redirected to Google's login page
4. Log in with your Google account
5. You'll be asked to authorize MenuFlow
6. After authorizing, you'll be redirected back to your app at `/dashboard`

✅ **Success!** You're now logged in with Google!

---

## Troubleshooting

### Error: "redirect_uri_mismatch"

**Problem:** The redirect URI doesn't match what's configured in Google Cloud Console.

**Solution:**
1. Go back to Google Cloud Console → Credentials
2. Edit your OAuth Client ID
3. Make sure the redirect URI **exactly** matches your Supabase callback URL
4. Save and try again

### Error: "Access blocked: This app's request is invalid"

**Problem:** OAuth consent screen not configured properly.

**Solution:**
1. Go to Google Cloud Console → OAuth consent screen
2. Complete all required fields
3. Add your email as a test user
4. Try again

### Google button doesn't work

**Problem:** Environment variables might not be set up.

**Solution:**
Check that your `.env` file has:
```env
SUPABASE_PROJECT_URL=https://your-project.supabase.co
SUPABASE_API_KEY=your-anon-key
```

### Still getting "provider is not enabled"

**Problem:** Google provider is not enabled in Supabase.

**Solution:**
1. Double-check Step 3 - make sure the Google toggle is ON and green
2. Make sure you clicked "Save" after entering credentials
3. Try refreshing your app
4. Clear your browser cache

---

## Production Deployment

When you deploy your app to production:

1. **Update Google OAuth Client:**
   - Go to Google Cloud Console → Credentials
   - Edit your OAuth Client ID
   - Add your production domain to "Authorized JavaScript origins"
   - Example: `https://menuflow.com`

2. **Keep the same Supabase callback URL** - it doesn't change

3. **Update environment variables** in your hosting platform

---

## Summary Checklist

- [ ] Got Supabase callback URL
- [ ] Created Google Cloud project
- [ ] Enabled Google+ API
- [ ] Configured OAuth consent screen
- [ ] Created OAuth Client ID with correct redirect URI
- [ ] Copied Client ID and Client Secret
- [ ] Enabled Google in Supabase Authentication
- [ ] Pasted credentials in Supabase
- [ ] Clicked Save
- [ ] Tested login - it works! 🎉

---

## Need Help?

If you're still having issues:

1. Double-check each step carefully
2. Make sure URLs match exactly (no typos!)
3. Try clearing browser cache
4. Check Supabase logs: Dashboard → Logs → Auth Logs
5. Check browser console for errors (F12)

The most common issue is a mismatch between the redirect URIs. Make sure they're **exactly** the same in both Google and Supabase!
