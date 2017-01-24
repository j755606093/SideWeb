FROM node:6.9.1

RUN mkdir /usr/sideServer
RUN mkdir /usr/sideServer/app
COPY . /usr/sideServer/app/
WORKDIR /usr/sideServer/app
RUN npm install
RUN npm install pm2 -g

EXPOSE 3000

ENTRYPOINT ["pm2","start","./bin/www","--no-daemon"]
