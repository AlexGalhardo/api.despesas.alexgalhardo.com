# Use the official Bun image
FROM oven/bun:latest

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first for caching
COPY package*.json ./

ARG NODE_VERSION=22

RUN apt update \
    && apt install -y curl

RUN curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n \
    && bash n $NODE_VERSION \
    && rm n \
    && npm install -g n

COPY . .

# Install project dependencies using Bun
RUN bun install

# Copy environment variables file
RUN cp .env.example .env

# Run Prisma generate command
RUN npx prisma generate

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["bun", "run", "dev"]
