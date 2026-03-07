# Redis Setup (VPS)

This backend uses Redis to cache properties, locations, booking availability, and calendar data.

## 1) Install Redis (Ubuntu/Debian)

```
sudo apt update
sudo apt install -y redis-server
```

Enable and start Redis:

```
sudo systemctl enable redis-server
sudo systemctl start redis-server
```

Check status:

```
sudo systemctl status redis-server
```

## 2) Secure Redis

Edit the Redis config:

```
sudo nano /etc/redis/redis.conf
```

Recommended changes:

- Bind to localhost (or your private network interface):
  ```
  bind 127.0.0.1
  ```
- Require a password:
  ```
  requirepass YOUR_STRONG_PASSWORD
  ```

Restart Redis:

```
sudo systemctl restart redis-server
```

Test with password:

```
redis-cli -a YOUR_STRONG_PASSWORD ping
```

## 3) Configure Backend Environment Variables

Set these in your backend `.env` (or server environment):

```
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=YOUR_STRONG_PASSWORD
REDIS_DEFAULT_TTL=300
```

Alternatively, use a single URL:

```
REDIS_URL=redis://:YOUR_STRONG_PASSWORD@127.0.0.1:6379
```

## 4) Verify Cache Behavior

- GET endpoints will cache responses.
- Any successful POST/PUT/PATCH/DELETE to `/admin/*` clears the cache.

You can inspect keys:

```
redis-cli -a YOUR_STRONG_PASSWORD keys "properties:*"
```

## 5) Firewall (Optional)

If Redis runs locally on the VPS, keep it private:

```
sudo ufw deny 6379/tcp
```
