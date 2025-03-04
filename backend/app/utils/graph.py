import yfinance as yf
import io, matplotlib.pyplot as plt
import datetime as dt, numpy as np
import pandas as pd
from dateutil.relativedelta import relativedelta
from app.utils.helpers import parse_time_period, get_property, resolve_path, VALID_INTERVAL
from app.utils.handle_indicators import *
from app.cache import cache

TREND_INDICATORS = ('SMA', 'EMA', 'ADX')
MOMENTUM_INDICATORS = ('RSI', 'MACD')
VOLATILITY_INDICATORS = ('BBANDS', 'ATR')

def generate_img(symbol, request_args, past="1y", interval="1d"):
  cache_key = f"data_{symbol}_{past}_{interval}"
  cached_data = cache.get(cache_key)

  if cached_data:
    data = pd.DataFrame.from_dict(cached_data)
  else:
    ticker = yf.Ticker(symbol)
    now = dt.datetime.now()
    period_format = parse_time_period(past)
    if not period_format:
      return None, "The time period format is invalid."
    if not interval in VALID_INTERVAL:
      return None, "The given interval is invalid."

    number, unit = period_format
    if unit == "d":
      timedelta = relativedelta(days=number)
    elif unit == "w":
      timedelta = relativedelta(weeks=number)
    elif unit == "m":
      timedelta = relativedelta(months=number)
    elif unit == "y":
      timedelta = relativedelta(years=number)

    data = ticker.history(start=now - timedelta, end=now, interval=interval)

  if data.empty:
    cache.delete(cache_key)
    return None, "Data is empty."
  else:
    # save cache data for 30 minutes
    cache.set(cache_key, data.to_dict(), timeout=1800)

  data["time_str"] = data.index.strftime("%Y-%m-%d %H:%M")

  indicator = get_property(request_args, "indicator").upper()
  success, error_message, fig = None, None, None
  if indicator in TREND_INDICATORS:
    if indicator == 'SMA' or indicator == 'EMA':
      fig, ax, draw = _draw_graph(
        data,
        close_prices=data['Close'],
        suptitle=indicator
      )
      success, error_message = handle_sma(request_args, data, draw, ax) if indicator == 'SMA' else handle_ema(request_args, data, draw, ax)
    elif indicator == 'ADX':
      fig, ax, draw = _draw_graph(
        data,
        suptitle=indicator,
        grid=False,
        ylabel="Value",
        price_based=False
      )
      success, error_message = handle_adx(request_args, data, draw, ax)
  elif indicator in MOMENTUM_INDICATORS:
    if indicator == 'MACD':
      fig, ax, draw = _draw_graph(
          data,
          suptitle=indicator,
          ylabel="Value",
          grid=False,
          price_based=False
        )
      success, error_message = handle_macd(request_args, data, draw, ax)
    elif indicator == 'RSI':
      fig, ax, draw = _draw_graph(
        data,
        ylimit=(0, 100),
        suptitle=indicator,
        ylabel="Value",
        grid=False
      )
      success, error_message = handle_rsi(request_args, data, draw, ax)
  elif indicator in VOLATILITY_INDICATORS:
    if indicator == 'BBANDS':
      fig, ax, draw = _draw_graph(
        data,
        suptitle=indicator
      )
      success, error_message = handle_bbands(request_args, data, draw, ax)
    elif indicator == 'ATR':
      fig, ax, draw = _draw_graph(
        data,
        suptitle=indicator,
        ylabel="Volatility",
        price_based=False
      )
      success, error_message = handle_atr(request_args, data, draw, ax)
  elif indicator:
      success, error_message = False, f"The technical indicator {indicator} is not available."
  else:
      success, error_message = False, "No technical indicator is provided."

  if not success and success is not None:
    return None, error_message

  ax.legend(
    loc='upper left',
    prop={'family': 'monospace', 'size': 10},
    # bbox_to_anchor=(1.05, 1),
    # borderaxespad=0.
  )

  # Set a fixed number of labels
  num_labels = 8
  step = len(data) // num_labels
  selected_labels = data["time_str"][::step]
  ax.set_xticks(range(0, len(data), step))  # Set tick positions
  ax.set_xticklabels(selected_labels, rotation=45)  # Set tick labels
  plt.tight_layout()

  # save to preview_img when it is 'test' mode.
  filename = resolve_path(f"example_{indicator.lower()}.png")
  if filename:
    fig.savefig(filename)

  # save to buffer
  buffer = io.BytesIO()
  fig.savefig(buffer, format='png')
  buffer.seek(0)

  # encoding base64 data url
  plt.close()
  return buffer, None


def _draw_graph(
  data,
  close_prices=None,
  grid=True,
  ylimit=None,
  suptitle=None,
  ylabel="Price",
  xlabel="Date",
  price_based=True,
):
  data_length = len(data)

  fig_width = max(10, (data_length / 100))
  fig, ax = plt.subplots(figsize=(fig_width, 6))
  ax.grid(grid)

  fig.suptitle(f"Indicator: {suptitle}" if suptitle else "Technical Indicator", fontsize='x-large')
  
  ax.set_ylabel(ylabel, fontsize='large', fontfamily='monospace')
  ax.set_xlabel(xlabel, fontsize='large', fontfamily='monospace')

  try:
    if not close_prices.empty:
      ax.plot(data["time_str"], close_prices, label="Close Price")
  except:
    pass

  if ylimit:
    ax.set_ylim(*ylimit)

  def draw(plot=None, pltype="plot", include_nan=False, *args, **kwargs):
    if pltype == "plot":
      ax.plot(data["time_str"], plot, *args, **kwargs)
    elif pltype == "bar":
      ax.bar(data["time_str"], plot, *args, **kwargs)

    if include_nan:
      nan_indices = np.where(np.isnan(plot))
      min_value = np.min(data['Close'])
      ax.plot(data["time_str"].iloc[nan_indices], [min_value if price_based else 0] * len(nan_indices[0]), color='gray', dashes=[6, 2])

  return fig, ax, draw
