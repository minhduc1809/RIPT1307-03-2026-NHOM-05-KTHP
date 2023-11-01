# 1. For build React app
FROM node:16-alpine AS development


# Set environment variables
ENV APP_CONFIG_IP_ROOT=https://ais.aisenote.com/dev/
ENV APP_CONFIG_ONE_SIGNAL_ID=f3857a81-2891-49be-87a7-903a4a1a54be
ENV APP_CONFIG_SENTRY_DSN=https://ed934e521d476c44a89a42aaa8a6993a@sentry.aisoftech.vn/3
ENV APP_CONFIG_KEYCLOAK_AUTHORITY=https://ais.aisenote.com/dev/keycloak/realms/vwa
ENV APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID=vwa-
ENV APP_CONFIG_APP_VERSION=231101

ENV APP_CONFIG_CO_QUAN_CHU_QUAN='Hội Liên hiệp phụ nữ Việt Nam'
ENV APP_CONFIG_TEN_TRUONG='Học viện Phụ nữ Việt Nam'
ENV APP_CONFIG_TIEN_TO_TRUONG='Học viện'
ENV APP_CONFIG_TEN_TRUONG_VIET_TAT_TIENG_ANH=VWA
ENV APP_CONFIG_PRIMARY_COLOR=#007EB9

ENV APP_CONFIG_URL_LANDING=http://portal-vwa.aisenote.com/
ENV APP_CONFIG_URL_CONNECT=https://vwa-connect-dev.vercel.app/
ENV APP_CONFIG_URL_CAN_BO=https://cong-can-bo-vwa-dev.vercel.app/
ENV APP_CONFIG_URL_DAO_TAO=https://qldt-vwa-dev.vercel.app/
ENV APP_CONFIG_URL_NHAN_SU=https://tcns-vwa-dev.vercel.app/
ENV APP_CONFIG_URL_TAI_CHINH=https://tai-chinh-vwa-dev.vercel.app/
ENV APP_CONFIG_URL_CTSV=https://ctsv-vwa-dev.vercel.app/
ENV APP_CONFIG_URL_QLKH=https://qlkh-vwa-dev.vercel.app/
ENV APP_CONFIG_URL_VPS=https://van-phong-vwa-dev.vercel.app/
ENV APP_CONFIG_URL_CORE=https://core-vwa-dev.vercel.app/

ENV APP_CONFIG_TITLE_CONNECT='Cổng người học'
ENV APP_CONFIG_TITLE_CAN_BO='Cổng cán bộ'
ENV APP_CONFIG_TITLE_DAO_TAO='Quản lý đào tạo'
ENV APP_CONFIG_TITLE_NHAN_SU='Tổ chức nhân sự'
ENV APP_CONFIG_TITLE_TAI_CHINH='Tài chính'
ENV APP_CONFIG_TITLE_CTSV='Công tác sinh viên'
ENV APP_CONFIG_TITLE_QLKH='Quản lý khoa học'
ENV APP_CONFIG_TITLE_VPS='Văn phòng điều hành'
ENV APP_CONFIG_TITLE_CORE='Danh mục chung'


# Set working directory
WORKDIR /app

COPY package.json /app/
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
