FROM node:6.9.1

RUN mkdir /usr/sideServer
RUN mkdir /usr/sideServer/app
COPY . /usr/sideServer/app/
WORKDIR /usr/sideServer/app
RUN npm install
RUN npm install pm2 -g
ENV ADDRESS https://app.samecity.com.cn
EXPOSE 3000

ENTRYPOINT ["pm2","start","./bin/www","--no-daemon"]
