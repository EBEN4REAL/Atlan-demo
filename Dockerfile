FROM node:16-alpine as builder
WORKDIR /app
COPY ./ .npmrc /app/
RUN echo "Node Version " && node --version && echo "NPM Version " && npm --version
RUN npm install --save --legacy-peer-deps
ENV GENERATE_SOURCEMAP=false
RUN npm run build
FROM nginx:1.12.0
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/ /usr/share/nginx/html
EXPOSE 80
