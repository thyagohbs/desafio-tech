# Dockerfile para o Frontend
FROM node:18-alpine AS build

# Diretório de trabalho
WORKDIR /usr/src/

# Instalar dependências e construir o frontend
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Servir a aplicação usando nginx
FROM nginx:alpine

# Copiar os arquivos do build para o nginx
COPY --from=build /usr/src/build /usr/share/nginx/html

# Expor a porta padrão do nginx
EXPOSE 80

# Configuração do nginx já está no entrypoint
CMD ["nginx", "-g", "daemon off;"]
