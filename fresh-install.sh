#!/bin/zsh

# This script runs the cleanup script, then the initialization script.

echo "Starting the full setup process..."

# Run the cleanup script
./reset.sh

# Check if the cleanup script was successful before proceeding
if [ $? -eq 0 ]; then
  echo "Cleanup script completed successfully. Starting initialization..."
  # Run the initialization script
  ./init.sh
else
  echo "Cleanup script failed. Aborting initialization."
  exit 1
fi

echo "Full setup process completed."