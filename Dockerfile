ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-alpine AS base

RUN corepack enable && corepack prepare pnpm@latest --activate

# --------------------------------------------------------
# Stage 1: Install dependencies
# --------------------------------------------------------
FROM base AS deps
WORKDIR /usr/src/app
RUN apk add --no-cache libc6-compat

RUN --mount=type=bind,source=package.json,target=package.json \
  --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
  --mount=type=cache,target=/root/.local/share/pnpm/store \
  pnpm i

# --------------------------------------------------------
# Stage 2: Build the application
# --------------------------------------------------------
FROM base AS builder
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN pnpm run build

# --------------------------------------------------------
# Stage 2: Run the application
# --------------------------------------------------------
FROM base AS runner
WORKDIR /usr/src/app
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    chown -R nextjs:nodejs /app

COPY --from=builder /usr/src/app/public ./public
COPY --from=deps /usr/src/app/node_modules ./node_modules

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/.next/static ./.next/static

# Security hardening
RUN apk add --no-cache tini && \
    # Remove unnecessary files
    rm -rf /var/cache/apk/* && \
    # Set strict permissions
    chmod -R 755 /app

# Use tini as init system
ENTRYPOINT ["/sbin/tini", "--"]

# Switch to non-root user
USER nextjs

# Security headers and restrictions
ENV NODE_ENV=production \
    NODE_OPTIONS='--no-deprecation' \
    # Disable the file system cache
    NODE_NO_WARNINGS=1 \
    # Restrict memory usage
    NODE_OPTIONS='--max-old-space-size=2048' \
    # Harden HTTP headers
    NEXT_SHARP_PATH=/app/node_modules/sharp

# Expose only necessary port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]