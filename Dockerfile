FROM node:12.18-alpine

WORKDIR /usr/src/app
COPY package.json .
RUN npm install
COPY . .
ENV NODE_ENV=debug
EXPOSE 3000
ENTRYPOINT [ "npm", "start" ]
