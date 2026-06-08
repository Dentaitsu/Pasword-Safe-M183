FROM maven:3.9.8-eclipse-temurin-21 AS dev

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src

CMD ["mvn", "spring-boot:run"]