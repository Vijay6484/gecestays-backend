const { createClient } = require("redis");

const DEFAULT_TTL = parseInt(process.env.REDIS_DEFAULT_TTL || "300", 10);

let client;
let connecting = false;

const getRedisClient = async () => {
  if (client && client.isOpen) return client;

  if (!client) {
    const url = process.env.REDIS_URL;
    const host = process.env.REDIS_HOST || "127.0.0.1";
    const port = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379;
    const password = process.env.REDIS_PASSWORD || undefined;

    client = createClient(
      url
        ? { url }
        : {
            socket: { host, port },
            password,
          }
    );

    client.on("error", (err) => {
      console.error("Redis error:", err.message);
    });
  }

  if (!client.isOpen && !connecting) {
    connecting = true;
    try {
      await client.connect();
      console.log("✅ Redis connected");
    } catch (err) {
      console.error("❌ Redis connection failed:", err.message);
      client = null;
    } finally {
      connecting = false;
    }
  }

  return client;
};

module.exports = {
  getRedisClient,
  DEFAULT_TTL,
};
