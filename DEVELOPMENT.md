# F2K Development Guide

## Local Development Setup

### System Requirements
- **Node.js**: 20.x LTS (minimum 18.x)
- **npm**: 9.x or higher
- **Operating System**: macOS, Linux, or Windows (with WSL2 recommended)

### Step-by-Step Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/DCPlatforms/F2K.git
cd F2K
```

#### 2. Install Dependencies
```bash
npm install
```

This installs all project dependencies defined in `package.json` including:
- React 18+
- TypeScript
- Vite (build tool)
- Tailwind CSS
- Gemini API client

#### 3. Environment Configuration

Create `.env.local` in the root directory:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your local configuration:
```env
# Gemini API Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# API Server
VITE_API_BASE_URL=http://localhost:3000

# Environment
VITE_ENV=development
```

#### 4. Obtain Gemini API Key

If you're contributing to Gemini AI features:
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key for F2K project
3. Add to your `.env.local` as `VITE_GEMINI_API_KEY`

**Security Note**: Never commit `.env.local` or API keys to version control. Use `.env.local.example` for documentation.

#### 5. Start Development Server
```bash
npm run dev
```

Application launches at `http://localhost:5173`

Vite provides hot module reload (HMR) for instant feedback on code changes.

### Available Scripts

```bash
# Start development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run linter (if configured)
npm run lint

# Format code with Prettier (if configured)
npm run format

# Run type checking
npx tsc --noEmit
```

### Project Structure

```
F2K/
├── src/
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API and external service calls
│   ├── types/            # TypeScript type definitions
│   ├── styles/           # Global styles
│   ├── App.tsx           # Root component
│   └── main.tsx          # Entry point
├── public/               # Static assets
├── .github/
│   ├── workflows/        # GitHub Actions CI/CD
│   └── ISSUE_TEMPLATE/   # Issue templates
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── package.json          # Project dependencies
```

### Database & Backend

F2K integrates with a Node/Express backend (server.ts):
- API endpoint: `http://localhost:3000` (configurable via `.env.local`)
- Product data from `data.ts`
- Admin dashboard connects to backend for inventory management

Start backend server (if running separately):
```bash
npm run server
```

### Testing Locally

#### Test the Cart
1. Navigate to home page
2. Add products to cart
3. Verify cart drawer displays correct items and totals
4. Test quantity adjustments

#### Test Recipe Hub
1. Click Recipe Hub in navigation
2. Verify Gemini AI recommendations load
3. Test ingredient filtering

#### Test Admin Dashboard
1. Navigate to `/admin`
2. Verify product list and inventory levels
3. Test order management features

### Debugging

#### Browser DevTools
1. Open Chrome DevTools (F12 or Cmd+Option+I)
2. Use React DevTools extension for component debugging
3. Check Network tab for API calls

#### Debug TypeScript
```bash
# Type check without building
npx tsc --noEmit

# Watch mode for type checking
npx tsc --watch --noEmit
```

#### Logs
Check browser console for application logs:
```javascript
console.log('Debug message:', data);
```

### Common Issues

#### Port 5173 Already in Use
```bash
# Kill process on port 5173
lsof -i :5173  # macOS/Linux
tasklist | findstr 5173  # Windows

# Or use different port
npm run dev -- --port 3001
```

#### API Connection Failed
- Verify backend server is running on `VITE_API_BASE_URL`
- Check `.env.local` configuration
- Review browser Network tab for failed requests

#### Missing Dependencies
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript Errors
```bash
# Check for type errors
npx tsc --noEmit

# Review tsconfig.json for strict mode settings
```

### Performance Optimization

#### Build Analysis
```bash
# Analyze bundle size
npm run build
npm run preview
```

#### Code Splitting
Vite automatically handles code splitting for routes and lazy-loaded components.

#### Image Optimization
Place images in `public/` directory for optimal loading:
```html
<img src="/images/product.jpg" alt="Product" />
```

### Deployment

#### GitHub Pages
F2K is configured for automatic deployment to GitHub Pages:
1. Push to `main` branch
2. GitHub Actions workflow triggers
3. Built site deploys to `https://dcplatforms.github.io/F2K`

#### Environment Variables for Production
When deploying, ensure these secrets are configured:
- `VITE_GEMINI_API_KEY` - via GitHub Secrets
- `VITE_API_BASE_URL` - production API endpoint

### Contributing

Before submitting a PR:
1. Run linter: `npm run lint`
2. Check types: `npx tsc --noEmit`
3. Build locally: `npm run build`
4. Test thoroughly with `npm run preview`

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

### Support

For issues or questions:
- Check [GitHub Issues](https://github.com/DCPlatforms/F2K/issues)
- Review [CONTRIBUTING.md](./CONTRIBUTING.md)
- Contact maintainers via conduct@cedartaps.com
