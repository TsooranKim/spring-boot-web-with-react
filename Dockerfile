FROM node:18-alpine AS node-builder

RUN ["corepack", "enable"]

WORKDIR /app
COPY ./front .

RUN pnpm install

FROM openjdk:17 AS java-builder

WORKDIR /app
COPY ./back .
COPY --from=node-builder /app/dist ./src/main/resources/static

RUN ["chmod", "+x", "./gradlew"]
RUN microdnf install findutils
RUN ./gradlew build

FROM openjdk:17

WORKDIR /app
COPY --from=java-builder /app/build/libs/*.jar ./app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
