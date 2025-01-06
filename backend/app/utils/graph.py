import yfinance as yf
import base64, io, matplotlib.pyplot as plt
import datetime as dt, numpy as np
from dateutil.relativedelta import relativedelta
from .helpers import parse_time_period, get_property, resolve_path
from .handle_indicators import *

TREND_INDICATORS = ('SMA', 'EMA', 'ADX')
MOMENTUM_INDICATORS = ('RSI', 'MACD')

def generate_img(symbol, request_args, past = "1y"):
  ticker = yf.Ticker(symbol)
  now = dt.datetime.now()
  period_format = parse_time_period(past)
  if not period_format:
    return None, "The time period format is invalid."

  number, unit = period_format
  if unit == "d":
    timedelta = relativedelta(days=number)
  elif unit == "w":
    timedelta = relativedelta(weeks=number)
  elif unit == "m":
    timedelta = relativedelta(months=number)
  elif unit == "y":
    timedelta = relativedelta(years=number)

  data = ticker.history(start=now - timedelta, end=now, interval="1d")
  response_data = {}

  if data.empty:
    return None, "Data is empty."

  # dt_index = data.index.tolist()

  indicator = get_property(request_args, "indicator").upper()
  success, error_message, fig = None, None, None
  if indicator in TREND_INDICATORS:
    fig, ax, draw = _draw_graph(
        data,
        close_prices=data['Close'],
        suptitle=indicator,
        ylabel="Price", 
        xlabel="Date"
      )
    if indicator == 'SMA':
      success, error_message = handle_sma(request_args, data, draw)
    elif indicator == 'EMA':
      success, error_message = handle_ema(request_args, data, draw)
  elif indicator in MOMENTUM_INDICATORS:
    if indicator == 'MACD':
      fig, ax, draw = _draw_graph(
          data,
          suptitle=indicator,
          ylabel="Value",
          xlabel="Date",
          grid=False
        )
      success, error_message = handle_macd(request_args, data, draw, ax)
    elif indicator == 'RSI':
      fig, ax, draw = _draw_graph(
        data,
        ylimit=(0, 100),
        suptitle=indicator,
        ylabel="Value",
        xlabel="Date"
      )
      success, error_message = handle_rsi(request_args, data, draw)
  elif indicator:
      success, error_message = False, f"The technical indicator {indicator} is not available."
  else:
      success, error_message = False, "No technical indicator is provided."

  if not success and success is not None:
    return None, error_message

  ax.legend(loc='upper left', bbox_to_anchor=(1.05, 1), borderaxespad=0.)
  plt.tight_layout()
  fig.autofmt_xdate()

  # save to preview_img when it is 'test' mode.
  filename = resolve_path(f"example_{indicator.lower()}.png")
  if filename:
    fig.savefig(filename)

  # save to buffer
  buffer = io.BytesIO()
  fig.savefig(buffer, format='png')
  buffer.seek(0)

  # encoding base64 data url
  img_base64 = base64.b64encode(buffer.read()).decode('utf-8')
  response_data["imageUrl"] = f"data:image/png;base64,{img_base64}"
  buffer.close()
  plt.close()
  return response_data, None


def _draw_graph(
  data,
  close_prices=None, 
  grid=True,
  ylimit=None,
  suptitle=None,
  ylabel=None,
  xlabel=None
):
  data_length = len(data)

  fig_width = max(10, data_length / 80)
  fig, ax = plt.subplots(figsize=(fig_width, 6))
  ax.grid(grid)

  fig.suptitle(f"Indicator: {suptitle}" if suptitle else "Technical Indicator", fontsize='x-large')
  
  if ylabel:
    ax.set_ylabel(ylabel, fontsize='large', fontfamily='monospace')
  if xlabel:
    ax.set_xlabel(xlabel, fontsize='large', fontfamily='monospace')

  try:
    if not close_prices.empty:
      ax.plot(data.index, close_prices, label="Close Price")
  except:
    pass

  if ylimit:
    ax.set_ylim(*ylimit)

  def draw(plot=None, pltype="plot", include_nan=False, *args, **kwargs):
    if pltype == "plot":
      ax.plot(data.index, plot, *args, **kwargs)
    elif pltype == "bar":
      ax.bar(data.index, plot, *args, **kwargs)
    elif pltype == "scatter":
      ax.scatter(*args, **kwargs)

    if include_nan:
      nan_indices = np.where(np.isnan(plot))
      ax.plot(data.index[nan_indices], [0] * len(nan_indices[0]), color='red', dashes=[6, 2])

  return fig, ax, draw
