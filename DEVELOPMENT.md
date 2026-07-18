# Development Guide · F2K Farm-to-Table

## System Requirements

- **Node.js**: 18.0.0 or higher (LTS recommended)
- **npm**: 9.0.0 or higher
- **Git**: 2.30+
- **Operating System**: macOS, Linux, or Windows (WSL2 recommended)

Verify installation:
```bash
node --version    # v18.x.x
npm --version     # 9.x.x
git --version     # 2.30+
```

## Initial Setup

### 1. Clone Repository
```bash
git clone https://github.com/dcplatforms/F2K.git
cd F2K
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration

Create `.env.local` in project root:
```bash
cp .env.example .env.local
```

**Required Environment Variables:**

```env
# Google Gemini API (for recipe generation)
VITE_GEMINI_API_KEY=your_api_key_here

# Server Configuration
VITE_API_URL=http://localhost:3001
```

**Get Gemini API Key:**
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key
4. Paste into `.env.local`

### 4. Start Development Environment

**Terminal 1 - Frontend (Vite)**
```bash
npm run dev
```
Runs on: http://localhost:5173

**Terminal 2 - Backend (Express)**
```bash
npm run server
```
Runs on: http://localhost:3001

## Available Scripts

```bash
npm run dev          # Start Vite dev server (frontend only)
npm run server       # Start Express backend
npm run build        # Build production bundle
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

## Project Structure

```
F2K/
├── src/
│   ├── App.tsx                 # Main app component
│   ├── index.html              # HTML entry point
│   ├── index.css               # Global styles
│   ├── main.tsx                # Vite entry
│   ├── components/
│   │   ├── AdminDashboard.tsx
│   │   ├── CartDrawer.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProductCard.tsx
│   │   ├── RecipeHub.tsx
│   │   └── ViarFarmsLogo.tsx
│   └── data.ts                 # Product catalog
├── server.ts                   # Express backend
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript config
├── package.json                # Dependencies
├── CONTRIBUTING.md             # Contribution guide
├── DEVELOPMENT.md              # This file
├── CODE_OF_CONDUCT.md          # Community standards
├── LICENSE                     # MIT License
└── README.md                   # Project overview
```

## Key Features

### Frontend (React + TypeScript)
- Shopping cart with real-time totals
- Product filtering and search
- Responsive mobile design
- Tailwind CSS styling

### Backend (Express)
- RESTful API endpoints
- Gemini API integration for recipe generation
- CORS configured for frontend requests

### AI Recipe Generation
- Analyzes customer cart items
- Generates recipes using Google Gemini API
- Suggests complementary products

## Debugging

### Browser DevTools
1. Open http://localhost:5173 in Chrome/Firefox
2. Open DevTools (F12)
3. React DevTools extension recommended

### Backend Debugging
```bash
node --inspect server.ts
# Then visit chrome://inspect in Chrome
```

### API Testing
```bash
# Test backend health
curl http://localhost:3001/health

# Test recipe generation
curl -X POST http://localhost:3001/api/generate-recipe \
  -H "Content-Type: application/json" \
  -d '{"items": ["beef", "eggs"]}'
```

## Testing Workflow

1. **Test Locally**
   - Start both frontend and backend servers
   - Test in http://localhost:5173
   - Check browser console for errors
   - Verify backend logs for API issues

2. **Test Production Build**
   ```bash
   npm run build
   npm run preview
   ```
   - Runs optimized bundle on http://localhost:4173

3. **Manual Testing Checklist**
   - [ ] Browse product catalog
   - [ ] Add items to cart
   - [ ] Generate recipe from cart
   - [ ] Admin dashboard loads
   - [ ] Mobile responsive (test at 375px width)
   - [ ] All links work
   - [ ] No console errors

## Performance Tips

- Use React DevTools Profiler to identify slow renders
- Check bundle size: `npm run build -- --analyze` (if analyzer configured)
- Lazy load heavy components with React.lazy()
- Optimize images (use WebP format)
- Use memoization for expensive computations

## Troubleshooting

### "Cannot find module" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port already in use (5173 or 3001)
```bash
# Find and kill process on port 5173
lsof -i :5173
kill -9 <PID>

# Or use different port
npm run dev -- --port 5174
```

### Gemini API key errors
- Verify key is in `.env.local` (not `.env`)
- Check key is valid and not revoked
- Ensure Gemini API is enabled in Google Cloud

### TypeScript errors
```bash
npm run type-check
# Fix errors shown, or
npx tsc --noEmit
```

### Hot reload not working
- Ensure Vite is running (`npm run dev`)
- Check that file paths are correct
- Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

## Git Workflow

See [CONTRIBUTING.md](CONTRIBUTING.md) for full workflow.

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "feat(component): description"

# Push and create PR
git push origin feature/your-feature
```

## Deployment

F2K deploys automatically to GitHub Pages via GitHub Actions on each push to main branch.

**Deployment Process:**
1. Push code to main branch
2. GitHub Actions workflow triggers
3. Runs `npm run build`
4. Deploys `dist/` to gh-pages branch
5. Live at https://dcplatforms.github.io/F2K

See `.github/workflows/pages.yml` for workflow details.

## Need Help?

- Check [README.md](README.md) for project overview
- Review [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines
- Open an issue on GitHub with your question
- Contact @dcplatforms (Tom) for urgent issues

---

Happy coding! 🚀
