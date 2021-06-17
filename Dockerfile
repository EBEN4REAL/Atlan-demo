FROM node:16-alpine as builder
WORKDIR /app
COPY ./ .npmrc /app/
RUN npm install
RUN npm run build
FROM nginx:1.12.0
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/ /usr/share/nginx/html
EXPOSE 80