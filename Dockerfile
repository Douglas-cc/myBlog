FROM node:18

WORKDIR ./code

COPY . . 

RUN yarn install 

CMD ["nodemon", "start"]