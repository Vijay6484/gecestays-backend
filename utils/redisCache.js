const { getRedisClient, DEFAULT_TTL } = require("./redisClient");

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const getCache = async (key) => {
  const client = await getRedisClient();
  if (!client) return null;
  const cached = await client.get(key);
  if (!cached) return null;
  return safeParse(cached);
};

const setCache = async (key, value, ttl = DEFAULT_TTL) => {
  const client = await getRedisClient();
  if (!client) return;
  const payload = JSON.stringify(value);
  if (ttl) {
    await client.set(key, payload, { EX: ttl });
  } else {
    await client.set(key, payload);
  }
};

const deleteByPrefix = async (prefix) => {
  const client = await getRedisClient();
  if (!client) return;

  const keysToDelete = [];
  for await (const key of client.scanIterator({ MATCH: `${prefix}*`, COUNT: 100 })) {
    keysToDelete.push(key);
    if (keysToDelete.length >= 100) {
      await client.del(keysToDelete);
      keysToDelete.length = 0;
    }
  }

  if (keysToDelete.length > 0) {
    await client.del(keysToDelete);
  }
};

const invalidatePublicCaches = async () => {
  await deleteByPrefix("properties:");
  await deleteByPrefix("locations:");
  await deleteByPrefix("calendar:");
  await deleteByPrefix("booking:");
};

module.exports = {
  getCache,
  setCache,
  deleteByPrefix,
  invalidatePublicCaches,
};
