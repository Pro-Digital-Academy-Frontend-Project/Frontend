# 1단계: 빌드 단계 (node:22 사용)
FROM node:22 AS build

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# 빌드 실행
RUN npm run build

# 2단계: Nginx로 배포 (경량화된 Nginx 이미지를 사용)
FROM nginx:alpine

# 빌드된 파일만 Nginx로 복사
COPY --from=build /app/dist /usr/share/nginx/html

# 80 포트 개방
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]