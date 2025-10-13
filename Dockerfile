FROM node:20-bullseye

RUN corepack enable

RUN apt-get update && apt-get install -y \
  build-essential \
  python3 \
  libvips-dev \
  git

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/
COPY package.json yarn.lock ./

RUN yarn global add node-gyp
RUN yarn install --frozen-lockfile

WORKDIR /opt/app
COPY . .
RUN yarn build

RUN chown -R node:node /opt/app
USER node

EXPOSE 1337

CMD ["yarn", "start"]
