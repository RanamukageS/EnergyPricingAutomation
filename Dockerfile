# ── Stage 1: install dependencies ────────────────────────────────────────────
FROM mcr.microsoft.com/playwright:v1.58.2-jammy AS base

WORKDIR /app

# Copy package manifests first to leverage Docker layer caching
COPY package.json package-lock.json* ./

# Install Node dependencies (including dev deps for Playwright)
RUN npm ci

# ── Stage 2: copy source and run tests ───────────────────────────────────────
FROM base AS test

WORKDIR /app

COPY . .

# Create downloads directory
RUN mkdir -p downloads

# Run the Playwright tests
CMD ["npm", "test"]
