from app.utils.helpers import get_realtime, get_info

data = get_realtime("nflx")
print(data)

ee = get_info("nflx")
print(ee['lastPrice'])
