FROM node:boron

# Build application directory
RUN mkdir -p /usr/src/app/config && mkdir -p /usr/src/app/app 
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY config /usr/src/app/config
COPY app /usr/src/app/app

EXPOSE 3000
CMD [ "node", "/usr/src/app/app/app.js" ]