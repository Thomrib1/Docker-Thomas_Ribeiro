FROM node:20-alpine

WORKDIR /app

# Cache Docker : package*.json avant le code
COPY package*.json ./

RUN npm install --omit=dev

COPY index.js ./

EXPOSE 3001

# Container non-root
USER node

CMD ["npm", "start"]
