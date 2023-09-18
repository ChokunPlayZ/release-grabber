FROM oven/bun

WORKDIR /app/downloader

COPY package*.json ./

RUN bun i

COPY . .

CMD [ "bun", "." ]