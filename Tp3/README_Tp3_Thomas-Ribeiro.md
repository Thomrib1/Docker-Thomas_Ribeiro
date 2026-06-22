# TP3 — Conteneurisation de TaskFlow

Application de gestion de tâches conteneurisée. 3 services : un frontend Nginx, un backend Node.js et un cache Redis. Tout se lance avec une seule commande.

## Lancer le projet

```bash
cp .env.example .env
docker compose up --build
docker compose ps 
```

- Frontend : http://localhost:8080
- Backend : http://localhost:3001/health → `{"status":"ok"}`

## Ce qu'on a fait

Le backend est une petite API Node.js (http natif) qui ajoute, liste et supprime des tâches, le tout stocké dans Redis. Le frontend est une page statique servie par Nginx qui parle à l'API. Le `docker-compose.yml` lance les 3 services sur un réseau commun `taskflow`. Le cache Redis n'a aucun `ports:` publié, il n'est donc joignable que par le backend via le nom de service `cache`, et un volume nommé `redis_data` persiste ses données. Les variables configurables viennent du `.env` avec des valeurs par défaut, aucun secret n'est en dur dans le compose.

## Structure

```
tp3/
├── backend/
│   ├── Dockerfile
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── Dockerfile
│   └── index.html
├── docker-compose.yml
├── .env.example
├── .dockerignore
└── .gitignore
```

## Fichier .env

Le `.env` n'est pas sur GitHub. Copier le modèle :

```bash
cp .env.example .env
```
