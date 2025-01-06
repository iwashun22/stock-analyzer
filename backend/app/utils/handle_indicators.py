from .helpers import is_positive_int, get_property
import talib

def _time_period_indicator(func):
  def wrapper(request_args, data, draw):
    ranges = get_property(request_args, "ranges").split(';')
    if '' in ranges and len(ranges) == 1:
      return False, "The range was not provided."

    valid_ranges = set([int(i) for i in ranges if is_positive_int(i)])
    if len(valid_ranges) == 0:
      return False, "The range must be a positive integer."
    elif len(valid_ranges) > 3:
      return False, "The maximum number of ranges to compare is 3."
    
    if len(ranges) != len(valid_ranges):
      return False, "Some 'ranges' were duplicated or not a valid input."

    first_call = True
    last_call = False
    for i, r in enumerate(sorted(valid_ranges)):
      if i == len(valid_ranges) - 1:
        last_call = True
      func(
        data, draw, r, first_call, last_call, request_args
      )
      first_call = False
    
    return True, None
  return wrapper


@_time_period_indicator
def handle_sma(data, draw, in_range, first_call, last_call, req_arg):
  sma = talib.SMA(data['Close'], timeperiod=in_range)
  draw(sma, include_nan=first_call, label=f"SMA - {in_range}")


@_time_period_indicator
def handle_ema(data, draw, in_range, first_call, last_call, req_arg):
  ema = talib.EMA(data['Close'], timeperiod=in_range)
  draw(ema, include_nan=first_call, label=f"EMA - {in_range}")


@_time_period_indicator
def handle_rsi(data, draw, in_range, first_call, last_call, req_arg):
  rsi = talib.RSI(data['Close'], timeperiod=in_range)
  draw(rsi, include_nan=first_call, label=f"RSI - {in_range}")

  buy_signal = rsi < 30
  sell_signal = rsi > 70
  draw(
    pltype='scatter', x=data.index[buy_signal], y=rsi[buy_signal],
    label='Buy Signal' if last_call else None,
    marker='^', color='green', alpha=1
  )
  draw(
    pltype='scatter', x=data.index[sell_signal], y=rsi[sell_signal],
    label='Sell Signal' if last_call else None,
    marker='v', color='red', alpha=1
  )


def handle_macd(request_args, data, draw, ax):
  fastperiod = get_property(request_args, "fastperiod", 12)
  slowperiod = get_property(request_args, "slowperiod", 26)
  signalperiod = get_property(request_args, "signalperiod", 9)

  if not (is_positive_int(fastperiod) and is_positive_int(slowperiod) and is_positive_int(signalperiod)):
    return False, "'fastperiod', 'slowperiod', and 'signalperiod' must be a positive integer"
  
  macd, signal, hist = talib.MACD(data['Close'], fastperiod=int(fastperiod), slowperiod=int(slowperiod), signalperiod=int(signalperiod))

  draw(macd, label='MACD', include_nan=True)
  draw(signal, label='Signal')
  draw(hist, label='Histogram', pltype='bar', color='purple')

  buy_label_added, sell_label_added = False, False
  for i in range(1, len(macd)):
    # When MACD line crosses over the Signal line
    if macd.iloc[i-1] < signal.iloc[i-1] and macd.iloc[i] > signal.iloc[i]:
      buy_label = 'Buy Singal' if not buy_label_added else None
      ax.axvline(data.index[i], color='green', linestyle='dotted', alpha=0.5, label=buy_label)
      buy_label_added = True
    # When MACD line crosses down the Signal line
    elif macd.iloc[i-1] > signal.iloc[i-1] and macd.iloc[i] < signal.iloc[i]:
      sell_label = 'Sell Signal' if not sell_label_added else None
      ax.axvline(data.index[i], color='red', linestyle='dotted', alpha=0.5, label=sell_label)
      sell_label_added = True

  return True, None

