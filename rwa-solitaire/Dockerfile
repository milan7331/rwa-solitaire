
FROM node:23-bookworm

# postavi radni direktorijum
WORKDIR /usr/src/app

# kopiramo listu paketa i zatim instaliramo
COPY package.json /usr/src/app

RUN npm config set strict-ssl false

RUN npm install -g @angular/cli --verbose
RUN npm install --verbose

EXPOSE 4200

# kopiramo sve fajlove is direktorijuma u kontejner
COPY . .

CMD ["bash", "-c", "ng serve --host 0.0.0.0 --port 4200"]
# --poll 1000