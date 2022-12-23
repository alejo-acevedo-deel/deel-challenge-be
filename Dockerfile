FROM node:16

COPY package.json package-lock.json ./

RUN npm ci

COPY src ./src
COPY scripts ./scripts

EXPOSE 3001

CMD ["npm", "start"]