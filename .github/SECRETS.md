# GitHub Secrets Configuration

This guide explains how to set up and manage secrets for the F2K repository.

## Required Secrets

### GEMINI_API_KEY
**Purpose**: Google Gemini API access for AI recipe generation

**Setup Instructions:**

1. **Get API Key:**
   - Visit https://aistudio.google.com/app/apikey
   - Click "Create API Key"
   - Copy the key value

2. **Add to GitHub:**
   - Go to Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `GEMINI_API_KEY`
   - Value: Paste your API key
   - Click "Add secret"

3. **Using in Workflows:**
   ```yaml
   env:
     GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
   ```

4. **Using in Local Development:**
   - Add to `.env.local`:
     ```
     VITE_GEMINI_API_KEY=your_api_key_here
     ```
   - **Never commit `.env.local`** - it's in `.gitignore`

## Secret Rotation

To rotate a secret:

1. Create new API key in Google AI Studio
2. Update the secret value in GitHub Settings
3. Test that CI/CD pipeline still works
4. Delete old API key from Google AI Studio

## Security Best Practices

- ✅ Secrets are encrypted and only exposed to Actions
- ✅ Log all access to secrets (GitHub audit logs)
- ✅ Rotate keys periodically (quarterly recommended)
- ✅ Use separate keys for development and production
- ❌ Never print secrets to logs
- ❌ Never commit secrets to version control
- ❌ Never share secrets in issues or PRs

## Viewing Secret Activity

Go to Settings → Audit log to view:
- When secrets were accessed
- Which Actions accessed them
- Any secret rotation events

---

For more info, see [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
