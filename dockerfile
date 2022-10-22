FROM node:14

WORKDIR /app
COPY .  /app/
EXPOSE 4000
CMD npm run build &&  npm run start
