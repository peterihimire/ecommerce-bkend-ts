
FROM node:19 as development
ENV NODE_ENV development
WORKDIR /usr/app
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 4040:4040
RUN npm run build

FROM node:19 as production
ARG NODE_ENV=production
ENV NODE_ENV =${NODE_ENV}
WORKDIR /usr/app
COPY package*.json .
RUN npm install --only=production
COPY --from=development /usr/app/dist ./dist
CMD [ "node", "dist/index.js" ]

