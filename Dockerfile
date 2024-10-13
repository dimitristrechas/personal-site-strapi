FROM node:18-bullseye

# Install build tools and libvips for sharp
RUN apt-get update && apt-get install -y \
  build-essential \
  python3 \
  libvips-dev \
  git

WORKDIR /opt/
COPY package.json yarn.lock ./

# Install sharp separately to avoid issues
RUN yarn add sharp --platform=linux --arch=x64

# Install node-gyp globally
RUN yarn global add node-gyp

# Install remaining project dependencies
RUN yarn install --network-timeout 600000

# Set up application
WORKDIR /opt/app
COPY . .
RUN chown -R node:node /opt/app
USER node

RUN ["yarn", "build"]
EXPOSE 1337
CMD ["yarn", "develop"]
