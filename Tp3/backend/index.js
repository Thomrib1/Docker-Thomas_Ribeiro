const http = require("http");
const { createClient } = require("redis");

const PORT = process.env.PORT || 3001;

// Connexion à Redis via les variables d'environnement
const redis = createClient({
  socket: {
    host: process.env.REDIS_HOST || "cache",
    port: Number(process.env.REDIS_PORT) || 6379,
  },
  password: process.env.REDIS_PASSWORD || undefined,
});

redis.on("error", (err) => console.error("Erreur Redis :", err.message));

async function connectRedis() {
  await redis.connect();
  console.log("Connecté à Redis");
}

// Clés Redis utilisées :
//   tasks       -> hash { id: JSON de la tâche }
//   tasks:counter -> compteur auto-incrément pour les id

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // GET /health
  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200);
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }

  // GET /tasks — liste toutes les tâches
  if (req.method === "GET" && req.url === "/tasks") {
    try {
      const data = await redis.hGetAll("tasks");
      const tasks = Object.values(data)
        .map((t) => JSON.parse(t))
        .sort((a, b) => a.id - b.id);
      res.writeHead(200);
      res.end(JSON.stringify(tasks));
    } catch (err) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // POST /tasks — ajoute une tâche
  if (req.method === "POST" && req.url === "/tasks") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      try {
        const { texte } = JSON.parse(body);
        const id = await redis.incr("tasks:counter");
        const task = { id, texte, done: false };
        await redis.hSet("tasks", String(id), JSON.stringify(task));
        res.writeHead(201);
        res.end(JSON.stringify(task));
      } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // DELETE /tasks/:id — supprime une tâche
  if (req.method === "DELETE" && req.url.startsWith("/tasks/")) {
    try {
      const id = req.url.split("/")[2];
      await redis.hDel("tasks", id);
      res.writeHead(200);
      res.end(JSON.stringify({ deleted: id }));
    } catch (err) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: "Route introuvable" }));
});

connectRedis().then(() => {
  server.listen(PORT, () => {
    console.log(`API TaskFlow démarrée sur le port ${PORT}`);
  });
});
