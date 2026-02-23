# Supabase Setup Guide for Coffee Guardian

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **Sign Up** and create an account (or sign in)
3. Click **New Project**
4. Fill in the following:
   - **Project name**: `coffee-guardian` (or your preferred name)
   - **Database password**: Create a strong password (save this!)
   - **Region**: Select a region closest to your users
5. Click **Create new project** and wait 2-3 minutes for initialization

## Step 2: Get Your Credentials

After your project is created:

1. Go to **Settings → API** in the left sidebar
2. Copy the following values:
   - **Project URL** under "API Settings" → **URL**
   - **Anon (public) Key** under "Project API keys"

Example values look like:
```
Project URL: https://xyzabc.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 3: Update Environment Variables

1. Open `/Users/mac/coffee-guardian/.env`
2. Replace the placeholder values:

```env
VITE_API_URL=http://localhost:5000
VITE_DEBUG=false

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace `your-project.supabase.co` and `your-anon-key-here` with your actual credentials.

## Step 4: Create Database Tables

1. In Supabase dashboard, go to **SQL Editor** in the left sidebar
2. Click **New query**
3. Copy and paste the SQL from [supabase-schema.sql](./supabase-schema.sql)
4. Click **Run** (or press Cmd+Enter on Mac)
5. You should see success messages for all table creations

## Step 5: Enable Email Confirmations (Optional but Recommended)

1. Go to **Authentication** → **Providers**
2. Scroll down and enable **Email**
3. Go to **Authentication** → **Email Templates**
4. Customize the confirmation email if desired

## Step 6: Test the Authentication

1. Restart your frontend:
```bash
cd /Users/mac/coffee-guardian
npm run dev
```

2. Go to http://localhost:8085
3. Click **Sign Up**
4. Create a new account with a valid email
5. Check your email for a confirmation link from Supabase (might be in spam)
6. Click the confirmation link and return to the app
7. You should now be logged in!

## Database Schema Overview

### `profiles` Table
Stores user profile information:
- `id` - User ID (from auth)
- `email` - User email
- `full_name` - User's full name
- `avatar_url` - Profile picture URL
- `language` - Preferred language ('en' or 'rw')
- `notifications_enabled` - Boolean for notification preferences

### `diagnosis_history` Table
Stores records of coffee plant diagnoses:
- `id` - Record ID
- `user_id` - Reference to profiles
- `image_url` - URL of the uploaded image
- `disease_name` - Name of detected disease
- `confidence` - Model confidence (0-100)
- `severity` - Severity level (mild, moderate, severe)
- `affected_area` - Percentage of leaf affected
- `treatment_action` - Recommended treatment
- `treatment_duration` - How long treatment should last
- `estimated_cost` - Cost estimate for treatment

### `user_settings` Table
Stores user preferences:
- `user_id` - Reference to profiles
- `language` - Language preference
- `notifications_enabled` - Enable/disable notifications
- `theme_preference` - UI theme (light/dark)
- `auto_save_history` - Auto-save history option

### `diseases` Table
Reference data for coffee diseases:
- `name` - English disease name
- `name_rw` - Kinyarwanda disease name
- `description` - Detailed description
- `symptoms` - List of symptoms
- `treatment` - Treatment recommendations
- `prevention` - Prevention methods
- `estimated_cost` - Treatment cost estimate

## Security Notes

- ✅ Row Level Security (RLS) is enabled on all tables
- ✅ Users can only see/modify their own data
- ✅ Disease reference data is publicly readable
- ✅ Profile creation is automatic on signup
- ✅ Settings are automatically initialized with defaults

## Deployment Considerations

When deploying to production:

1. Update `VITE_SUPABASE_URL` to your production Supabase URL
2. Ensure your domain is added to **Authentication → URL Configuration** in Supabase
3. Update the reset password redirect URL in AuthContext if needed
4. Consider enabling additional security features in Supabase:
   - MFA (Multi-factor authentication)
   - Rate limiting
   - Custom SMTP for emails

## Troubleshooting

### "Missing Supabase configuration" error
- Check that `.env` file exists in the root directory
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Make sure values don't have extra quotes or spaces

### "User created but login fails"
- Check that the `profiles` table was created successfully
- Verify the SQL schema ran without errors
- Check browser console for specific error messages

### "Profile not updating"
- Ensure you're logged in (check `useAuth().user`)
- Check that RLS policies are enabled
- Verify the database tables exist in Supabase

### Email confirmation not working
- Check spam/junk folder
- Verify Email provider is enabled in Supabase
- Check Authentication → Email Templates configuration

## Next Steps

1. Update [UploadPage.tsx](../../src/pages/UploadPage.tsx) to save results to `diagnosis_history`
2. Update [HistoryPage.tsx](../../src/pages/HistoryPage.tsx) to load from `diagnosis_history`
3. Update [SettingsPage.tsx](../../src/pages/SettingsPage.tsx) to use `user_settings` table
4. Implement image storage using Supabase Storage for diagnosis images

## Useful Supabase Documentation

- [Auth Docs](https://supabase.com/docs/guides/auth)
- [Database Docs](https://supabase.com/docs/guides/database)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime Subscriptions](https://supabase.com/docs/guides/realtime)
