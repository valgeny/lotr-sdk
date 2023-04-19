ARG nodeVersion=16.19.0
ARG alpineVersion=3.17
ARG PROD_NODE_MODULES_PATH=/tmp/prod_node_modules
ARG scannerVersion=latest
ARG buildDir=dist
ARG NPM_AUTH
ARG NPM_EMAIL

#base layer
FROM hub.docker.prod.com/library/node:${nodeVersion}-alpine${alpineVersion} AS base
RUN SYS_MAJ_VER=$( grep '^VERSION' /etc/os-release|awk -F= '{ print $2 }'|awk -F. '{ print("v"$1"."$2) }') \
    && echo "http://ark-repos.wal-mart.com/ark/apk/published/alpine/3.17/direct/soe/noenv/community/" > /etc/apk/repositories \
    && echo "http://ark-repos.wal-mart.com/ark/apk/published/alpine/3.17/direct/soe/noenv/main/" >> /etc/apk/repositories \
    && apk update && apk upgrade 

RUN apk --no-cache add \
  bash \
  g++ \
  ca-certificates \
  lz4-dev \
  musl-dev \
  cyrus-sasl-dev \
  openssl-dev \
  make \
  python3

RUN apk add --no-cache --virtual .build-deps gcc zlib-dev libc-dev bsd-compat-headers py-setuptools bash
RUN apk --no-cache add \
    tini 

RUN rm -rf /var/cache/* \
    && mkdir /var/cache/apk



WORKDIR /root/app
ENTRYPOINT ["/sbin/tini", "--"]

#dependencies
FROM base as dependencies
ARG NPM_AUTH
ARG NPM_EMAIL
ARG PROD_NODE_MODULES_PATH
# Conditionally copy the .npmrc if it exists. For this to work, we
# need to have one file that absolutely exists and also some optional
# files (which need a glob). See https://stackoverflow.com/a/46801962/4972



COPY package-lock.json .
# download prod deps and cache them
RUN npm set progress false \
  && npm config set depth 0 \
  && npm config set strict-ssl false \
  && npm config set _auth ${NPM_AUTH} && npm config set email ${NPM_EMAIL}

RUN npm install --only=production --loglevel verbose --ignore-scripts


RUN cp -R node_modules "${PROD_NODE_MODULES_PATH}"

RUN npm install

#Splitting copy of source to ensure caching of npm_modules
COPY . .
RUN npm run compile

RUN npm publish
