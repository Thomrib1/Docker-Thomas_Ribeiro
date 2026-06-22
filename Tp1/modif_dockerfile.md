TP1 — Réparer une image Docker cassée

En analysant le Dockerfile, j'ai trouvé 5 problèmes principaux à corriger :

Le premier était l'image de base : node:18 (Debian) faisait plus d'1 GB, je l'ai remplacée par node:20-alpine pour passer sous les 200 MB. 

Ensuite, trois variables d'environnement contenaient des secrets en dur dans le fichier (API_KEY, DB_PASSWORD, DB_HOST), ce qui les rendait lisibles par n'importe qui via docker inspect je les ai supprimées. 

J'ai aussi corrigé l'ordre du COPY : le code était copié avant le npm install, ce qui cassait le cache Docker et forçait une réinstallation complète des dépendances à chaque build. J'ai donc copié package*.json en premier, puis le reste du code après. 

Le bloc apt-get install installait 6 outils inutiles en production (vim, git, htop...), je l'ai entièrement supprimé. 

Enfin, il n'y avait aucune instruction USER, donc le container tournait en root par défaut — j'ai ajouté USER node avant le CMD pour corriger ça.