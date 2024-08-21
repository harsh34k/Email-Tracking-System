# Use the official Bun image
FROM jarredsumner/bun:latest

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies using Bun
RUN bun install

# Copy the rest of your application code
COPY . .

# Expose the necessary port
EXPOSE 3000

# Run the application using Bun
CMD ["bun", "src/index.ts"]
