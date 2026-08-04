# Estágio 1: Compilação da aplicação Spring Boot
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Copia os arquivos do Maven Wrapper e o pom.xml da pasta backend
COPY backend/.mvn/ .mvn
COPY backend/mvnw backend/pom.xml ./

# Dá permissão de execução ao script do Maven
RUN chmod +x mvnw

# Baixa as dependências
RUN ./mvnw dependency:go-offline

# Copia o código fonte da pasta backend e gera o JAR
COPY backend/src ./src
RUN ./mvnw clean package -DskipTests

# Estágio 2: Imagem final leve para execução em produção
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copia o JAR gerado
COPY --from=build /app/target/*.jar app.jar

# Porta padrão de execução
EXPOSE 8080

# Comando para iniciar a aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]
