# TP1 — Réparer une image Docker cassée

On a analysé un Dockerfile cassé, identifié 5 problèmes et corrigé l'image.

## Corrections apportées

Image de base remplacée par `node:20-alpine` pour rester sous 200 MB. Les secrets (`API_KEY`, `DB_PASSWORD`, `DB_HOST`) écrits en dur ont été supprimés. L'ordre `COPY` / `npm install` a été corrigé pour exploiter le cache Docker. Le bloc `apt-get install` avec des outils inutiles a été supprimé. Un `USER node` a été ajouté pour ne pas tourner en root.

## Vérifications

```bash
docker build -t tp1:corrige .
docker run --rm tp1:corrige whoami         # attendu : node
docker run --rm -p 3000:3000 tp1:corrige   # ouvrir localhost:3000
```
