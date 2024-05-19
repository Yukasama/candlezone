# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.12.2
FROM node:${NODE_VERSION}-alpine AS base

# Install pnpm in the base stage so it's available in all stages
ARG PNPM_VERSION=8.9.2
RUN npm install -g pnpm@${PNPM_VERSION}

# Stage 1: Rebuild the source code only when needed
FROM base AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /usr/src/app

# Use a cache mount to speed up subsequent builds.
RUN --mount=type=bind,source=package.json,target=package.json \
  --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
  --mount=type=cache,target=/root/.local/share/pnpm/store \
  pnpm i

# Stage 2: Rebuild the source code only when needed
FROM base AS builder

WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules ./node_modules

COPY src ./src
COPY public ./public

# Copy the rest of the source files into the image.
COPY . .

# Disable Next.js telemetry.
ENV NEXT_TELEMETRY_DISABLED 1

# Environment variables must be present at build time
ARG CRON_SECRET
ARG LOG_LEVEL
ARG DATABASE_URL
ARG AUTH_SECRET
ARG AUTH_GOOGLE_ID
ARG AUTH_GOOGLE_SECRET
ARG AUTH_FACEBOOK_ID
ARG AUTH_FACEBOOK_SECRET
ARG AUTH_GITHUB_ID
ARG AUTH_GITHUB_SECRET
ARG EMAIL_FROM
ARG RESEND_API_KEY
ARG STRIPE_API_KEY
ARG STRIPE_WEBHOOK_SECRET
ARG NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID
ARG FMP_API_KEY

ENV CRON_SECRET=${CRON_SECRET}
ENV LOG_LEVEL=${LOG_LEVEL}
ENV DATABASE_URL=${DATABASE_URL}
ENV AUTH_SECRET=${AUTH_SECRET}
ENV AUTH_GOOGLE_ID=${AUTH_GOOGLE_ID}
ENV AUTH_GOOGLE_SECRET=${AUTH_GOOGLE_SECRET}
ENV AUTH_FACEBOOK_ID=${AUTH_FACEBOOK_ID}
ENV AUTH_FACEBOOK_SECRET=${AUTH_FACEBOOK_SECRET}
ENV AUTH_GITHUB_ID=${AUTH_GITHUB_ID}
ENV AUTH_GITHUB_SECRET=${AUTH_GITHUB_SECRET}
ENV EMAIL_FROM=${EMAIL_FROM}
ENV RESEND_API_KEY=${RESEND_API_KEY}
ENV STRIPE_API_KEY=${STRIPE_API_KEY}
ENV STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}
ENV NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}
ENV FMP_API_KEY=${FMP_API_KEY}

# Build the application.
RUN pnpm run build

# Stage 3: Production image, copy all the files and run next.
FROM base AS runner

# Set working directory for the final stage.
WORKDIR /usr/src/app

# Disable Next.js telemetry.
ENV NEXT_TELEMETRY_DISABLED 1

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder /usr/src/app/public ./public
COPY --from=deps /usr/src/app/node_modules ./node_modules

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/.next/static ./.next/static

# Environment variables must be redefined at run time
ARG CRON_SECRET
ARG LOG_LEVEL
ARG DATABASE_URL
ARG AUTH_SECRET
ARG AUTH_GOOGLE_ID
ARG AUTH_GOOGLE_SECRET
ARG AUTH_FACEBOOK_ID
ARG AUTH_FACEBOOK_SECRET
ARG AUTH_GITHUB_ID
ARG AUTH_GITHUB_SECRET
ARG EMAIL_FROM
ARG RESEND_API_KEY
ARG STRIPE_API_KEY
ARG STRIPE_WEBHOOK_SECRET
ARG NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID
ARG FMP_API_KEY

ENV CRON_SECRET=${CRON_SECRET}
ENV LOG_LEVEL=${LOG_LEVEL}
ENV DATABASE_URL=${DATABASE_URL}
ENV AUTH_SECRET=${AUTH_SECRET}
ENV AUTH_GOOGLE_ID=${AUTH_GOOGLE_ID}
ENV AUTH_GOOGLE_SECRET=${AUTH_GOOGLE_SECRET}
ENV AUTH_FACEBOOK_ID=${AUTH_FACEBOOK_ID}
ENV AUTH_FACEBOOK_SECRET=${AUTH_FACEBOOK_SECRET}
ENV AUTH_GITHUB_ID=${AUTH_GITHUB_ID}
ENV AUTH_GITHUB_SECRET=${AUTH_GITHUB_SECRET}
ENV EMAIL_FROM=${EMAIL_FROM}
ENV RESEND_API_KEY=${RESEND_API_KEY}
ENV STRIPE_API_KEY=${STRIPE_API_KEY}
ENV STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}
ENV NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}
ENV FMP_API_KEY=${FMP_API_KEY}

# Ensure the non-root user has the appropriate permissions.
USER nextjs

# Run the application.
CMD ["pnpm", "start"]
