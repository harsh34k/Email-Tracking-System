# Use a specific version of the Bun image
FROM jarredsumner/bun:0.8.0

WORKDIR /usr/src/app

COPY package.json bun.lockb ./

RUN bun install

COPY . .

EXPOSE 3000

CMD ["bun", "src/index.ts"]
