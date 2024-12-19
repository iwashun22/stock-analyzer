from flask import Flask
from .routes import api_blueprint

def create_app():
  app = Flask(__name__)

  # configuration
  app.config.from_object('config.DevelopmentConfig')

  app.register_blueprint(api_blueprint)

  return app
