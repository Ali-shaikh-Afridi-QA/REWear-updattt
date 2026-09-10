# 🔐 Google OAuth Setup Guide for ReWear

## Quick Start

Your ReWear app now has Google Sign-In ready! Just add your Google Client ID to the `.env` file and you're done.

---

## Step 1: Get Your Google Client ID

### Option A: Using Google Cloud Console (Recommended)

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create a new project:**
   - Click "Select a Project" → "New Project"
   - Name it "ReWear" (or any name)
   - Click "Create"

3. **Enable Google Identity Services:**
   - Go to "APIs & Services" → "Library"
   - Search for "Google Identity Services"
   - Click it → "Enable"

4. **Create OAuth Credentials:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth Client ID"
   - Choose "Web application"
   - Under "Authorized redirect URIs", add:
     - `http://localhost:5173`
     - `http://localhost:5174`
     - `http://localhost:5175`
     - (Your production domain later)
   - Click "Create"

5. **Copy Your Client ID:**
   - Look for "Client ID" in the popup
   - Copy the long string (e.g., `123456789-abc...xyz.apps.googleusercontent.com`)

---

## Step 2: Add Client ID to Your Project

### Update `.env` File

```bash
# Open c:\Users\yasme\REWear\.env
VITE_GOOGLE_CLIENT_ID=YOUR_COPIED_CLIENT_ID_HERE
VITE_API_BASE_URL=https://rewear-final-p.onrender.com
```

**Replace `YOUR_COPIED_CLIENT_ID_HERE` with your actual Client ID from Step 1.**

---

## Step 3: Test It Locally

1. **Start the dev server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Open http://localhost:5173 in your browser**

3. **Go to the Login/Register page**
   - You should now see a real Google Sign-In button!

4. **Test signing in:**
   - Click the "Continue with Google" button
   - Choose your account
   - If backend is configured, you'll be logged in! ✅

---

## Troubleshooting

### ❌ Button doesn't appear
- Check that `VITE_GOOGLE_CLIENT_ID` is in your `.env` file
- Restart dev server: `npm run dev`
- Clear browser cache (Ctrl+F5)

### ❌ "Google sign-in failed"
- Verify your Client ID is correct
- Check that your origin URL matches the authorized URIs in Google Cloud Console
- Make sure your backend has `/auth/google` endpoint implemented

### ❌ Error: "Cross-Origin Request Blocked"
- This means your frontend origin (http://localhost:5173) isn't in the authorized URIs
- Add it to Google Cloud Console → Credentials → authorized redirect URIs

---

## Backend Integration

Your frontend sends the Google credential token to your backend `/auth/google` endpoint.

**Expected backend request:**
```json
POST /auth/google
{
  "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjE2..."
}
```

**Expected backend response:**
```json
{
  "access_token": "...",
  "refresh_token": "...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

---

## Production Deployment

When deploying to production:

1. **Add production domain to Google Cloud Console:**
   - Go to Credentials → OAuth Client ID
   - Add your production domain (e.g., `https://rewear.app`)

2. **Update `.env` for production:**
   ```bash
   VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID
   VITE_API_BASE_URL=https://your-api-domain.com
   ```

---

## Need Help?

- **Google OAuth Docs:** https://developers.google.com/identity/gsi/web
- **ReWear API Reference:** Check your backend documentation
- **Common Issues:** See Troubleshooting section above

---

**Happy signing in! 🎉**
