FROM node:20-alpine3.19

WORKDIR /usr/src/app

COPY package*.json ./
COPY package-lock*.json ./

RUN npm install -g yarn
RUN yarn install

COPY . .

Run npm run start:dev

EXPOSE 3000
