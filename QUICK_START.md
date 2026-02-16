# Coffee Guardian - Quick Start Guide 🚀

## Installation & Running Locally

### Prerequisites
- Node.js 18+ and npm (or bun)
- macOS, Linux, or Windows with a terminal

### Step 1: Install Node.js (if not already installed)

**Option A: Using Homebrew (macOS)**
```bash
brew install node
```

**Option B: Direct Download**
Visit https://nodejs.org and download the LTS version for your OS

**Verify installation:**
```bash
node --version    # Should show v18.0.0 or higher
npm --version     # Should show 9.0.0 or higher
```

### Step 2: Install Dependencies

```bash
cd /Users/mac/coffee-guardian
npm install
```

This will:
- Download all project dependencies
- Update `package-lock.json` to remove `lovable-tagger` references
- Install UI components and libraries

⏳ **This takes 2-5 minutes** depending on your internet speed

### Step 3: Start Development Server

```bash
npm run dev
```

You should see output like:
```
  VITE v5.4.19  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Step 4: Open in Browser

Click on the link or open: **http://localhost:5173/**

You should see:
1. **Login page** (first time users)
2. **Demo credentials displayed** on the login form

### Demo Credentials

```
Email: demo@example.com
Password: demo123
```

Or create your own account:
- Any email format works (test@example.com)
- Password must be 6+ characters
- Passwords don't need to match in mock system

### Step 5: Explore the App

After logging in, you can:

1. **Home Page** (`/`)
   - See how the system works
   - View features and statistics

2. **Upload Page** (`/upload`)
   - Click to upload an image or take a photo
   - Drag and drop supported
   - See upload progress animation

3. **Results** (after upload)
   - View disease diagnosis
   - See confidence score
   - Read treatment recommendations
   - Check alternative treatments

4. **History** (`/history`)
   - View all past diagnoses
   - See statistics
   - Click any diagnosis to view details again

5. **Settings** (`/settings`)
   - Update profile information
   - Manage security settings
   - Control notifications
   - Logout or delete account

### Available NPM Commands

```bash
# Run development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint
```

### Useful Development Tips

**Hot Reload**: 
- Make changes to any `.tsx` file → instantly see them in browser
- No need to restart the server

**Browser DevTools**:
- Right-click → Inspect Element
- Check Console for any errors
- Use React DevTools extension for debugging

**Clear Cache**:
```bash
# If you get strange behavior, clear and reinstall
rm -rf node_modules
npm install
```

### File Locations

- **Pages**: `src/pages/`
- **Components**: `src/components/`
- **Styles**: `src/index.css`
- **Auth Logic**: `src/contexts/AuthContext.tsx`
- **Config**: `vite.config.ts`, `tsconfig.json`

### Customization

#### Change Colors
Edit `src/index.css` CSS variables section:
```css
--primary: 67 12% 23%;           /* Main color */
--secondary: 135 3% 60%;         /* Accent color */
--destructive: 0 60% 50%;        /* Error color */
```

#### Change App Name
1. Update `src/components/Navbar.tsx` 
2. Update `public/index.html` `<title>`
3. Update app logo (add your image to `public/` and reference it)

#### Add New Pages
```bash
# Create new page file
touch src/pages/MyPage.tsx

# Add route to App.tsx
<Route path="/mypage" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />

# Add navigation link to Navbar.tsx
```

### Troubleshooting

**Port 5173 already in use:**
```bash
# Use different port
npm run dev -- --port 3000
```

**Module not found errors:**
```bash
# Clear and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Styles not loading:**
```bash
# Clear browser cache
# Ctrl+Shift+Delete (Windows/Linux) or Cmd+Shift+Delete (Mac)
```

**Authentication not working:**
- Check browser console (F12 → Console)
- Check localStorage (F12 → Application → Local Storage)
- Credentials are stored locally, not on a server yet

### Files Modified for This Implementation

- ✅ `src/App.tsx` - Added auth routes and context
- ✅ `src/components/Navbar.tsx` - Added auth features
- ✅ `src/index.css` - Added animations
- ✅ `src/pages/Index.tsx` - Enhanced animations
- ✅ `src/pages/UploadPage.tsx` - Enhanced UX and progress
- ✅ `src/pages/ResultPage.tsx` - Better results display
- ✅ `src/pages/HistoryPage.tsx` - Stats and better UI
- ✅ `package.json` - Removed lovable-tagger dependency

### Files Created for This Implementation

- ✨ `src/contexts/AuthContext.tsx` - Authentication system
- ✨ `src/pages/LoginPage.tsx` - Login form
- ✨ `src/pages/SignupPage.tsx` - Signup form
- ✨ `src/pages/ForgotPasswordPage.tsx` - Password reset
- ✨ `src/pages/SettingsPage.tsx` - User settings
- ✨ `src/components/ProtectedRoute.tsx` - Route protection

### Next Steps

1. **Test Everything**
   - Login/signup with different emails
   - Upload fake images (JPG/PNG)
   - Check all pages and animations
   - Test mobile responsiveness

2. **Connect Backend** (when ready)
   - Update API endpoints in `AuthContext.tsx`
   - Connect upload to Flask ML model
   - Save results to database
   - Sync user profile with backend

3. **Customize**
   - Add your logo
   - Change colors to match your brand
   - Add more pages as needed
   - Integrate real disease detection model

4. **Deploy**
   - Build: `npm run build`
   - Artifacts in `dist/` folder
   - Deploy to Vercel, Netlify, or your server

---

## 🎯 Quick Testing Workflow

```bash
# 1. Install and start
npm install
npm run dev

# 2. Open browser
# http://localhost:5173

# 3. Create account
# Any email, password ≥ 6 chars

# 4. Upload a test image
# Use any JPG or PNG file

# 5. View results
# See diagnosis and recommendations

# 6. Check history
# All diagnoses are saved locally

# 7. Explore settings
# Update profile, logout, etc.
```

## 📞 Support

- Check browser console for errors: **F12 → Console**
- Check localStorage: **F12 → Application → Local Storage**
- React DevTools extension helpful for debugging
- All user data currently stored locally in browser

---

**Happy coding! 🎉 Your frontend is ready to rock!**
