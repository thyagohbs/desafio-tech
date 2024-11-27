# Etapa de build
FROM node:18 AS build

WORKDIR /usr/src/

# Copiar o arquivo package.json e package-lock.json (ou yarn.lock) para instalar dependências
COPY package*.json ./

# Instalar as dependências do projeto
RUN npm install

# Copiar todos os arquivos do projeto para o contêiner
COPY . .

# Compilar o código TypeScript para JavaScript (se aplicável)
RUN npm run build  

# Etapa de produção
FROM node:18

WORKDIR /usr/src/

# Copiar o arquivo .env para o container
#COPY ./.env ./.env 

# Copiar os arquivos compilados do contêiner de build
COPY --from=build /usr/src/dist /usr/src/dist

# Copiar o package.json e o package-lock.json para o contêiner de produção
COPY --from=build /usr/src/package*.json ./

# Instalar dependências de produção
RUN npm install --only=production

# Expor a porta em que a API será executada
EXPOSE 8080

# Comando para iniciar a aplicação
#CMD ["node", "dist/index.js"]

COPY wait-for-it.sh /usr/src/wait-for-it.sh
RUN chmod +x /usr/src/wait-for-it.sh
CMD ["./wait-for-it.sh", "db:3306", "--", "npm", "start"]

