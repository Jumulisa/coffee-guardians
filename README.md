# Coffee Guardian - AI Coffee Disease Detection

**Coffee Guardian** is an AI-powered web application that uses deep learning (MobileNetV2) to detect and diagnose coffee leaf diseases in real-time. It helps coffee farmers identify diseases early and provides treatment recommendations.

## Features

✨ **AI Disease Detection**
- Real-time disease diagnosis with confidence scoring
- Predicts: Healthy, Red Spider Mite, Rust
- Severity classification and affected area estimation

🔐 **Authentication System**
- Supabase authentication with email/password
- Secure user profiles and session management
- Protected routes for premium features
- Profile settings and security management

📱 **Mobile-Friendly**
- Responsive design works on desktop, tablet, and mobile
- Image upload and camera capture support
- Progressive improvement with offline support

🌍 **Multi-Language Support**
- English
- Kinyarwanda

✨ **Smooth Animations**
- Fade-in, slide, and scale animations
- Progress indicators and loading states
- Beautiful UI with Tailwind CSS

💾 **Database & Storage**
- Supabase PostgreSQL database
- User profiles and diagnosis history
- User preferences and settings
- Reference disease information

🎨 **Built with Modern Stack**
- React 18.3 with TypeScript
- Vite 5.4 (lightning-fast bundler)
- Tailwind CSS 3.4 for styling
- shadcn/ui component library
- TensorFlow.js compatible backend

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+ (for backend)
- Trained model file: `coffee_disease_model.h5`

### 1. Setup Frontend

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/coffee-guardians.git
cd coffee-guardians

# Install dependencies
npm install

# Copy example env
cp .env.example .env

# Edit .env to set backend URL (default: http://localhost:5000)
```

### 2. Setup Supabase (Database & Authentication)

Coffee Guardian uses **Supabase** for authentication and data storage.

#### Quick Setup:

1. **Create Supabase Project**
   - Go to [https://supabase.com](https://supabase.com)
   - Click "New Project"
   - Fill in project details and wait for initialization (2-3 minutes)

2. **Get Your Credentials**
   - Go to **Settings → API**
   - Copy **Project URL** and **Anon Key**

3. **Configure Frontend**
   - Create `.env` file in project root:
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Create Database Tables**
   - In Supabase, go to **SQL Editor**
   - Create new query and paste the SQL from [backend/supabase-schema.sql](backend/supabase-schema.sql)
   - Run the query

For complete setup instructions, see [SUPABASE_SETUP.md](SUPABASE_SETUP.md).

### 3. Setup Backend

```bash
# Install Python dependencies
cd backend
pip install -r requirements.txt

# Ensure your model file exists
ls -lh coffee_disease_model.h5
```

### 4. Run Both Services

**Terminal 1 - Frontend (port 8084):**
```bash
npm run dev
```

**Terminal 2 - Backend (port 5000):**
```bash
cd backend
python app.py
```

Visit **http://localhost:8085** in your browser.

### First Time Setup

1. **Create Your Account**
   - Click "Sign Up" on the login page
   - Enter your email and create a password
   - Verify your email (check spam if needed)

2. **Upload & Analyze**
   - Go to "Upload" page
   - Take a photo or upload an image of a coffee leaf
   - AI will analyze and provide diagnosis

3. **View Results**
   - See disease diagnosis with confidence score
   - Get treatment recommendations
   - Save to history automatically

## Project Structure

```
coffee-guardians/
├── src/                    # React frontend
│   ├── pages/             # Page components
│   │   ├── LoginPage.tsx
│   │   ├── UploadPage.tsx
│   │   ├── ResultPage.tsx
│   │   ├── HistoryPage.tsx
│   │   └── SettingsPage.tsx
│   ├── components/        # Reusable components
│   ├── contexts/          # React Context (Auth, Language)
│   ├── lib/
│   │   ├── ml-service.ts  # Backend API client
│   │   └── mock-data.ts   # Mock diagnoses
│   └── index.css          # Global styles + animations
├── backend/               # Python Flask API
│   ├── app.py            # Main Flask application
│   ├── requirements.txt   # Python dependencies
│   ├── coffee_disease_model.h5  # Trained ML model
│   └── README.md         # Backend documentation
├── public/               # Static assets
├── package.json          # Frontend dependencies
└── README.md            # This file
```

## Available Routes

| Route | Auth Required | Description |
|-------|---------------|-------------|
| `/` | No | Homepage with features |
| `/login` | No | User login |
| `/signup` | No | New user registration |
| `/forgot-password` | No | Password reset |
| `/upload` | Yes | Upload image for diagnosis |
| `/result` | Yes | View diagnosis results |
| `/history` | Yes | View past diagnoses |
| `/settings` | Yes | User profile & settings |

## API Endpoints

### Frontend communicates with Backend at `http://localhost:5000`

- `POST /predict` - Submit image for disease diagnosis
- `GET /info` - Get model information
- `GET /health` - Health check

See [backend/README.md](backend/README.md) for detailed API documentation.

## Model Information

- **Architecture**: MobileNetV2 + custom classification head
- **Input**: 224×224×3 RGB images
- **Classes**: 3 (Healthy, Red Spider Mite, Rust)
- **Framework**: TensorFlow/Keras
- **Size**: ~23 MB

### Severity Levels

- **Mild**: < 25% leaf area affected
- **Moderate**: 25-50% leaf area affected
- **Severe**: > 50% leaf area affected

## Build & Deploy

### Build for Production

```bash
npm run build
```

Generates optimized files in `dist/` directory.

### Deploy Frontend

- **Vercel**: `vercel`
- **Netlify**: `netlify deploy --prod --dir=dist`
- **GitHub Pages**: Configure in repository settings

### Deploy Backend

Use a production WSGI server:

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

Or containerize with Docker (see `backend/README.md`).

## Technologies Used

### Frontend
- React 18.3
- TypeScript 5.8
- Vite 5.4
- Tailwind CSS 3.4
- shadcn/ui
- lucide-react (icons)

### Backend
- Flask 2.3
- TensorFlow 2.13
- Keras
- NumPy
- Pillow

### Deployment
- GitHub (version control)
- Vercel/Netlify (frontend)
- Heroku/Railway (backend)

## Development

### Available Scripts

```bash
npm run dev        # Start dev server (frontend)
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run test       # Run tests
npm run test:watch # Run tests in watch mode
```

### Code Style

- ESLint configured for React + TypeScript
- Prettier for code formatting
- TypeScript strict mode enabled

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source. See LICENSE file for details.

## Support

- 📧 Email: support@coffeeguardian.local
- 🐛 Issues: GitHub Issues
- 💬 Discussions: GitHub Discussions

## Acknowledgments

- Coffee disease dataset: Robusta Coffee Leaf Images (RoCOLE)
- shadcn/ui for excellent component library
- TensorFlow team for ML framework

---

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Status**: Production Ready ✅
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Use your deployment provider's dashboard to publish the project.

## Can I connect a custom domain?

Yes, you can. Consult your deployment provider's domain settings to connect a custom domain.

Refer to your provider's documentation for steps.
