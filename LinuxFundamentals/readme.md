# Linux Fundamentals & System Administration Lab

**Course:** SST DevOps & Cloud [SWE]  
**Student Name:** Neerasa Veda Varshit  
**Enrollment Number:** 24bcs10005  
**Environment:** Windows 11 Home (ZEROBOOK) / WSL2 Ubuntu 24.04 LTS (`veda@ZEROBOOK`)  
**Repository:** `devops-heros` / `LinuxFundamentals`

---

## Overview

This repository section documents the Linux system administration exercises executed in the local environment, covering:
1. **File System Links:** Hard links vs. Symbolic (Soft) links and inode behavior.
2. **User & Group Administration:** Creating users (`adduser`), group membership, and account lifecycle.
3. **Service Management:** Inspecting active systemd service units with `systemctl`.
4. **System Logging & Auditing:** Querying kernel boot logs, user audit events, and daemon logs with `journalctl`.

---

## Task 1: Inode Mechanics — Hard Links vs. Soft (Symbolic) Links

**Objective:** Demonstrate the difference between hard links and symbolic links in Linux filesystems, verifying inode allocation, reference counting, and target deletion behavior.

### Theoretical Background
- **Hard Link (`ln target linkname`):** Creates an additional directory entry pointing directly to the existing filesystem inode. Both file names share the exact same inode number and permissions. Deleting the original file does not delete the file data; the inode reference count is decremented, and data persists until link count reaches 0.
- **Symbolic Link (`ln -s target linkname`):** Creates a new, distinct inode of type `l` containing a pointer path to the target. If the target file is removed, the symlink becomes a broken / dangling link.

### Terminal Commands Executed:
```bash
# Verify current working directory
pwd

# Create original source file
echo "Linux homework" > original.txt
cat original.txt

# Create hard link and symbolic link
ln original.txt hard.txt
ln -s original.txt soft.txt

# Inspect inode numbers, link counts, and permissions
ls -li

# Append data via hard link
echo "Second line" >> hard.txt

# Verify content propagation
cat original.txt
cat hard.txt
cat soft.txt

# Remove original file and test persistence
rm original.txt
cat hard.txt
cat soft.txt
```

### Observed Output:
```text
/home/veda/linux-lab/links

Linux homework

total 8
44865 -rw-r--r-- 2 veda veda 15 Sep  3 13:52 hard.txt
44865 -rw-r--r-- 2 veda veda 15 Sep  3 13:52 original.txt
44867 lrwxrwxrwx 1 veda veda 12 Sep  3 13:53 soft.txt -> original.txt

Linux homework
Second line

Linux homework
Second line

Linux homework
Second line

Linux homework
Second line

cat: soft.txt: No such file or directory
```

### Screenshot Evidence:
![Hard Links vs Soft Links](image.png)

---

## Task 2: User & Group Management

**Objective:** Create a dedicated unprivileged user account (`linuxlab`), inspect user ID (UID), group ID (GID), home directory permissions, and user database entries.

### Terminal Commands Executed:
```bash
# Create new user linuxlab
sudo adduser linuxlab

# Verify user UID, GID, and supplementary groups
id linuxlab

# Inspect home directory permissions
ls -ld /home/linuxlab

# Verify /etc/passwd record via getent
getent passwd linuxlab

# List user groups
groups linuxlab

# Verify current logged in identity
whoami
pwd
id
```

### Observed Output:
```text
Adding user `linuxlab' ...
Adding new group `linuxlab' (1001) ...
Adding new user `linuxlab' (1001) with group `linuxlab' ...
Creating home directory `/home/linuxlab' ...
Copying files from `/etc/skel' ...
New password:
Retype new password:
passwd: password updated successfully
Changing the user information for linuxlab
Enter the new value, or press ENTER for the default
	Full Name []:
	Room Number []:
	Work Phone []:
	Home Phone []:
	Other []:
Is the information correct? [Y/n]

uid=1001(linuxlab) gid=1001(linuxlab) groups=1001(linuxlab),100(users)
drwxr-x--- 2 linuxlab linuxlab 4096 Sep  4 16:53 /home/linuxlab
linuxlab:x:1001:1001:,,,:/home/linuxlab:/bin/bash
linuxlab : linuxlab users
veda
/home/veda
uid=1000(veda) gid=1000(veda) groups=1000(veda),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),100(users)
```

### Screenshot Evidence:
![User and Group Administration](Screenshot%202026-09-04%20222433.png)

---

## Task 3: System Logging & Auditing (`journalctl`)

**Objective:** Audit system events using `systemd-journald`, capturing user deletion audit trails and kernel boot diagnostics.

### Terminal Commands Executed:
```bash
# Query the 20 most recent system journal events
sudo journalctl -n 20

# Query boot logs from the current system session
sudo journalctl -b
```

### Key Audit Events Captured:
- `deluser --remove-home linuxlab`: Session opened by UID 1000 (`veda`) via `sudo`.
- Removal of `/home/linuxlab` files and crontab entries.
- `userdel`: Removal of user `linuxlab` from `users` and shadow groups.
- Kernel boot messages (`Linux version 6.18.33.2-microsoft-standard-WSL2`), RAM map parsing, and Hyper-V hypervisor detection.

### Screenshot Evidence:
![Journalctl System Logs](Screenshot%202026-09-04%20222648.png)

---

## Task 4: Service Management (`systemctl`)

**Objective:** List, inspect, and verify the operational state of active background services managed by `systemd`.

### Terminal Commands Executed:
```bash
# List all active and loaded service units without interactive pager
systemctl list-units --type=service --no-pager
```

### Observed Output Summary:
Active running system daemons verified:
- `chrony.service`: NTP time synchronization client/server.
- `cron.service`: Regular background program processing daemon.
- `dbus.service`: D-Bus System Message Bus.
- `systemd-journald.service`: Journal logging service.
- `systemd-logind.service`: User login management.
- `systemd-resolved.service`: Network name resolution.
- `systemd-udevd.service`: Kernel device event manager.
- `wsl-pro-service`: Bridge to Ubuntu Pro agent on Windows.

### Screenshot Evidence:
![Systemctl Services](Screenshot%202026-09-04%20222700.png)

---

## Task 5: Daemon-Specific Journal Inspection (`cron`)

**Objective:** Inspect historical and runtime execution logs for the `cron` background processing daemon.

### Terminal Commands Executed:
```bash
# Query the last 30 log entries for cron.service
sudo journalctl -u cron -n 30
```

### Observed Output Summary:
- Verified startup transitions across boots: `Started cron.service - Regular background program processing daemon`.
- Captured `(CRON) INFO (Running @reboot jobs)`.
- Captured PAM session initiation: `pam_unix(cron:session): session opened for user root(uid=0)`.
- Captured hourly cron batch execution: `(root) CMD (cd / && run-parts --report /etc/cron.hourly)`.

### Screenshot Evidence:
![Cron Journal Logs](Screenshot%202026-09-04%20222704.png)

---

## Summary Matrix

| Task | Core Command | Primary Purpose | Screenshot |
|---|---|---|---|
| Inode Mechanics | `ln original.txt hard.txt`, `ln -s original.txt soft.txt`, `ls -li` | Hard link inode sharing vs. symbolic pointer verification | `image.png` |
| User Administration | `sudo adduser linuxlab`, `id linuxlab`, `getent passwd` | User account provisioning and group membership | `Screenshot 2026-09-04 222433.png` |
| System Auditing | `sudo journalctl -n 20`, `sudo journalctl -b` | Audit log inspection of administrative actions and kernel boot | `Screenshot 2026-09-04 222648.png` |
| Service Control | `systemctl list-units --type=service --no-pager` | Verification of running system daemons | `Screenshot 2026-09-04 222700.png` |
| Daemon Logs | `sudo journalctl -u cron -n 30` | Detailed service execution and job schedule tracing | `Screenshot 2026-09-04 222704.png` |