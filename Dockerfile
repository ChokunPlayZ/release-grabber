FROM node:18

WORKDIR /app/downloader

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "node", "." ]