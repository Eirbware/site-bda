FROM node:16-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn run generate
RUN ["chmod", "+x", "/app/entrypoint.sh"]
CMD ./entrypoint.sh
