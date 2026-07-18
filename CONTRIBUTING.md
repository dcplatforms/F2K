# Contributing to F2K

Thank you for your interest in contributing to F2K (Farm-to-Table Kiosk)! This document provides guidelines for development setup, pull requests, and commit conventions.

## Development Setup

### Prerequisites
- Node.js 18+ (recommended 20.x LTS)
- npm 9+
- Git

### Installation

1. Fork and clone the repository:
```bash
git clone https://github.com/DCPlatforms/F2K.git
cd F2K
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_API_BASE_URL=http://localhost:3000
```

4. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Commit Conventions

We follow conventional commits for clear, semantic versioning:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that don't affect code meaning (formatting, semicolons, etc.)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to build process, dependencies, or CI/CD configuration

### Examples
```
feat(cart): add quantity adjustment for cart items
fix(auth): resolve token expiration edge case
docs(api): update authentication endpoint documentation
```

## Pull Request Guidelines

### Before Submitting a PR

1. Create a feature branch from `main`:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit following our commit conventions

3. Push to your fork and create a pull request against `main`

### PR Requirements

- ✅ At least 1 code owner approval required
- ✅ All status checks must pass
- ✅ Branch must be up-to-date with `main`
- ✅ Include a clear description of changes
- ✅ Reference related issues (if applicable): "Fixes #123"

### PR Description Template

Use our PR template when creating pull requests. Include:
- What problem does this solve?
- How was it tested?
- Any breaking changes?
- Screenshots or demo links (if applicable)

## Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Format code with Prettier before committing
- Use meaningful variable and function names
- Keep functions focused and modular

## Testing

Before submitting a PR:
```bash
npm run test
npm run lint
npm run build
```

## Questions or Issues?

- Open an issue for bugs or feature requests
- Tag with appropriate labels for visibility
- Provide as much context as possible

Thank you for contributing to F2K!
