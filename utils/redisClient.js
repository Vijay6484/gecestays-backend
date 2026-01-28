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
        ? {
          url,
          socket: {
            reconnectStrategy: (retries) => {
              if (retries > 5) {
                console.error("❌ Redis reconnection attempts exhausted. Disabling Redis.");
                return new Error("Redis reconnection attempts exhausted");
              }
              const delay = Math.min(retries * 100, 3000);
              console.log(`⚠️ Redis connection failed. Retrying in ${delay}ms... (Attempt ${retries})`);
              return delay;
            },
          },
        }
        : {
          socket: {
            host,
            port,
            reconnectStrategy: (retries) => {
              if (retries > 5) {
                console.error("❌ Redis reconnection attempts exhausted. Disabling Redis.");
                return new Error("Redis reconnection attempts exhausted");
              }
              const delay = Math.min(retries * 100, 3000);
              console.log(`⚠️ Redis connection failed. Retrying in ${delay}ms... (Attempt ${retries})`);
              return delay;
            },
          },
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
