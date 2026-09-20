# Shell Scripting Lab: System Information & Automation

**Course:** SST DevOps & Cloud [SWE]  
**Student Name:** Neerasa Veda Varshit  
**Enrollment Number:** 24bcs10005  
**Environment:** Windows 11 Home (ZEROBOOK) / WSL2 Ubuntu 24.04 LTS (`veda@ZEROBOOK`)  
**Repository:** `devops-heros` / `ShellScripting`

---

## Overview

This lab demonstrates Linux Bash shell scripting fundamentals, including:
1. **User Interaction & Variables:** Prompting for user input via `read` and storing dynamic command substitutions (`date`, `hostname`, `whoami`).
2. **Filesystem Operations:** Declaratively creating directories (`mkdir`) and files (`touch`).
3. **System Telemetry:** Querying storage space (`df -h`) and active kernel process trees (`ps`).
4. **Standard Stream Redirection:** Redirecting standard output to persistent storage (`ps > system_data/processes.txt`).
5. **Execution Permissions & Verification:** Setting executable bit flags (`chmod +x`) and validating generated data artifacts (`wc -l`, `cat`, `head`).

---

## Script Architecture (`system_info.sh`)

```bash
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
```

---

## Execution Step 1: Script Authoring & Directory Setup

**Objective:** Clean environment, create script workspace, author `system_info.sh`, and inspect code structure.

### Terminal Commands Executed:
```bash
cd ~
rm -rf ~/linux-homework/shell-script
mkdir -p ~/linux-homework/shell-script
cd ~/linux-homework/shell-script
pwd
ls -la

touch system_info.sh
nano system_info.sh
cat system_info.sh
```

### Observed Output:
```text
/home/veda/linux-homework/shell-script
total 8
drwxr-xr-x 2 veda veda 4096 Sep  4 16:30 .
drwxr-xr-x 4 veda veda 4096 Sep  4 16:30 ..
```

### Screenshot Evidence:
![Script Authoring & Source Code](Screenshot%202026-09-04%20220322.png)

---

## Execution Step 2: Permission Configuration & Script Execution

**Objective:** Grant executable permissions (`chmod +x`) and execute the script interactively, capturing system identity and disk mount points.

### Terminal Commands Executed:
```bash
# Grant executable permissions
chmod +x system_info.sh

# Verify file mode (rwxr-xr-x)
ls -l system_info.sh

# Run interactive script
./system_info.sh
```

### Interactive Run & Observed Output:
```text
-rwxr-xr-x 1 veda veda 702 Sep  4 16:31 system_info.sh

Enter your name: veda
====== SYSTEM INFORMATION =====
Name: veda
Date: Fri Sep  4 16:31:52 UTC 2026
Hostname: ZEROBOOK
Username: veda

====== DISK USAGE =====
Filesystem      Size  Used Avail Use% Mounted on
none            3.9G     0  3.9G   0% /usr/lib/modules/6.18.33.2-microsoft-standard-WSL2
none            3.9G   23M  3.8G   1% /mnt/wsl
none            3.9G  464K  3.9G   1% /mnt/wsl/docker-desktop/shared-sockets/host-services
/dev/loop0      782M  782M     0 100% /mnt/wsl/docker-desktop/cli-tools
drivers         476G  139G  338G  30% /usr/lib/wsl/drivers
/dev/sdf        1007G  1.6G  955G   1% /
rootfs          3.9G  2.8M  3.9G   1% /init
none            3.9G  544K  3.9G   1% /run
```

### Screenshot Evidence:
![Permission Grants & Execution](Screenshot%202026-09-04%20220331.png)

---

## Execution Step 3: Process Telemetry & Stream Redirection Verification

**Objective:** Validate that the process table was captured to console and redirected into `system_data/processes.txt`, verifying output files and line counts.

### Terminal Commands Executed:
```bash
# Verify generated directory and files
ls -la system_data

# Inspect redirected process capture file
cat system_data/processes.txt

# Run independent process check
ps

# Verify line counts and file contents
wc -l system_data/processes.txt
head system_data/processes.txt
```

### Observed Output:
```text
====== RUNNING PROCESSES =====
  PID TTY          TIME CMD
  329 pts/0    00:00:00 bash
  603 pts/0    00:00:00 system_info.sh
  610 pts/0    00:00:00 ps

Process information saved to system_data/processes.txt

total 12
drwxr-xr-x 2 veda veda 4096 Sep  4 16:31 .
drwxr-xr-x 3 veda veda 4096 Sep  4 16:31 ..
-rw-r--r-- 1 veda veda  131 Sep  4 16:31 processes.txt

  PID TTY          TIME CMD
  329 pts/0    00:00:00 bash
  603 pts/0    00:00:00 system_info.sh
  611 pts/0    00:00:00 ps

4 system_data/processes.txt

  PID TTY          TIME CMD
  329 pts/0    00:00:00 bash
  603 pts/0    00:00:00 system_info.sh
  611 pts/0    00:00:00 ps
```

### Screenshot Evidence:
![Process Output & Redirection Validation](Screenshot%202026-09-04%20220335.png)

---

## Key Learning & Concepts Summary

1. **Shebang (`#!/bin/bash`):** Specifies the absolute path to the Bash interpreter executing the script instructions.
2. **Command Substitution (`$(command)`):** Executes a subshell command and captures its standard output into a variable for subsequent reuse.
3. **Output Redirection (`>` vs. `>>`):** 
   - `>` overwrites or creates the target file with the stream output.
   - `>>` appends stream output to the target file without destroying existing contents.
4. **POSIX File Permissions:** `chmod +x` sets the execution bit (`0111`), allowing the file to be invoked directly via `./script.sh`.