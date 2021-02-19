FROM node:alpine

MAINTAINER Joe Mordica

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]
