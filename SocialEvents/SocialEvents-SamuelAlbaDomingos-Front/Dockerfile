FROM node:22-alpine AS build
WORKDIR /usr/src/app
COPY react-proyecto/package.json .
RUN npm install
RUN npm install react-calendar swiper html5-qrcode
COPY react-proyecto .
RUN npm run build

FROM nginx:alpine
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
