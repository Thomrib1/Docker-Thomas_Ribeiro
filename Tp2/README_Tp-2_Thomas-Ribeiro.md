# TP2 — Docker Compose

Stack multi-services avec une API Node.js, un frontend Nginx, PostgreSQL et Adminer.

## Lancer le projet

```bash
cp .env.example .env
docker compose up --build
```

- Frontend : http://localhost:8080
- API : http://localhost:3000/health
- Adminer : http://localhost:8081

## Ce qu'on a créé

On a écrit le `docker-compose.yml` qui relie les 4 services ensemble. La base PostgreSQL n'est pas exposée à l'extérieur. Un volume nommé persiste les données même après un `docker compose down`. Les secrets passent par un fichier `.env` local, jamais en dur dans le compose.
