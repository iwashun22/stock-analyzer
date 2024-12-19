class Config:
  DEBUG = False
  TESTING = False
  SECRET_KEY = 'dev'
  PORT = 8001
  HOST="0.0.0.0"

class DevelopmentConfig(Config):
  DEBUG = True

class TestingConfig(Config):
  TESTING = True