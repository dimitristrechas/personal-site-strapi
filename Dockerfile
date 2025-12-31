FROM node:22-alpine AS base
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev git > /dev/null 2>&1

FROM base AS deps
WORKDIR /opt/
COPY package.json yarn.lock ./
RUN yarn global add node-gyp && \
    yarn config set network-timeout 600000 -g && \
    yarn install --frozen-lockfile --prefer-offline
ENV PATH=/opt/node_modules/.bin:$PATH

FROM base AS build
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /opt/
COPY --from=deps /opt/node_modules ./node_modules
ENV PATH=/opt/node_modules/.bin:$PATH
WORKDIR /opt/app
COPY tsconfig.json package.json ./
COPY config ./config
COPY src ./src
COPY public ./public
RUN yarn build

FROM base AS prod-deps
WORKDIR /opt/
COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile --prefer-offline --ignore-scripts

FROM node:22-alpine
RUN apk add --no-cache vips-dev
ENV NODE_ENV=production
WORKDIR /opt/
COPY --from=prod-deps /opt/node_modules ./node_modules
WORKDIR /opt/app
COPY --from=build /opt/app ./
ENV PATH=/opt/node_modules/.bin:$PATH

RUN chown -R node:node /opt/app
USER node
EXPOSE 1337
CMD ["yarn", "start"]
