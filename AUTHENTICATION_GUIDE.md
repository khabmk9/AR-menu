# MenuFlow Authentication Guide

## Quick Start

Your MenuFlow application now has complete Supabase authentication with Google OAuth support!

## What's Implemented

### ✅ Database Schema
- **6 tables** automatically created with proper relationships
- **Row Level Security** enabled on all tables
- **Automatic user profiles** created on signup
- **Activity tracking** for analytics
- **AR session tracking** for customer interactions

### ✅ Authentication Features
- Email/Password signup and login
- Google OAuth ("Continue with Google")
- Protected dashboard routes
- Automatic session management
- Secure logout functionality
- User profile display in sidebar

### ✅ User Experience
- Beautiful glassmorphic login/signup forms
- Loading states during authentication
- Error message display
- Automatic redirect after login
- Persistent sessions with cookies

## File Structure

```
app/
├── lib/
│   ├── supabase.server.ts      # Server-side Supabase client
│   ├── supabase.client.ts      # Client-side Supabase client
│   ├── auth.server.ts          # Authentication utilities
│   └── database.types.ts       # TypeScript database types
├── routes/
│   ├── login.tsx               # Login page with Google OAuth
│   ├── signup.tsx              # Signup page with Google OAuth
│   ├── logout.tsx              # Logout handler
│   ├── auth.callback.tsx       # OAuth callback handler
│   └── app-layout.tsx          # Protected dashboard layout
└── types/
    └── window.d.ts             # Environment variables types
```

## Database Tables Created

1. **profiles** - User profile information
2. **restaurants** - Restaurant data for each user
3. **menus** - AR menu configurations
4. **menu_items** - Individual menu items
5. **ar_sessions** - Customer viewing analytics
6. **user_activity** - Complete activity history

## How to Enable Google OAuth

### Step 1: Google Cloud Console Setup

1. Go to https://console.cloud.google.com/
2. Create or select a project
3. Navigate to **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth 2.0 Client ID**
5. Set up consent screen if needed
6. Choose **Web application**
7. Add authorized redirect URI:
   ```
   https://[YOUR_PROJECT_REF].supabase.co/auth/v1/callback
   ```
8. Copy your **Client ID** and **Client Secret**

### Step 2: Supabase Configuration

1. Go to https://app.supabase.com/
2. Select your project
3. Navigate to **Authentication > Providers**
4. Enable **Google** provider
5. Paste your Client ID and Client Secret
6. Save changes

### Step 3: Test It Out!

1. Visit `/signup` or `/login`
2. Click **"Continue with Google"**
3. Sign in with your Google account
4. You'll be redirected to `/dashboard`

## Usage Examples

### Check if User is Logged In

```typescript
// In a route loader
import { getUser } from "~/lib/auth.server";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getUser(request);
  if (!user) {
    return redirect("/login");
  }
  return { user };
}
```

### Query User's Data

```typescript
import { createSupabaseServerClient } from "~/lib/supabase.server";

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase } = createSupabaseServerClient(request);
  
  const { data: restaurants } = await supabase
    .from('restaurants')
    .select('*');
    
  return { restaurants };
}
```

### Create New Record

```typescript
export async function action({ request }: Route.ActionArgs) {
  const { supabase } = createSupabaseServerClient(request);
  const formData = await request.formData();
  
  const { data, error } = await supabase
    .from('restaurants')
    .insert({
      name: formData.get('name'),
      description: formData.get('description')
    })
    .select()
    .single();
    
  if (error) throw error;
  return { restaurant: data };
}
```

## Security Notes

- All routes under `/dashboard` are protected
- Users can only access their own data (enforced by RLS)
- Passwords are never stored (handled by Supabase Auth)
- Sessions are secure HTTP-only cookies
- Environment variables are never exposed to client

## Current User Flow

1. **New User**: Home → Signup → Dashboard
2. **Returning User**: Home → Login → Dashboard
3. **Google User**: Click "Continue with Google" → Authenticate → Dashboard
4. **Logout**: Click "Sign Out" → Redirected to Login

## What's Next?

Now that authentication is set up, you can:

1. ✅ **Connect AR Menu Builder to database** - Save menus to Supabase
2. ✅ **Build restaurant management** - CRUD operations for restaurants
3. ✅ **Add menu management** - Create and edit menus
4. ✅ **Track analytics** - View AR session data
5. ✅ **Enable real-time features** - Live collaboration

## Testing Credentials

For development, you can create test accounts:

**Email/Password:**
- Email: test@menuflow.com
- Password: test123456

**Google OAuth:**
- Use any Google account

## Troubleshooting

### "Invalid login credentials"
- Check email/password are correct
- Verify user exists in Supabase Auth dashboard

### Google OAuth not working
- Verify redirect URI matches exactly
- Check Client ID and Secret are correct
- Ensure Google provider is enabled in Supabase

### User data not saving
- Check RLS policies in Supabase
- Verify user is authenticated
- Check browser console for errors

## Support

- Supabase Docs: https://supabase.com/docs
- React Router Docs: https://reactrouter.com
- Google OAuth Setup: https://supabase.com/docs/guides/auth/social-login/auth-google
