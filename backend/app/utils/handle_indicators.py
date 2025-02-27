from .helpers import is_positive_int, get_property
import talib

def _time_period_indicator(max):
  def func(decorator):
    def wrapper(request_args, data, draw, ax):
      ranges = get_property(request_args, "ranges").split(';')
      if '' in ranges and len(ranges) == 1:
        return False, "The range was not provided."

      valid_ranges = set([int(i) for i in ranges if is_positive_int(i)])
      if len(valid_ranges) == 0:
        return False, "The range must be a positive integer."
      elif len(valid_ranges) > max:
        return False, f"The maximum number of ranges to compare is {max}."

      if len(ranges) != len(valid_ranges):
        return False, "Some 'ranges' were duplicated or not a valid input."

      first_call = True
      last_call = False
      for i, r in enumerate(sorted(valid_ranges)):
        if i == len(valid_ranges) - 1:
          last_call = True
        decorator(
          data, draw, ax, r, first_call, last_call, request_args
        )
        first_call = False

      return True, None
    return wrapper
  return func


@_time_period_indicator(3)
def handle_sma(data, draw, ax, in_range, first_call, last_call, req_arg):
  sma = talib.SMA(data['Close'], timeperiod=in_range)
  draw(sma, include_nan=first_call, label=f"SMA - {in_range}")


@_time_period_indicator(3)
def handle_ema(data, draw, ax, in_range, first_call, last_call, req_arg):
  ema = talib.EMA(data['Close'], timeperiod=in_range)
  draw(ema, include_nan=first_call, label=f"EMA - {in_range}")


@_time_period_indicator(1)
def handle_rsi(data, draw, ax, in_range, first_call, last_call, req_arg):
  rsi = talib.RSI(data['Close'], timeperiod=in_range)
  draw(rsi, include_nan=first_call, label=f"RSI - {in_range}")

  overbought_line, oversold_line = 70, 30
  ax.axhline(overbought_line, linestyle='dotted', label='Overbought', color='limegreen')
  ax.axhline(oversold_line, linestyle='dotted', label='Oversold', color='lightcoral')

  buy_signal = rsi < oversold_line
  sell_signal = rsi > overbought_line

  buy_label_added, sell_label_added = False, False
  for i in range(1, len(data)):
    if sell_signal.iloc[i-1] and not sell_signal.iloc[i]:
      ax.scatter(
        data["time_str"].iloc[i], rsi[i],
        label='Sell Signal' if not sell_label_added else None,
        marker='v', color='red', alpha=1
      )
      sell_label_added = True
    elif buy_signal.iloc[i-1] and not buy_signal.iloc[i]:
      ax.scatter(
        data["time_str"].iloc[i], rsi[i],
        label='Buy Signal' if not buy_label_added else None,
        marker='^', color='green', alpha=1
      )
      buy_label_added = True


@_time_period_indicator(1)
def handle_adx(data, draw, ax, in_range, first_call, last_call, req_arg):
  adx = talib.ADX(data['High'], data['Low'], data['Close'], timeperiod=in_range)

  draw(adx, include_nan=first_call, label=f"ADX - {in_range}")
  ax.axhline(40, dashes=[2, 4], color='limegreen', label='Strong trend')
  ax.axhline(20, dashes=[2, 4], color='lightcoral', label='Weak trend')

  # directional indicator
  if "show-di" in req_arg:
    positive_di = talib.PLUS_DI(data['High'], data['Low'], data['Close'], timeperiod=in_range)
    negative_di = talib.MINUS_DI(data['High'], data['Low'], data['Close'], timeperiod=in_range)
    draw(positive_di, label=f"+ DI", color='green', dashes=[2, 2, 5, 2])
    draw(negative_di, label=f"- DI", color='red', dashes=[2, 2, 5, 2])

    if "show-signal" in req_arg:
      buy_signal = (positive_di > negative_di) & (adx > 25)
      sell_signal = (negative_di > positive_di) & (adx > 25)
      buy_label_added, sell_label_added = False, False
      recently_labeled = None
      for i in range(len(data)):
        if buy_signal.iloc[i]:
          if recently_labeled == "buy":
            continue
          ax.scatter(
            data["time_str"].iloc[i], adx.iloc[i], marker='^', color='darkgreen',
            label='Buy Signal' if not buy_label_added else None
          )
          buy_label_added = True
          recently_labeled = "buy"
        elif sell_signal.iloc[i]:
          if recently_labeled == "sell":
            continue
          ax.scatter(
            data["time_str"].iloc[i], adx.iloc[i], marker='v', color='darkred',
            label='Sell Signal' if not sell_label_added else None
          )
          sell_label_added = True
          recently_labeled = "sell"


@_time_period_indicator(1)
def handle_bbands(data, draw, ax, in_range, first_call, last_call, req_arg):
  upper_band, middle_band, lower_band = talib.BBANDS(data['Close'], timeperiod=in_range)

  draw(middle_band, label=f"SMA - {in_range}", color='navy', dashes=[3, 1])
  draw(upper_band, label='Upper Band', color='red', dashes=[3, 1])
  draw(lower_band, label='Lower Band', color='green', dashes=[3, 1])
  ax.fill_between(data.index, upper_band, lower_band, color='gray', alpha=.3)


@_time_period_indicator(1)
def handle_atr(data, draw, ax, in_range, first_call, last_call, req_arg):
  atr = talib.ATR(data['High'], data['Low'], data['Close'], timeperiod=in_range)
  draw(atr, include_nan=True, label=f"ATR - {in_range}")


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
      buy_label = 'Buy Signal' if not buy_label_added else None
      ax.axvline(data["time_str"].iloc[i], color='green', linestyle='dotted', alpha=0.5, label=buy_label)
      buy_label_added = True
    # When MACD line crosses down the Signal line
    elif macd.iloc[i-1] > signal.iloc[i-1] and macd.iloc[i] < signal.iloc[i]:
      sell_label = 'Sell Signal' if not sell_label_added else None
      ax.axvline(data["time_str"].iloc[i], color='red', linestyle='dotted', alpha=0.5, label=sell_label)
      sell_label_added = True

  return True, None

