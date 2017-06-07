FROM node

MAINTAINER pdthang <pdthang59@gmail.com>

# Create app folder
RUN mkdir -p /app

WORKDIR /app

COPY ./www/  /app

RUN npm install --save
RUN apt-get update
RUN apt-get install -y vim

EXPOSE 80 443

CMD ["node", "keystone.js"]