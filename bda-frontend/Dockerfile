# This Dockerfile builds a ViteJS Vue3 project

# Build the project
FROM node:16-alpine AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

# Serve the project using Apache
FROM httpd:2.4-alpine
COPY --from=build /app/dist /usr/local/apache2/htdocs/
EXPOSE 80