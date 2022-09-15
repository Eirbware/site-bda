FROM node:16-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn run generate
RUN yarn run migrate
EXPOSE 3001
CMD ['yarn', 'run', 'start']
