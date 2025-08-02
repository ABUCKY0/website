import json
import time
from pypresence import Presence

CLIENT_ID = "1091849837080752208"  # Replace with your application's client ID

with open("rich_presence_tests.json" ) as f:
    tests = json.load(f)

rpc = Presence(CLIENT_ID)
rpc.connect()
while True:
  for activity in tests:
      # Map your test dict to pypresence's update format
      args = {
          "state": activity.get("state"),
          "details": activity.get("details"),
          "large_image": activity.get("assets", {}).get("large_image"),
          "start": int(time.time()),
      }
      # Remove None values
      args = {k: v for k, v in args.items() if v}
      # rpc.update(**args)
      rpc.update(
         activity_type=activity.get("type", "PLAYING"),
          **args
      )
      print(f"Set presence: {args}")
      time.sleep(5)  # Wait a few seconds before next test

rpc.clear()
rpc.close()