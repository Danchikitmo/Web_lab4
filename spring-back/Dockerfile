FROM openjdk:17-jdk-slim AS build

# Устанавливаем Maven
RUN apt-get update && apt-get install -y maven

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем pom.xml и загружаем зависимости
COPY pom.xml .
RUN mvn dependency:go-offline

# Копируем исходный код
COPY src /app/src

# Строим проект
RUN mvn clean package -DskipTests

# Указываем команду для запуска
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/web4-spring-0.0.1-SNAPSHOT.war /app/web4-spring.war

# Порт, на котором будет работать приложение
EXPOSE 8080

# Запуск приложения
ENTRYPOINT ["java", "-jar", "web4-spring.war"]
