import yfinance as yf
import base64, io, matplotlib.pyplot as plt
import datetime as dt
from dateutil.relativedelta import relativedelta

def generate_img_url(symbol, TAfunc, label, timeperiods):
  ticker = yf.Ticker(symbol)
  now = dt.datetime.now()
  data = ticker.history(start=now - relativedelta(years=1), end=now)

  if data.empty:
    return None

  dt_date = data.index.tolist()

  plt.title(label, fontsize='x-large')
  plt.ylabel("Price", fontsize='large', fontfamily='monospace')
  plt.xlabel("Date", fontsize='large', fontfamily='monospace')

  plt.plot(dt_date, data['Close'], label="Close Price")

  for tp in timeperiods:
    data[f"{label}{tp}"] = TAfunc(data['Close'], timeperiod=tp)
    plt.plot(dt_date, data[f"{label}{tp}"], label=f"{label} - {tp}")

  plt.legend()
  # save to buffer
  buffer = io.BytesIO()
  plt.savefig(buffer, format='png')
  buffer.seek(0)

  # encoding base64 data url
  img_base64 = base64.b64encode(buffer.read()).decode('utf-8')
  data_url = f"data:image/png;base64,{img_base64}"
  buffer.close()
  plt.close()
  return data_url