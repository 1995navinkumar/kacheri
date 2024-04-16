From node:18-alpine as build
# by default root. we need it run COPY, npm commands
USER root
# place we will do rest of the stuffs
WORKDIR /app

# install package.json first so it get cached
COPY package*.json ./

RUN npm install 

# copy from repo to container
COPY . .
RUN BASE=kacheri npm run build-web
RUN npm run build-extension


EXPOSE 8000 8080


CMD ["npm", "start"]
