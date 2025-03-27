#! /bin/bash

if [ "$AUTO_START" != 1 ]; then
  exec bash
fi

if [[ ! -d "venv" ]]; then
  python3 -m venv venv
fi

source venv/bin/activate
python3 run.py

if [[ $? -ne 0 ]]; then
  echo "Flask app failed to start. Installing dependencies..."
  pip3 install -r requirements.txt

  echo "Retrying to start Flask app..."
  python3 run.py
fi
