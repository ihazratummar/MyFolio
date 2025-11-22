FROM node:18-alpine AS base

# Metadata labels
LABEL maintainer="myfolio"
LABEL description="Next.js Portfolio Application"
LABEL version="1.0"

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; fi


# Rebuild the source code only when needed
FROM base AS builder

# Accept build arguments for environment variables
ARG MONGODB_URI
ARG ADMIN_PASSWORD

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build time
# Next.js needs these at build time for API routes and middleware
ENV MONGODB_URI=${MONGODB_URI}
ENV ADMIN_PASSWORD=${ADMIN_PASSWORD}

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Debug: Show node version and environment
RUN echo "Node version: $(node --version)" && \
    echo "NPM version: $(npm --version)" && \
    echo "MongoDB URI set: ${MONGODB_URI:+YES}" && \
    echo "Admin password set: ${ADMIN_PASSWORD:+YES}"

# Run build with error handling
RUN \
  if [ -f yarn.lock ]; then \
    echo "Building with Yarn..." && yarn run build; \
  elif [ -f package-lock.json ]; then \
    echo "Building with NPM..." && npm run build 2>&1 | tee build.log || (cat build.log && exit 1); \
  elif [ -f pnpm-lock.yaml ]; then \
    echo "Building with PNPM..." && corepack enable pnpm && pnpm run build; \
  else \
    echo "ERROR: Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Disable telemetry during runtime
ENV NEXT_TELEMETRY_DISABLED=1

# Don't run as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
# set hostname to 0.0.0.0 to allow external connections
ENV HOSTNAME="0.0.0.0"

# Healthcheck to ensure the container is running properly
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/projects', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]
