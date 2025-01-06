from flask import Blueprint, request, jsonify
from .utils.helpers import get_info, get_property
from .utils.graph import generate_img

api_blueprint = Blueprint('api', __name__)

@api_blueprint.route('/')
def index():
  return "Hello world!"

@api_blueprint.route('/info/<symbol>')
def real_time_api(symbol):
  symbol = symbol.upper()
  data = get_info(symbol)

  response = {}
  if data:
    response = dict(data)

  return jsonify(response)

# format url /graph?symbol=<s>&period=<p>&indicator=<i>...
@api_blueprint.route('/graph')
def sma_graph():
  symbol = get_property(request.args, "symbol").upper()
  period = get_property(request.args, "period", "1y")

  data, error_message = generate_img(symbol, request.args, period)

  if not data:
    return error_message, 400

  return jsonify(data)