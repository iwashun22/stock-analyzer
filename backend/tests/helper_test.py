from app.utils.helpers import *

def test_positive_int():
  assert is_positive_int("123") == True
  assert is_positive_int("ab") == False
  assert is_positive_int("-1") == False
  assert is_positive_int(5) == True
  assert is_positive_int("5e+4") == False
  assert is_positive_int(0) == False

def test_is_overlapped():
  assert is_overlapped(4, 2, 4) == [4]
  assert is_overlapped(8, 12, 20) == False
  assert is_overlapped(1, 2, 3, 4, 5, 3, 2) == [2, 3]
  assert is_overlapped("a", "bc", "ab", "bc") == ["bc"]

def test_get_property():
  obj = {
    "name": "test",
    "id": 1234
  }
  assert get_property(obj, 'name') == 'test'
  assert get_property(obj, 'foo') == ''
  assert get_property(obj, 'id') == '1234'
  assert get_property(1234, 'name') == ''

def test_get_realtime():
  BTC_data = get_realtime("btc-usd", timeframe="5m")
  first_row = BTC_data.iloc[0].to_dict()
  assert [key in first_row for key in ['Close', 'Open', 'High', 'Low']] == [True, True, True, True]
  assert isinstance(first_row['Close'], float) == True
  assert get_realtime("abcdefg") == None

def test_get_info():
  data = get_info("nflx")
  assert data['timeZoneFullName'] == 'America/New_York'
  assert isinstance(data['currentPrice'], float) == True

def test_parse_time_period():
  assert parse_time_period("10m") == (10, "m")
  assert parse_time_period("15me") == None
  assert parse_time_period("20D") == (20, "d")
  assert parse_time_period("3.14Y") == None
  assert parse_time_period("abc") == None
  assert parse_time_period("123") == None
  assert parse_time_period("55dmy") == None
