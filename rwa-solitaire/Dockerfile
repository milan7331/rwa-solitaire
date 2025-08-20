FROM node:24.1.0-alpine

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .

RUN npm config set strict-ssl false

RUN npm install -g @angular/cli
RUN npm ci

EXPOSE 4200

COPY . .

CMD ["bash", "-c", "ng serve --host 0.0.0.0 --port 4200"]