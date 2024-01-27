FROM node:21-alpine
RUN apk add git
WORKDIR /usr/src/app
COPY ./* .
COPY ./src ./src
RUN chown node:node .
USER node
RUN npm ci && npm cache clean --force

EXPOSE 8092

CMD [ "npm", "start" ]