FROM node:18-alpine AS builder
WORKDIR /build
COPY build.js ./
RUN node build.js

FROM nginx:alpine
COPY --from=builder /tmp/index.html /usr/share/nginx/html/index.html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
