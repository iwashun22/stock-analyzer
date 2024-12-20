from flask import Blueprint, request, jsonify
from .utils.helpers import get_info, is_positive_int
from .utils.graph import generate_img_url
import talib

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

graph_params = ["first", "second", "third"]
# format url /graph?symbol=<s>&analyzer=<a>&first=<1>...
@api_blueprint.route('/graph')
def sma_graph():
  symbol = request.args.get("symbol", "").upper()
  analyzer = request.args.get("analyzer", "").upper()

  lengths = []
  iter_check = 0
  for i, param in enumerate(graph_params):
    if param in request.args:
      length = request.args.get(param)
      if length and is_positive_int(length):
        if not iter_check == i:
          return "Bad request", 400
        lengths.append(int(length))
        iter_check += 1
      elif length:
        return "Bad request", 400

  if len(lengths) == 0 or not analyzer:
    return "Bad request", 400

  if analyzer == "SMA":
    data_url = generate_img_url(symbol, talib.SMA, analyzer, timeperiods=lengths)
  else:
    return "Bad request", 400

  if not data_url:
    return "Bad request", 400

  return jsonify({ "imageUrl": data_url })