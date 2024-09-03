FROM node:22-alpine

COPY . .

RUN npm i -

WORKDIR /prisma

CMD ["npx", "prisma", "db", "push", "--skip-generate"]