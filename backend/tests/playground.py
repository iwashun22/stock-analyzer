import talib
import numpy as np, datetime as dt
import yfinance as yf
import matplotlib.pyplot as plt

print(talib.get_function_groups())

symbol = 'MDB'
nflx = yf.Ticker(symbol)
data = nflx.history(start='2023-01-01', end=dt.datetime.now())

# print(data['Close'].values.shape)
data['RSA'] = talib.RSI(data['Close'], timeperiod=14)

data['SMA'] = talib.SMA(data['Close'], timeperiod=20)
data['SMA50'] = talib.SMA(data['Close'], timeperiod=50)
data['SMA200'] = talib.SMA(data['Close'], timeperiod=200)

print(data.columns)

plt.figure(figsize=(10, 6))

dt_date = data.index.tolist()
plt.plot(dt_date, data['Close'], label='Close Price')
plt.plot(dt_date, data['SMA'], label='SMA')
plt.plot(dt_date, data['SMA50'], label='SMA50')
plt.plot(dt_date, data['SMA200'], label='SMA200')

plt.title(f"{symbol} Simple Moving Average")
plt.xlabel('Date')
plt.ylabel('Price')
# plt.savefig(f"{symbol}.png")
plt.close()

news = nflx.get_news()
print(news)

def foo(a, b, *x):
  print(x)

foo(1, 2, 3, 4, 5)