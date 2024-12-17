# Use Node.js v14
FROM node:14



# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .


CMD [ "node", "index.js" ]
