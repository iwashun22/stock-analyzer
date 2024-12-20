import yfinance as yf
from pytz import timezone
import numpy as np, datetime as dt
import matplotlib.pyplot as plt

def is_positive_int(number):
  if isinstance(number, int):
    return number > 0
  elif isinstance(number, str) and number.isdigit():
    return int(number) > 0
  return False

def get_realtime(symbol):
  symbol = symbol.upper()

  try:
    ticker = yf.Ticker(symbol)
    now = dt.datetime.now(timezone("US/Eastern"))
    data = ticker.history(interval="15m", start=now - dt.timedelta(hours=1), end=now)

    if data.empty:
      return None

    return data
  except Exception as e:
    print(f"Error fetching data for {symbol}: {e}")
    return None

def get_info(symbol):
  symbol = symbol.upper()
  try:
    ticker = yf.Ticker(symbol)
    if ticker.fast_info:
      return ticker.fast_info
    else:
      return None

  except Exception as e:
    return None
