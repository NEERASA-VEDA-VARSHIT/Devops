# Git Homework

## Author Details

- **Name:** Veda
- **Enrollment Number:** 24bcs10005

---

## Task 1: `git commit -a -m` Practice

### Understanding the Difference

| Command | Description |
|---------|-------------|
| `git commit -m "message"` | Commits only the files that have been **explicitly staged** with `git add` |
| `git commit -a -m "message"` | **Automatically stages** all tracked (modified/deleted) files and commits them with the given message |

### Command 1: `git commit -m` (staged only)

```bash
echo "# Git Homework" > Git-Exercise/commit-a-m-test.txt
git add Git-Exercise/commit-a-m-test.txt
git commit -m "Test commit -m (staged)"
```

**Output:**
```
[main 3bf6a02] Test commit -m (staged)
 1 file changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 Git-Exercise/commit-a-m-test.txt
```

### Command 2: `git commit -a -m` (auto-stages tracked files)

```bash
echo "# Modified file $(Get-Date)" >> Git-Exercise/temp.txt
git commit -a -m "Test commit -a -m (auto-staged)"
```

**Output:**
```
[main 0aca56e] Test commit -a -m (auto-staged)
 23 files changed, 18 insertions(+), 623 deletions(-)
 delete mode 100644 Apache-app/Dockerfile
 ... (all deleted files removed from git tracking)
```

**Key observation:** `git commit -a -m` automatically staged and committed all tracked file modifications and deletions without needing `git add`. Files not tracked (new files) were **not** included.

---

## Task 2: Git Cherry-Pick

### Step 1: Create 3 commits on main branch

```bash
git log --oneline -5
```

### Step 2: Create a new branch

```bash
git branch cherry-pick-branch
git checkout cherry-pick-branch
```

### Step 3: Make 3 commits in the new branch

```bash
echo "first change" >> Git-Exercise/temp.txt
git add Git-Exercise/temp.txt
git commit -m "First commit on cherry-pick-branch"

echo "second change" >> Git-Exercise/temp.txt
git add Git-Exercise/temp.txt
git commit -m "Second commit on cherry-pick-branch"

echo "third change" >> Git-Exercise/temp.txt
git add Git-Exercise/temp.txt
git commit -m "Third commit on cherry-pick-branch"
```

**Output of `git log --oneline -5` on cherry-pick-branch:**
```
ac329b8 Third commit on cherry-pick-branch
5eff04c Second commit on cherry-pick-branch
1fc9263 First commit on cherry-pick-branch
a6f3390 Update README with current network config and all evidence
5320ed3 Add complete command output evidence for all tasks
```

### Step 4: Use git log to identify a specific commit

The commit hash `1fc9263` ("First commit on cherry-pick-branch") is the target.

### Step 5: Switch to main and cherry-pick

```bash
git checkout main
git cherry-pick 1fc9263
```

**Output:**
```
[main 76dd491] First commit on cherry-pick-branch
 Date: Fri Sep 4 21:50:03 2026 +0530
 1 file changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 Git-Exercise/temp.txt
```

### Step 6: Verify the cherry-picked commit is now in main

```bash
git log --oneline -5
```

**Output:**
```
76dd491 First commit on cherry-pick-branch
a6f3390 Update README with current network config and all evidence
5320ed3 Add complete command output evidence for all tasks
70db7bc Add bind-mount folder
c677eb9 Add Docker Networking & Volume homework documentation
```

✅ The commit `76dd491` (cherry-picked from `cherry-pick-branch`) is now available in the `main` branch.

---

## Screenshots

![Screenshot 1](Screenshot%202026-09-04%20214606.png)
![Screenshot 2](Screenshot%202026-09-04%20214614.png)
![Screenshot 3](Screenshot%202026-09-04%20214626.png)
![Screenshot 4](Screenshot%202026-09-04%20214632.png)
