# 1. For build React app
FROM node:16-alpine AS development


# Set environment variables
ENV APP_CONFIG_IP_ROOT=https://ais.aisenote.com/dev/
ENV APP_CONFIG_IP_GLOBAL=https://ais2.aisenote.com/qldt-internal-api
ENV APP_CONFIG_PRIMARY_COLOR=#007EB9
ENV APP_CONFIG_LANDING_URL=http://portal-vwa.aisenote.com/
ENV APP_CONFIG_TEN_PHAN_HE="Tổ chức nhân sự"
ENV APP_CONFIG_ONE_SIGNAL_ID=f3857a81-2891-49be-87a7-903a4a1a54be
ENV APP_CONFIG_SENTRY_DSN=https://ed934e521d476c44a89a42aaa8a6993a@sentry.aisoftech.vn/3
ENV APP_CONFIG_KEYCLOAK_AUTHORITY=keycloak/realms/vwa
ENV APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID=vwa-
ENV APP_CONFIG_KEYCLOAK_TOKEN_ENDPOINT_ID=keycloak/realms/vwa/protocol/openid-connect/token
ENV APP_CONFIG_TEN_TRUONG="Học viện Phụ nữ Việt Nam"
ENV APP_CONFIG_TEN_TRUONG_VIET_TAT_TIENG_ANH=VWA
ENV APP_CONFIG_TIEN_TO_TRUONG="Học viện"
ENV APP_CONFIG_VERCEL_TEAM=vwa-dev


# Set working directory
WORKDIR /app

COPY package.json yarn.lock /app/
RUN yarn install

COPY . /app

FROM development AS build
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/.nginx/nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /var/www/website

RUN rm -rf ./*
COPY --from=build /app/dist .
ENTRYPOINT ["nginx", "-g", "daemon off;"]
