# Deploying to Airbase

## Quick Deploy

```bash
# Build the container
airbase container build

# Deploy to production
airbase container deploy --yes
```

Your app will be available at: https://learning-pathfinder.app.tc1.airbase.sg

## Deploy to Staging First (Recommended)

```bash
# Build the container
airbase container build

# Deploy to staging
airbase container deploy --yes staging

# Test at: https://learning-pathfinder-staging.app.tc1.airbase.sg
# Then deploy to production:
airbase container deploy --yes
```

## Redeploy After Changes

```bash
# After making code changes:
airbase container build
airbase container deploy --yes
```

## Common Issues

### Build fails
- Make sure Docker is running
- Check Dockerfile syntax
- Ensure all files are committed

### Deploy fails
- Verify `airbase.json` handle matches your Airbase Console project
- Check authentication: `airbase login`
- Ensure port 3000 is correctly configured

### App not accessible
- Wait 1-2 minutes for deployment to complete
- Check deployment logs in Airbase Console
- Verify URL format: https://learning-pathfinder.app.tc1.airbase.sg
