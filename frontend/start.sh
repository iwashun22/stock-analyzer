#! /bin/bash

yarn dev

if [[ $? -ne 0 ]]; then
  echo "React app failed to start. Installing dependencies..."
  yarn install

  echo "Retrying to start React app..."
  yarn dev
fi
