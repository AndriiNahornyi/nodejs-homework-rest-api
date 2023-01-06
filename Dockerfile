
FROM node:16.19.0

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

CMD [ "node", "server.js" ]

# 1. Buikding your image:   docker build . -t andrii/homework

# 2. Run the image:         docker run -p 3000:3000 -d andrii/homework
