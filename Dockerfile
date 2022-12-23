FROM node:16

COPY package.json package-lock.json ./
COPY src ./src
COPY scripts ./scripts

RUN npm ci
RUN npm run seed

EXPOSE 3001

CMD ["npm", "start"]