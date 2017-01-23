FROM node:6.9.1

RUN mkdir /usr/sideServer
RUN mkdir /usr/sideServer/app
WORKDIR /usr/sideServer/app

COPY ./package.json /usr/sideServer/app/

RUN npm install
RUN npm install pm2 -g
COPY . /usr/sideServer/app/

EXPOSE 3000

CMD ["pm2-docker", "./bin/www"]