FROM node:20-bullseye AS builder

RUN corepack enable

RUN apt-get update && apt-get install -y \
  build-essential \
  python3 \
  libvips-dev \
  git \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/app

# Copy package files first (for better caching)
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn global add node-gyp
RUN yarn install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build Strapi
ENV NODE_ENV=production
RUN yarn build

# Production stage
FROM node:20-bullseye-slim

RUN apt-get update && apt-get install -y \
  libvips \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/app

# Copy built application from builder
COPY --from=builder /opt/app ./

RUN chown -R node:node /opt/app
USER node

ENV NODE_ENV=production

EXPOSE 1337

CMD ["yarn", "start"]