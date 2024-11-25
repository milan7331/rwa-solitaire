FROM node:23-bookworm

WORKDIR /usr/src/app

COPY package.json .

RUN npm config set strict-ssl false

RUN npm install --verbose

EXPOSE 3000

COPY . .

CMD ["bash", "-c", "nest start --watch"]