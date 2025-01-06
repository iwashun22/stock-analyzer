from app.utils.graph import generate_img
import re

def test_generate_img():
  data, err_message = generate_img("MDB", {"indicator": "sma", "ranges": '12'})
  assert len(re.findall("^data:image/png;base64,*", data["imageUrl"])) == 1
  assert generate_img("ABC123", {"indicator": "ema", "ranges": '12'})[0] == None
  assert generate_img("NFLX", {})[1] == "No technical indicator is provided."
  assert isinstance(generate_img("HMC", {"indicator": "xyz"})[1], str)

def test_rsi_bad_request():
  assert generate_img("TSLA", {"indiator": "rsa"})[0] == None
  assert generate_img("NFLX", {"indicator": "rsa", "ranges": '-8;10'})[0] == None
