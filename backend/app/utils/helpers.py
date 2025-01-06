import yfinance as yf
from pytz import timezone
import numpy as np, datetime as dt, os
import re

def is_positive_int(number):
  if isinstance(number, int):
    return number > 0
  elif isinstance(number, str) and number.isdigit():
    return int(number) > 0
  return False

def is_overlapped(*args):
  unique_set = set(args)
  if len(unique_set) == len(args):
    return False
  else:
    seen = set()
    duplicate = set()
    for n in args:
      if n in seen:
        duplicate.add(n)
      else:
        seen.add(n)
    return sorted(list(duplicate))
  
def get_property(obj, property: str, default=""):
  try:
    value = str(obj.get(property, default))
    return value
  except:
    return ""
  
def resolve_path(filename):
  output_dir = os.environ.get("OUTPUT_IMG_DIR")
  if output_dir:
    file = os.path.join(output_dir, filename)
    return file
  return None
  
def parse_time_period(input_str):
  matched = re.fullmatch(r"^(\d+)([dwmy])$", input_str, re.IGNORECASE)
  if matched:
    number = int(matched.group(1))
    unit = matched.group(2).lower()
    return number, unit
  else:
    return None

def get_realtime(symbol, timeframe="15m"):
  symbol = symbol.upper()

  try:
    ticker = yf.Ticker(symbol)
    now = dt.datetime.now(timezone("US/Eastern"))
    data = ticker.history(interval=timeframe, start=now - dt.timedelta(days=5), end=now)

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
    if ticker.info:
      return dict(ticker.info)
    else:
      return None

  except Exception as e:
    return None
