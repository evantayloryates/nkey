# base node image
FROM node:18-bullseye-slim as base

# install openssl and sqlite3 for prisma
RUN apt-get update && apt-get install -y openssl sqlite3 fuse3 ca-certificates

# install all node_modules, including dev
FROM base as deps

RUN mkdir /app/
WORKDIR /app/

ADD package.json package-lock.json ./
RUN npm install

# setup production node_modules
FROM base as production-deps

RUN mkdir /app/
WORKDIR /app/

COPY --from=deps /app/node_modules /app/node_modules
ADD package.json package-lock.json ./
RUN npm prune --omit=dev

# build app
FROM base as build

RUN mkdir /app/
WORKDIR /app/

COPY --from=deps /app/node_modules /app/node_modules

# schema doesn't change much so these will stay cached
ADD prisma /app/prisma
RUN npx prisma generate

# app code changes all the time
ADD . .
RUN npm run build

# build smaller image for running
FROM base

ENV LITEFS_DIR="/litefs"
ENV DATABASE_FILENAME="$LITEFS_DIR/sqlite.db"
ENV DATABASE_URL="file:$DATABASE_FILENAME"
ENV INTERNAL_PORT="8080"
ENV PORT="8081"
ENV NODE_ENV="production"

RUN mkdir /app/
WORKDIR /app/

COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/node_modules/.prisma /app/node_modules/.prisma

COPY --from=build /app/server-build /app/server-build
COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public
COPY --from=build /app/prisma /app/prisma


ADD . .

COPY --from=flyio/litefs:0.5 /usr/local/bin/litefs /usr/local/bin/litefs
ADD litefs.yml /etc/litefs.yml

CMD ["litefs", "mount"]
