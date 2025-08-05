FROM node:24.1.0-alpine

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .

RUN npm config set strict-ssl false

RUN npm install -g @nestjs/cli
RUN npm ci

EXPOSE 3000

COPY . .

CMD ["bash", "-c", "nest start --watch"]