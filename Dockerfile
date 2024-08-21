FROM node:18 AS deps

WORKDIR /usr/src/app

RUN curl -fsSL https://bun.sh/install | bash

ENV PATH="/root/.bun/bin:$PATH"

COPY package.json bun.lockb ./
RUN bun install

FROM node:18 AS build

WORKDIR /usr/src/app

COPY --from=deps /root/.bun /root/.bun
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

FROM node:18-slim AS runner

WORKDIR /usr/src/app


ENV PATH="/root/.bun/bin:$PATH"

COPY --from=build /root/.bun /root/.bun
COPY --from=build /usr/src/app /usr/src/app

EXPOSE 3000

CMD ["bun", "src/index.ts"]
