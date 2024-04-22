FROM node:16 as build-stage
WORKDIR /app
COPY ./package*.json ./
RUN npm install
COPY ./ .
RUN npm run build

FROM nginx as production-stage
EXPOSE 3000
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY ./script/dev/nginx/nginx.conf /etc/nginx/conf.d/default.conf
