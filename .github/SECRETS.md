# GitHub Secrets Configuration

This document describes all secrets required for F2K CI/CD pipelines and local development.

## Required Secrets for GitHub Actions

### 1. GEMINI_API_KEY
**Purpose**: Google Gemini API access for Recipe Hub AI recommendations

**How to obtain**:
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with Google account used for Cedar Tap
3. Create a new API key for "F2K" project
4. Copy the key

**Setup in GitHub**:
1. Go to Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `GEMINI_API_KEY`
4. Value: Paste your Gemini API key
5. Click "Add secret"

**Usage in Workflows**:
```yaml
- name: Build with Gemini API
  env:
    VITE_GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
  run: npm run build
```

### 2. GitHub Token (Automatic)
**Purpose**: Deploy to GitHub Pages, publish releases

**Details**: GitHub automatically provides `GITHUB_TOKEN` in workflows. No manual setup needed.

**Permissions**:
- Contents: read
- Pages: write
- ID-token: write (for OIDC authentication)

## Local Development Secrets

### Environment Variables (.env.local)

Create `.env.local` in repository root:
```env
# Gemini API Configuration
VITE_GEMINI_API_KEY=sk-proj-xxxxxxxxxxxxx

# API Server Configuration
VITE_API_BASE_URL=http://localhost:3000

# Environment
VITE_ENV=development
```

**Security**:
- `.env.local` is gitignored - never commit
- Use `.env.example` as template for team documentation
- Rotate API keys regularly
- Use separate keys for development/production

## Deploying Secrets

### Adding Secrets via GitHub CLI
```bash
gh secret set GEMINI_API_KEY --body "your_api_key_here"
```

### Adding Secrets via GitHub Web UI
1. Navigate to repository Settings
2. Select "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Enter name and value
5. Click "Add secret"

## Rotating Secrets

When secrets need rotation:

1. Generate new API key at [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Update the secret in GitHub:
   ```bash
   gh secret set GEMINI_API_KEY --body "new_api_key"
   ```
3. Verify new deployments work
4. Invalidate/delete old API key at Google AI Studio
5. Document rotation in CHANGELOG.md

## Troubleshooting

### "Repository not found" in CI/CD
- Verify `GITHUB_TOKEN` has correct permissions
- Check workflow file syntax
- Ensure secrets are spelled correctly (case-sensitive)

### API key not working in build
- Verify `GEMINI_API_KEY` is set correctly
- Check key is not expired or revoked
- Verify `VITE_GEMINI_API_KEY` matches in workflow and code

### "Request denied" from Gemini API
- Check API key has correct permissions
- Verify quota not exceeded
- Check Gemini API is enabled in Google Cloud project

## Secrets Audit Trail

Track secret changes in CHANGELOG.md:
```markdown
### Security
- Rotated GEMINI_API_KEY on 2026-07-17
- Updated GitHub Actions permissions for Pages deployment
```

## References

- [GitHub Secrets Management](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Google Gemini API Keys](https://ai.google.dev/tutorials/python_quickstart)
- [Actions Environment Variables](https://docs.github.com/en/actions/learn-github-actions/environment-variables)
