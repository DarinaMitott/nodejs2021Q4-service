FROM node:16-alpine
WORKDIR /app

COPY . .
RUN npm i && npm cache clean --force

EXPOSE 4000
CMD [ "npm", "start" ]
