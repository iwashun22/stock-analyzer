from flask_caching import Cache

config = {
  "CACHE_TYPE": "SimpleCache",
  "CACHE_DEFAULT_TIMEOUT": 1800 # 30 minutes
}

cache = Cache(config=config)