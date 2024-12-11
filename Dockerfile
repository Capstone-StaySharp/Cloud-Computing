FROM node:18
WORKDIR /app
ENV PORT 8080
COPY package*.json ./
RUN npm install
COPY .env .env
COPY . .
EXPOSE 8080
CMD ["npm", "run", "start"]