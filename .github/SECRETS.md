# GitHub Secrets Configuration

This guide explains how to manage secrets for the F2K repository.

## Current Status

F2K currently requires **no external API keys or secrets** to run. All features use local data and mock implementations.

## Future Expansion

If you need to add secrets in the future (for integrations with external services, deployment credentials, etc.), follow this process:

## Adding a Secret

1. **Go to Repository Settings:**
   - Settings → Secrets and variables → Actions

2. **Create New Secret:**
   - Click "New repository secret"
   - Name: `YOUR_SECRET_NAME` (use UPPERCASE with underscores)
   - Value: Your secret value
   - Click "Add secret"

3. **Using in Workflows:**
   ```yaml
   env:
     YOUR_SECRET_NAME: ${{ secrets.YOUR_SECRET_NAME }}
   ```

4. **Using in Local Development:**
   - Add to `.env.local`:
     ```
     VITE_YOUR_SECRET_NAME=your_value_here
     ```
   - **Never commit `.env.local`** - it's in `.gitignore`

## Security Best Practices

- ✅ Secrets are encrypted and only exposed to Actions
- ✅ Log all access to secrets (GitHub audit logs)
- ✅ Use separate keys for development and production
- ✅ Rotate keys periodically
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
