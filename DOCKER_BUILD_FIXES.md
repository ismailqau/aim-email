# Docker Build Fixes

## Issue Identified

The CI/CD pipeline was failing with the following error:

```
Unable to find image 'ghcr.io/ismailqau/aim-email-api:main-59dd178fb7f67fe01345ad47d15372e294274929' locally
docker: Error response from daemon: manifest unknown
```

## Root Cause

The Docker build workflow had a fundamental issue:

1. **Conditional Push**: Images were only pushed to the registry when the workflow ran on the `main` branch
2. **Unconditional Test**: The container test step always tried to pull and run images from the registry
3. **Missing Images**: For PR builds and other branches, images weren't pushed to the registry, causing the test step to fail

## Solution Implemented

### 1. Separated Build and Push Steps

**Before**: Single step that conditionally pushed based on branch

```yaml
- name: Build and push ${{ matrix.service }} Docker image
  uses: docker/build-push-action@v5
  with:
    push: ${{ github.event_name == 'push' && github.ref == 'refs/heads/main' }}
    # ... other config
```

**After**: Separate build and push steps

```yaml
- name: Build ${{ matrix.service }} Docker image
  uses: docker/build-push-action@v5
  with:
    load: true # Always build locally
    tags: |
      local-test-${{ matrix.service }}:latest
      ${{ steps.meta.outputs.tags }}

- name: Push ${{ matrix.service }} Docker image
  if: github.event_name == 'push' && github.ref == 'refs/heads/main'
  uses: docker/build-push-action@v5
  with:
    push: true # Only push on main branch
```

### 2. Updated Container Test

**Before**: Tried to run images from registry

```yaml
docker run --rm --name test-${{ matrix.service }} -d \
ghcr.io/${{ github.repository }}-${{ matrix.service }}:${{ github.ref_name }}-${{ github.sha }}
```

**After**: Uses locally built images

```yaml
docker run --rm --name test-${{ matrix.service }} -d \
local-test-${{ matrix.service }}:latest
```

### 3. Platform Optimization

- **Build step**: Uses `linux/amd64` only for faster local testing
- **Push step**: Uses `linux/amd64,linux/arm64` for multi-platform registry images

## Benefits

1. **Universal Testing**: Container tests now work for all scenarios (PRs, branches, main)
2. **Faster Builds**: Local testing uses single platform, reducing build time
3. **Proper Registry Management**: Images are only pushed to registry when appropriate
4. **Better Error Handling**: No more "manifest unknown" errors
5. **Maintained Functionality**: Docker Compose integration tests still work correctly on main branch

## Workflow Behavior

### For Pull Requests and Feature Branches

- ✅ Build Docker images locally
- ✅ Test containers using local images
- ❌ Skip pushing to registry

### For Main Branch Pushes

- ✅ Build Docker images locally
- ✅ Test containers using local images
- ✅ Push multi-platform images to registry
- ✅ Run Docker Compose integration tests

## Files Modified

- `d:\ismailqau\aim-email\.github\workflows\ci-cd.yml`: Updated Docker build and test workflow

The fix ensures reliable Docker builds across all CI/CD scenarios while maintaining the existing deployment pipeline functionality.
