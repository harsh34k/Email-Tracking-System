# Use Node.js base image
FROM node:18

WORKDIR /usr/src/app

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash

# Set Bun as the default package manager
ENV PATH="/root/.bun/bin:$PATH"

COPY package.json bun.lockb ./

RUN bun install

COPY . .

EXPOSE 3000

CMD ["bun", "src/index.ts"]
