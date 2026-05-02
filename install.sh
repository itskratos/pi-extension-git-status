#!/bin/bash
# Licensed under the MIT License

# Configuration
SOURCE_FILE=".pi/extensions/git-status.ts"
DEFAULT_LOCAL_DIR=".pi/extensions"
DEFAULT_GLOBAL_DIR="$HOME/.pi/agent/extensions"

# Check if source file exists
if [ ! -f "$SOURCE_FILE" ]; then
    echo "Error: Source file $SOURCE_FILE not found."
    exit 1
fi

TARGET_DIR=""

# Handle argument
if [ -n "$1" ]; then
    TARGET_DIR="$1"
else
    echo "Where would you like to install the pi skill?"
    echo "1) Project-Local ($DEFAULT_LOCAL_DIR)"
    echo "2) Global ($DEFAULT_GLOBAL_DIR)"
    read -p "Enter choice [1/2]: " choice

    case $choice in
        1) TARGET_DIR="$DEFAULT_LOCAL_DIR" ;;
        2) TARGET_DIR="$DEFAULT_GLOBAL_DIR" ;;
        *) echo "Invalid choice. Aborting."; exit 1 ;;
    esac
fi

# Ensure target directory exists
mkdir -p "$TARGET_DIR"

# Check for conflicts
TARGET_FILE="$TARGET_DIR/git-status.ts"
if [ -f "$TARGET_FILE" ]; then
    echo "Conflict detected: $TARGET_FILE already exists."
    read -p "Do you want to overwrite it? [y/N]: " overwrite
    if [[ ! "$overwrite" =~ ^[Yy]$ ]]; then
        echo "Installation aborted."
        exit 0
    fi
fi

# Perform copy
cp "$SOURCE_FILE" "$TARGET_FILE"

if [ $? -eq 0 ]; then
    echo "Successfully installed git-status.ts to $TARGET_DIR"
else
    echo "Failed to install git-status.ts"
    exit 1
fi
