#!/bin/bash
cd /home/kavia/workspace/code-generation/react-tic-tac-toe-83534-83543/react_js_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

