#! /bin/bash

if [ "$AUTO_START" != 1 ]; then
  exec bash
fi

yarn dev

if [[ $? -ne 0 ]]; then
  echo "React app failed to start. Installing dependencies..."
  yarn install

  echo "Retrying to start React app..."
  yarn dev
fi
