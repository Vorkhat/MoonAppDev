FROM node:22-alpine AS base

ARG WORKSPACE=frontend

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
COPY ${WORKSPACE}/package.json ./${WORKSPACE}/package.json
RUN \
  if [ -f package-lock.json ]; then npm ci -w ${WORKSPACE}; \
  else echo "Lockfile not found." && exit 1; \
  fi

COPY prisma ./prisma

RUN npx prisma generate

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN \
  if [ -f package-lock.json ]; then npm run -w ${WORKSPACE} build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS next-runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/${WORKSPACE}/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/${WORKSPACE}/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/${WORKSPACE}/.next/static ./.next/static

WORKDIR /app/${WORKSPACE}

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
ENV HOSTNAME="0.0.0.0"
ENTRYPOINT ["node", "server.js"]

# Production image, copy all the files and run nodejs
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV WORKSPACE=${WORKSPACE}

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENTRYPOINT npm run start -w ${WORKSPACE}