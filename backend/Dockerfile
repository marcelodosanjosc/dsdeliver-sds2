# Estágio 1: Compilação da aplicação com Maven Wrapper
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Copia os arquivos do Maven Wrapper e o pom.xml
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Dá permissão de execução ao script do Maven
RUN chmod +x mvnw

# Baixa as dependências (otimiza o cache de build do Docker)
RUN ./mvnw dependency:go-offline

# Copia o código fonte e gera o pacote .jar
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Estágio 2: Imagem final leve para execução em produção
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copia o JAR gerado no estágio de build
COPY --from=build /app/target/*.jar app.jar

# Porta padrão de escuta
EXPOSE 8080

# Comando para iniciar a aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]
