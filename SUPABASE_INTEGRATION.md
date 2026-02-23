# Coffee Guardian - Supabase Integration Complete 

## What Was Implemented

### 1. Authentication System
- **Integrated Supabase Auth** for secure user authentication
- Email/password signup and login
- Session persistence with real database
- Password reset functionality
- User profile management

### 2. Database Schema
Created four main tables in Supabase PostgreSQL:

#### `profiles` Table
- Stores user profile information
- Links to Supabase Auth users via foreign key
- Fields: id, email, full_name, avatar_url, language, notifications_enabled

#### `diagnosis_history` Table
- Records of coffee plant diagnoses
- Links to user profiles
- Fields: id, user_id, image_url, disease_name, confidence, severity, affected_area, treatment_action, created_at

#### `user_settings` Table
- User preferences and configuration
- Fields: language, notifications_enabled, theme_preference, auto_save_history

#### `diseases` Table
- Reference data for coffee diseases
- Bilingual (English & Kinyarwanda)
- Pre-populated with 3 diseases: Healthy, Red Spider Mite, Rust

### 3. Security
-  Row Level Security (RLS) enabled on all tables
-  Users can only view/edit their own data
-  Public read access to disease reference data
-  Automatic profile creation on signup

### 4. Frontend Integration

#### Updated Files:
- **src/lib/supabase.ts** - Supabase client initialization
- **src/lib/db-service.ts** - Database service layer (CRUD operations)
- **src/contexts/AuthContext.tsx** - Supabase authentication
- **src/pages/UploadPage.tsx** - Save diagnoses to database
- **src/pages/HistoryPage.tsx** - Load from Supabase
- **src/pages/SettingsPage.tsx** - User preferences with language switching
- **.env** - Supabase credentials (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)

### 5. Documentation
- **SUPABASE_SETUP.md** - Complete setup guide with screenshots-ready instructions
- **backend/supabase-schema.sql** - SQL schema for database creation
- **README.md** - Updated with Supabase information

## Getting Started

### Step 1: Create Supabase Project
```
1. Go to https://supabase.com
2. Sign up / Log in
3. Create a new project (choose region closest to you)
4. Wait 2-3 minutes for initialization
```

### Step 2: Configure Frontend
```bash
# Copy your credentials from Supabase Settings → API
# Edit .env file:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 3: Create Database Tables
```
1. In Supabase, go to SQL Editor
2. Create new query
3. Copy-paste from backend/supabase-schema.sql
4. Click Run
```

### Step 4: Test
```bash
npm run dev
# Visit http://localhost:8085
# Sign up with new email
# Upload an image
# View results saved in history
```

## Database Service Functions

### Available Functions in `src/lib/db-service.ts`:

```typescript
// User profiles
getUserProfile(userId: string)
updateUserProfile(userId: string, updates: any)

// Diagnosis history
getDiagnosisHistory(userId: string)
saveDiagnosis(userId: string, diagnosis: {...})
deleteDiagnosis(diagnosisId: string)

// User settings
getUserSettings(userId: string)
updateUserSettings(userId: string, settings: {...})

// Disease reference data
getDiseases()
getDiseaseByName(name: string)
```

## Architecture

```
┌─────────────────────────┐
│   Coffee Guardian Web   │
│   (React + Vite)        │
└────────────┬────────────┘
             │
    ┌────────┴─────────┐
    │                  │
┌───▼──────┐    ┌──────▼────┐
│ Supabase │    │   Flask    │
│(Auth+DB) │    │  Backend   │
└──────────┘    │ (ML Model) │
                └────────────┘
```

## User Flow

1. **Signup** → Create Supabase Auth user + profiles table entry
2. **Login** → Retrieve authenticated user + load profile
3. **Upload Image** → Send to Flask backend for ML prediction
4. **Save Result** → Store in diagnosis_history table
5. **View History** → Load from database (not localStorage)
6. **Adjust Settings** → Update language in user_settings table

## Next Steps (Optional)

1. **Image Storage**
   - Use Supabase Storage for diagnosis images instead of base64
   - Reduces database size and improves performance

2. **Real-time Updates**
   - Use Supabase Realtime subscriptions for live updates
   - Sync Settings across multiple tabs

3. **Advanced Features**
   - Email notifications using Supabase functions
   - Export diagnosis reports as PDF
   - Share diagnosis results securely

4. **Production Deployment**
   - Deploy frontend to Vercel/Netlify
   - Deploy backend to Railway/Render
   - Update VITE_SUPABASE_URL for production

## Environment Variables

```env
# Backend API
VITE_API_URL=http://localhost:5000

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## File Structure

```
src/
├── lib/
│   ├── supabase.ts        ← Supabase client init
│   ├── db-service.ts      ← Database functions
│   └── ml-service.ts      ← ML API client
├── contexts/
│   └── AuthContext.tsx    ← Updated for Supabase
└── pages/
    ├── UploadPage.tsx     ← Saves to DB
    ├── HistoryPage.tsx    ← Loads from DB
    └── SettingsPage.tsx   ← Uses DB settings

backend/
└── supabase-schema.sql    ← Database schema
```

## Troubleshooting

### "Missing Supabase configuration"
- Check `.env` file exists and has correct values
- Make sure no spaces around `=` signs

### "Users can't signup"
- Verify Email provider is enabled in Supabase Auth
- Check user_settings default creation in AuthContext

### "History not loading"
- Verify diagnosis_history table exists
- Check RLS policies are correct
- Ensure user_id matches authenticated user ID

### "Settings not saving"
- Verify user_settings table exists
- Check language field in updateUserSettings
- Confirm authenticated user ID is correct

## Support

For detailed setup instructions, see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
For API documentation, see [backend/README.md](./backend/README.md)
