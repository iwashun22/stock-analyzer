from flask import Flask
from .routes import api_blueprint
import argparse
import os

parser = argparse.ArgumentParser()
parser.add_argument('--mode', type=str, default="dev", help="Select the mode (dev, test).")

def create_app():
  app = Flask(__name__)

  # configuration
  args = parser.parse_args()
  if args.mode == "test":
    os.environ.setdefault("OUTPUT_IMG_DIR", "preview_img")
    os.makedirs("preview_img", exist_ok=True)
    app.config.from_object('config.TestingConfig')
  else:
    app.config.from_object('config.DevelopmentConfig')

  app.register_blueprint(api_blueprint)

  return app
