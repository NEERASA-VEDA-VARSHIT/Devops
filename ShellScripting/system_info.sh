#!/bin/bash

# Take user input
read -p "Enter your name: " name

# Store information in variables
current_date=$(date)
host_name=$(hostname)
user_name=$(whoami)

# Create a directory
mkdir system_data

# Create a file
touch system_data/processes.txt

# Display system information
echo "====== SYSTEM INFORMATION ====="
echo "Name: $name"
echo "Date: $current_date"
echo "Hostname: $host_name"
echo "Username: $user_name"

# Display disk usage
echo ""
echo "====== DISK USAGE ====="
df -h

# Display running processes
echo ""
echo "====== RUNNING PROCESSES ====="
ps

# Store running processes in a file
ps > system_data/processes.txt

echo ""
echo "Process information saved to system_data/processes.txt"
