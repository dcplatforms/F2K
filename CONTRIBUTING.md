# Contributing to F2K · Viar Farms Farm-to-Table Ordering

Thank you for your interest in contributing to F2K! This document provides guidelines and instructions for contributing to the project.

## Getting Started

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm 9+
- Git
- GitHub account with push access to the repository

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/dcplatforms/F2K.git
   cd F2K
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** - See [DEVELOPMENT.md](DEVELOPMENT.md)
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Google Gemini API key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Visit the app**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

## Development Workflow

### Branch Naming
- Feature: `feature/short-description`
- Bug fix: `fix/issue-number-short-description`
- Docs: `docs/what-you-changed`
- Chore: `chore/what-you-changed`

Example: `feature/ai-recipe-optimization`, `fix/cart-total-calculation`

### Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

body (optional)
footer (optional)
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
**Scope**: component or file affected

**Examples:**
- `feat(recipe): add AI-powered recipe generation from cart`
- `fix(cart): resolve total calculation bug`
- `docs(setup): update development environment guide`

### Creating a Pull Request

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and test thoroughly

3. **Commit with clear messages**
   ```bash
   git commit -m "feat(component): description of changes"
   ```

4. **Push to your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request** on GitHub
   - Use the PR template provided
   - Reference any related issues
   - Provide clear description of changes
   - Include screenshots/videos if UI-related

6. **Code review**
   - Address review feedback
   - Request re-review once changes are made
   - Minimum 1 approval required from @dcplatforms

7. **Merge**
   - Maintainer will merge when approved
   - Use "Squash and merge" for clean history

## Code Style

### TypeScript/React Guidelines
- Use TypeScript strict mode
- Prefer const over let, avoid var
- Use arrow functions for callbacks
- Components should be functional with hooks
- Use descriptive variable names
- Add JSDoc comments for complex functions

### Styling
- Use Tailwind CSS classes
- Follow existing color scheme from design system
- Keep component styles scoped
- Test responsive design (mobile, tablet, desktop)

## Testing

### Before Submitting PR
1. Run linting:
   ```bash
   npm run lint
   ```

2. Type check:
   ```bash
   npx tsc --noEmit
   ```

3. Test your changes manually in dev environment

4. Test in production build:
   ```bash
   npm run build
   npm run preview
   ```

## Documentation

When contributing features:
1. Update README.md if adding new features
2. Update DEVELOPMENT.md for setup/config changes
3. Add JSDoc comments to new functions
4. Update CHANGELOG.md with your changes

## Reporting Issues

Use GitHub Issues with clear templates provided:
- **Bug Report**: Steps to reproduce, expected vs actual behavior
- **Feature Request**: Problem statement, proposed solution
- **Documentation**: What's missing or unclear

## Code of Conduct

Please review [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) - we expect all contributors to uphold these community standards.

## Questions?

- Open an issue for questions about the project
- Check existing issues before creating new ones
- Contact @dcplatforms (Tom) for urgent matters

## License

By contributing to F2K, you agree that your contributions will be licensed under the MIT License - see [LICENSE](LICENSE).

---

**Thank you for contributing to F2K!** Your work helps Viar Farms serve customers better. 🌾
