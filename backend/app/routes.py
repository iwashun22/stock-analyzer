from flask import Blueprint, request, jsonify
from .utils.helpers import get_info, get_property
from .utils.graph import *

api_blueprint = Blueprint('api', __name__)

@api_blueprint.route('/')
def index():
  return "Hello world!"

@api_blueprint.route('/info/<symbol>')
def real_time_api(symbol):
  symbol = symbol.upper()
  data = get_info(symbol)

  response = None
  if data:
    response = dict(data)
  else:
    return "No data was found", 400

  return jsonify(response)

@api_blueprint.route('/indicators')
def indicators():
  trend_dict = {}
  for _trend in TREND_INDICATORS:
    if _trend == 'SMA':
      trend_dict[_trend] = 'Simple Moving Average'
    elif _trend == 'EMA':
      trend_dict[_trend] = 'Exponential Moving Average'
    elif _trend == 'ADX':
      trend_dict[_trend] = 'Average Directional Index'

  momentum_dict = {}
  for _momentum in MOMENTUM_INDICATORS:
    if _momentum == 'MACD':
      momentum_dict[_momentum] = 'Moving Average Convergence Divergence'
    elif _momentum == 'RSI':
      momentum_dict[_momentum] = 'Relative Strength Index'

  volatility_dict = {}
  for _volatility in VOLATILITY_INDICATORS:
    if _volatility == 'BBANDS':
      volatility_dict[_volatility] = 'Bollinger Bands'
    elif _volatility == 'ATR':
      volatility_dict[_volatility] = 'Average True Range'

  return jsonify({
    "trend-indicators": trend_dict,
    "momentum-indicators": momentum_dict,
    "volatility-indicators": volatility_dict
  })

# format url /graph?symbol=<s>&period=<p>&indicator=<i>...
@api_blueprint.route('/graph')
def generate_graph():
  symbol = get_property(request.args, "symbol").upper()
  period = get_property(request.args, "period", "1y")

  data, error_message = generate_img(symbol, request.args, period)

  if not data:
    return error_message, 400

  return jsonify(data)

@api_blueprint.route('/check/period/<string:period>')
def check_period_validity(period):
  checked = parse_time_period(period)

  if not checked:
    return "Validity check failed", 400
  
  number, unit = checked
  return jsonify({ "number": number, "unit": unit })