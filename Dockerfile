FROM node:alpine


WORKDIR /app

COPY package.json ./

# Install Jest
RUN npm install --save-dev jest
# Copy package.json to the image

# Install dependencies
RUN npm install


ENTRYPOINT ["sh"]

