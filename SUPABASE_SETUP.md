# MenuFlow - Supabase Integration Guide

## Overview

MenuFlow is now fully integrated with Supabase for authentication, database management, and user activity tracking. This guide explains the database structure and how to configure Google OAuth.

## Database Schema

The following tables have been automatically created in your Supabase database:

### 1. **profiles**
Extends the auth.users table with additional user information.

- `id` (UUID) - References auth.users.id
- `email` (TEXT) - User email
- `full_name` (TEXT) - User's full name
- `avatar_url` (TEXT) - Profile picture URL
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

### 2. **restaurants**
Stores restaurant information for each user.

- `id` (UUID) - Primary key
- `user_id` (UUID) - References auth.users.id
- `name` (TEXT) - Restaurant name
- `description` (TEXT) - Restaurant description
- `address` (TEXT) - Physical address
- `phone` (TEXT) - Contact phone
- `website` (TEXT) - Restaurant website
- `logo_url` (TEXT) - Restaurant logo
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

### 3. **menus**
Stores AR menu configurations.

- `id` (UUID) - Primary key
- `restaurant_id` (UUID) - References restaurants.id
- `name` (TEXT) - Menu name
- `description` (TEXT) - Menu description
- `is_active` (BOOLEAN) - Whether menu is published
- `design_theme` (TEXT) - Theme name (e.g., 'modern', 'elegant')
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

### 4. **menu_items**
Individual items within a menu.

- `id` (UUID) - Primary key
- `menu_id` (UUID) - References menus.id
- `name` (TEXT) - Item name
- `description` (TEXT) - Item description
- `price` (DECIMAL) - Item price
- `category` (TEXT) - Category (e.g., 'Appetizers', 'Entrees')
- `image_url` (TEXT) - Item image
- `is_available` (BOOLEAN) - Whether item is currently available
- `dietary_info` (JSONB) - Array of dietary tags (e.g., ['vegan', 'gluten-free'])
- `position` (INTEGER) - Sort order
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

### 5. **ar_sessions**
Tracks when customers view AR menus.

- `id` (UUID) - Primary key
- `menu_id` (UUID) - References menus.id
- `viewer_ip` (TEXT) - Viewer's IP address
- `viewer_location` (TEXT) - Geographic location
- `device_type` (TEXT) - Device type (e.g., 'mobile', 'tablet')
- `session_duration` (INTEGER) - How long they viewed (in seconds)
- `created_at` (TIMESTAMPTZ)

### 6. **user_activity**
Complete activity history for analytics.

- `id` (UUID) - Primary key
- `user_id` (UUID) - References auth.users.id
- `activity_type` (TEXT) - Activity type (e.g., 'menu_created', 'item_added')
- `entity_type` (TEXT) - What was affected (e.g., 'menu', 'menu_item')
- `entity_id` (UUID) - ID of the affected entity
- `metadata` (JSONB) - Additional context
- `created_at` (TIMESTAMPTZ)

## Security

### Row Level Security (RLS)

All tables have RLS enabled with the following policies:

**Profiles:**
- Users can only view and update their own profile

**Restaurants:**
- Users can only view, create, update, and delete their own restaurants

**Menus:**
- Users can manage menus for their own restaurants
- Public can view active menus (for AR viewing)

**Menu Items:**
- Users can manage items for their own menus
- Public can view available items from active menus

**AR Sessions:**
- Anyone can create sessions (for tracking)
- Users can view sessions for their own menus

**User Activity:**
- Users can only view and create their own activity

### Automatic Profile Creation

When a user signs up, a trigger automatically creates their profile in the `profiles` table using data from `auth.users`.

## Google OAuth Setup

To enable "Continue with Google" functionality:

### 1. Configure Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth 2.0 Client ID"
5. Configure the consent screen if prompted
6. Select "Web application" as application type
7. Add authorized redirect URIs:
   ```
   https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   ```
8. Copy your Client ID and Client Secret

### 2. Configure Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Navigate to "Authentication" > "Providers"
3. Find "Google" and enable it
4. Enter your Google Client ID and Client Secret
5. Save the configuration

### 3. Test the Integration

1. Visit your app at `/login` or `/signup`
2. Click "Continue with Google"
3. You should be redirected to Google's login
4. After authentication, you'll be redirected back to `/dashboard`

## Authentication Flow

### Email/Password Signup

```typescript
POST /signup
{
  name: "John Doe",
  email: "john@example.com",
  password: "securePassword123"
}
```

### Email/Password Login

```typescript
POST /login
{
  email: "john@example.com",
  password: "securePassword123"
}
```

### Google OAuth

```typescript
POST /login
{
  intent: "google"
}
```

Redirects to Google → Returns to `/auth/callback` → Redirects to `/dashboard`

### Logout

```typescript
POST /logout
```

## Using the Database in Your Code

### Server-Side (Loaders/Actions)

```typescript
import { createSupabaseServerClient } from "~/lib/supabase.server";

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase } = createSupabaseServerClient(request);
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  // Query data
  const { data: restaurants } = await supabase
    .from('restaurants')
    .select('*')
    .eq('user_id', user.id);
    
  return { restaurants };
}
```

### Client-Side (Components)

```typescript
import { createSupabaseBrowserClient } from "~/lib/supabase.client";

export default function MyComponent() {
  const supabase = createSupabaseBrowserClient();
  
  // Use supabase client...
}
```

## Next Steps

1. **Enable Google OAuth** - Follow the setup instructions above
2. **Customize User Profiles** - Add more fields to the profiles table
3. **Build Restaurant Management** - Create UI for managing restaurants
4. **Implement AR Menu Builder** - Connect the AR builder to save menus to database
5. **Add Analytics** - Track and visualize AR session data
6. **Set up Realtime** - Enable real-time updates for collaborative editing

## Useful Commands

### View Tables
```sql
SELECT * FROM profiles;
SELECT * FROM restaurants;
SELECT * FROM menus;
```

### Check RLS Policies
```sql
SELECT * FROM pg_policies WHERE tablename = 'restaurants';
```

### Manual User Activity Tracking
```typescript
await supabase
  .from('user_activity')
  .insert({
    user_id: user.id,
    activity_type: 'menu_created',
    entity_type: 'menu',
    entity_id: newMenu.id,
    metadata: { menu_name: newMenu.name }
  });
```

## Support

For issues or questions:
- Supabase Documentation: https://supabase.com/docs
- MenuFlow Support: [Your support channel]
