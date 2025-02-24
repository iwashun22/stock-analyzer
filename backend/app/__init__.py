from flask import Flask
from app.routes import api_blueprint
from app.cache import cache
import argparse
import os

app = Flask(__name__)

parser = argparse.ArgumentParser()
parser.add_argument('--mode', type=str, default="dev", help="Select the mode (dev, test).")

def create_app():
  # configuration
  args = parser.parse_args()
  if args.mode == "test":
    os.environ.setdefault("OUTPUT_IMG_DIR", "preview_img")
    os.makedirs("preview_img", exist_ok=True)
    app.config.from_object('config.TestingConfig')
  else:
    app.config.from_object('config.DevelopmentConfig')

  # Initialize cache with the app
  cache.init_app(app)

  app.register_blueprint(api_blueprint)

  return app
