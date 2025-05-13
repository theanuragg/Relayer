FROM node:23-alpine


WORKDIR /app

COPY package*.json ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm build


EXPOSE 3000

CMD [ "npm", "run", "start" ]