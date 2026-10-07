# CI/CD & GitHub Actions

## What we will build

```text
Developer
   ↓
git push
   ↓
GitHub Repository
   ↓
GitHub Actions
   ↓
┌─────────────────────┐
│ CI Pipeline         │
│                     │
│ Checkout code       │
│ Setup Python        │
│ Install dependencies│
│ Run tests           │
│ Create artifact     │
└─────────────────────┘
   ↓
Build/Test PASS
   ↓
Artifact available
```

GitHub workflow files are YAML files stored under `.github/workflows/`. A workflow contains jobs, and each job contains steps that execute on a runner.  


## 2. Project Folder Structure

Create:

```text
session16-cicd-github-actions/
│
├── README.md
│
├── app/
│   ├── __init__.py
│   └── calculator.py
│
├── tests/
│   └── test_calculator.py
│
├── requirements.txt
│
├── build.sh
│
├── .gitignore
│
└── .github/
    └── workflows/
        └── ci.yml
```

---

## 3. Create Project

```bash
mkdir session16-cicd-github-actions
cd session16-cicd-github-actions
mkdir -p app tests .github/workflows
touch README.md
touch app/__init__.py
touch app/calculator.py
touch tests/test_calculator.py
touch requirements.txt
touch build.sh
touch .gitignore
touch .github/workflows/ci.yml
```

Check:

```bash
tree
```

Expected:

```text
.
├── .github
│   └── workflows
│       └── ci.yml
├── app
│   ├── __init__.py
│   └── calculator.py
├── tests
│   └── test_calculator.py
├── .gitignore
├── README.md
├── build.sh
└── requirements.txt
```

If tree is not installed:

```bash
find . -not -path './.git/*'
```

---

## 4. Application Code

`app/calculator.py`

```python
def add(a, b):
    return a + b
def subtract(a, b):
    return a - b
def multiply(a, b):
    return a * b
def divide(a, b):
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b
if __name__ == "__main__":
    print("Calculator Application")
    print("----------------------")
    print("Available operations: +, -, *, /")
    print("Type 'q' or 'quit' to exit.")
    
    while True:
        try:
            expr = input("\nEnter calculation (e.g., 10 + 5): ")
            if expr.lower() in ('q', 'quit'):
                print("Goodbye!")
                break
            
            parts = expr.split()
            if len(parts) != 3:
                print("Invalid format. Please use: number operation number (e.g., 10 + 5)")
                continue
                
            a, op, b = float(parts[0]), parts[1], float(parts[2])
            
            if op == '+':
                print(f"Result: {add(a, b)}")
            elif op == '-':
                print(f"Result: {subtract(a, b)}")
            elif op == '*':
                print(f"Result: {multiply(a, b)}")
            elif op == '/':
                print(f"Result: {divide(a, b)}")
            else:
                print(f"Unknown operation: {op}")
        except ValueError as e:
            print(f"Error: {e}")
        except Exception as e:
            print(f"Unexpected error: {e}")
```

---

## 5. Run Application

Command:

```bash

# create env

python3 -m venv path/to/venv
source path/to/venv/bin/activate

# run application
python3 app/calculator.py
```

Expected output:

```text
Calculator Application
----------------------
Available operations: +, -, *, /
Type 'q' or 'quit' to exit.

Enter calculation (e.g., 10 + 5): 10 + 5
Result: 15.0

Enter calculation (e.g., 10 + 5): q
Goodbye!
```


---

## 6. Requirements

`requirements.txt`

```text
pytest
```

Install:

```bash
python3 -m pip install -r requirements.txt
```

Expected:

```text
Successfully installed pytest ...
```

Check:

```bash
pytest --version
```

Expected:

```text
pytest 8.x.x
```

The exact version can differ.

---

## 7. Write Tests

`tests/test_calculator.py`

```python
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pytest
from app.calculator import add, subtract, multiply, divide
def test_add():
    assert add(10, 5) == 15
def test_subtract():
    assert subtract(10, 5) == 5
def test_multiply():
    assert multiply(10, 5) == 50
def test_divide():
    assert divide(10, 5) == 2
def test_divide_by_zero():
    with pytest.raises(ValueError):
        divide(10, 0)
```

---

## 8. Run Tests Locally

Command:

```bash
pytest
```

Expected:

```text
============================= test session starts =============================
platform darwin -- Python 3.x.x, pytest-8.x.x
collected 5 items
tests/test_calculator.py .....                                             [100%]
============================== 5 passed in 0.0xs ==============================
```

The exact platform, Python version and execution time can differ.


```text
5 tests
   ↓
5 passed
   ↓
Application is working
```

If one test fails:

```text
4 passed
1 failed
```

Then CI should also fail.

That is the whole point of CI.

---

## 9. Build Script

Now create a small build process.

`build.sh`

```bash
#!/bin/bash
set -e
echo "Starting build..."
rm -rf build
mkdir -p build
cp app/calculator.py build/
echo "Application copied to build directory."
cat > build/build-info.txt <<EOF
Application: Session 16 Calculator
Build Status: SUCCESS
Build Date: $(date)
EOF
echo "Build completed successfully."
```

Make executable:

```bash
chmod +x build.sh
```

Run:

```bash
./build.sh
```

Expected:

```text
Starting build...
Application copied to build directory.
Build completed successfully.
```

Check:

```bash
ls -l build
```

Expected:

```text
calculator.py
build-info.txt
```

Check:

```bash
cat build/build-info.txt
```

Expected:

```text
Application: Session 16 Calculator
Build Status: SUCCESS
Build Date: Tue Sep 22 ...
```

The date will obviously be different on each run.

---

## 10. .gitignore

`.gitignore`

```text
__pycache__/
*.pyc
.pytest_cache/
.venv/
venv/
build/
.DS_Store
```

Why?

We don’t want temporary/generated files inside Git.

For example:

```text
build/
__pycache__/
.pytest_cache/
```

are generated locally.

---

## 11. CI/CD Concepts

Before GitHub Actions, explain this:

### CI

Continuous Integration

Developer changes code:

```text
Developer
   ↓
git push
   ↓
GitHub
   ↓
Build
   ↓
Test
   ↓
PASS / FAIL
```

CI answers:

“Did the new code break the application?”

---

## 12. CD

Continuous Delivery / Continuous Deployment

After code passes CI:

```text
Code
 ↓
Build
 ↓
Test
 ↓
Package
 ↓
Deploy
 ↓
Application available
```

Important distinction:

| CI | CD |
|---|---|
| Build | Deploy |
| Test | Release |
| Validate code | Deliver application |
| Find bugs early | Make application available |

For this session, we will implement CI + build artifact.

We will not deploy to Kubernetes yet.

That keeps the learning flow clean.

---

## 13. What is GitHub Actions?

GitHub Actions is GitHub’s automation platform.

Instead of manually doing:

```bash
git pull
pip install
pytest
./build.sh
```

GitHub can do it automatically whenever code is pushed.

```text
Developer
     ↓
   git push
     ↓
GitHub Actions
     ↓
┌──────────────────┐
│ Checkout         │
│ Setup Python     │
│ Install packages │
│ Run tests        │
│ Build            │
│ Upload artifact  │
└──────────────────┘
```

---

## 14. Workflow

A workflow is the complete automation definition.

Create:

`.github/workflows/ci.yml`

GitHub requires workflow YAML files to be placed in `.github/workflows/`.  

---

## 15. Complete CI Workflow

`.github/workflows/ci.yml`

```yaml
name: Python CI Pipeline
on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
  workflow_dispatch:
jobs:
  build-and-test:
    name: Build and Test
    runs-on: ubuntu-latest
    steps:
      - name: Checkout source code
        uses: actions/checkout@v6
      - name: Setup Python
        uses: actions/setup-python@v7
        with:
          python-version: "3.12"
      - name: Display Python version
        run: python --version
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
      - name: Run tests
        run: |
          pytest -v
      - name: Build application
        run: |
          chmod +x build.sh
          ./build.sh
      - name: Show build files
        run: |
          echo "Build directory:"
          ls -la build
      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: calculator-build
          path: build/
```

GitHub Actions workflows consist of jobs, and jobs contain ordered steps. Each job runs on the runner specified by `runs-on`.  

---

## 16. Explain Every Line

### name

```yaml
name: Python CI Pipeline
```

Name visible in GitHub Actions.

GitHub:

```text
Actions
   ↓
Python CI Pipeline
```

---

### on

```yaml
on:
```

Defines when the workflow should execute.

---

### Push

```yaml
on:
  push:
    branches:
      - main
```

Means:

```text
git push
   ↓
main branch
   ↓
Run workflow
```

---

### Pull Request

```yaml
pull_request:
  branches:
    - main
```

When someone creates/updates a PR targeting main, CI runs.

---

### Manual execution

```yaml
workflow_dispatch:
```

This allows:

```text
GitHub
 ↓
Actions
 ↓
Run workflow
```


---

## 17. Jobs

```yaml
jobs:
  build-and-test:
```

A workflow can have multiple jobs.

Example:

```text
Workflow
│
├── build
├── test
├── security-scan
└── deploy
```

For our first pipeline:

```text
Workflow
   │
   └── build-and-test
```

---

## 18. Runner

```yaml
runs-on: ubuntu-latest
```

This means GitHub provides a Linux machine to execute the job.

Think:

```text
GitHub
   ↓
Creates temporary Ubuntu machine
   ↓
Runs our commands
   ↓
Job finishes
   ↓
Runner environment is cleaned up
```

GitHub-hosted runners can be selected with `runs-on`; `ubuntu-latest` is one of the standard labels.  

---

## 19. Steps

```yaml
steps:
```

Our job contains:

* Step 1 -> Checkout
* Step 2 -> Setup Python
* Step 3 -> Python version
* Step 4 -> Install dependencies
* Step 5 -> Run tests
* Step 6 -> Build
* Step 7 -> Show files
* Step 8 -> Upload artifact

A step can either execute commands using `run` or use an existing action with `uses`.  

---

## 20. uses

Example:

```yaml
- name: Checkout source code
  uses: actions/checkout@v6
```

`uses` means:

Use an existing GitHub Action.

Instead of manually writing Git commands, we use:

`actions/checkout@v6`

---

## 21. run

Example:

```yaml
- name: Run tests
  run: |
    pytest -v
```

`run` executes shell commands on the runner.  

---

## 22. Push Code to GitHub

First check Git:

```bash
git --version
```

Expected:

```text
git version 2.x.x
```

Initialize:

```bash
git init
```

Expected:

```text
Initialized empty Git repository in .../session16-cicd-github-actions/.git/
```

---

## 23. Check Git Status

```bash
git status
```

Expected:

```text
On branch main
No commits yet
Untracked files:
  .github/
  .gitignore
  README.md
  app/
  build.sh
  requirements.txt
  tests/
```

---

## 24. Add Files

```bash
git add .
```

Check:

```bash
git status
```

Expected:

```text
Changes to be committed:
  new file:   .github/workflows/ci.yml
  new file:   .gitignore
  new file:   README.md
  new file:   app/__init__.py
  new file:   app/calculator.py
  new file:   build.sh
  new file:   requirements.txt
  new file:   tests/test_calculator.py
```

---

## 25. First Commit

```bash
git commit -m "Add CI pipeline with GitHub Actions"
```

Expected:

```text
[main abc1234] Add CI pipeline with GitHub Actions
 8 files changed, ...
 create mode 100644 .github/workflows/ci.yml
 ...
```

The commit ID will differ.

---

## 26. Connect GitHub Repository

Create an empty GitHub repository:

`session16-cicd-github-actions`

Then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/session16-cicd-github-actions.git
```

Check:

```bash
git remote -v
```

Expected:

```text
origin  https://github.com/YOUR_USERNAME/session16-cicd-github-actions.git (fetch)
origin  https://github.com/YOUR_USERNAME/session16-cicd-github-actions.git (push)
```

---

## 27. Push

```bash
git branch -M main
git push -u origin main
```

Expected:

```text
Enumerating objects: ...
Counting objects: 100% ...
Writing objects: 100% ...
To https://github.com/YOUR_USERNAME/session16-cicd-github-actions.git
 * [new branch]      main -> main
branch 'main' set up to track 'origin/main'.
```

---

## 28. GitHub Actions Pipeline

Now go to:

```text
GitHub Repository
        ↓
Actions
        ↓
Python CI Pipeline
```

You should see:

```text
Python CI Pipeline
        [PASS]
Build and Test
```

Expected overall result:

```text
[PASS] Python CI Pipeline
```

---

## 29. Expected GitHub Job Flow

Inside the workflow:

```text
Build and Test
│
├── [PASS] Checkout source code
│
├── [PASS] Setup Python
│
├── [PASS] Display Python version
│
├── [PASS] Install dependencies
│
├── [PASS] Run tests
│
├── [PASS] Build application
│
├── [PASS] Show build files
│
└── [PASS] Upload build artifact
```


This is the actual CI/CD pipeline.

---

## 30. Expected Test Output in GitHub

The `pytest -v` step should show something similar to:

```text
============================= test session starts =============================
platform linux -- Python 3.12.x, pytest-8.x.x
collecting ... collected 5 items
tests/test_calculator.py::test_add PASSED
tests/test_calculator.py::test_subtract PASSED
tests/test_calculator.py::test_multiply PASSED
tests/test_calculator.py::test_divide PASSED
tests/test_calculator.py::test_divide_by_zero PASSED
============================== 5 passed in 0.0xs ==============================
```

The exact versions and execution time can differ.

---

## 31. Build Output

GitHub Actions should show:

```text
Starting build...
Application copied to build directory.
Build completed successfully.
Build directory:
total ...
-rw-r--r-- ... calculator.py
-rw-r--r-- ... build-info.txt
```

---

## 32. Artifacts

This is an important topic.

An artifact is a file or collection of files produced by a workflow that you want to keep and access after the job finishes.

Our build produces:

```text
build/
├── calculator.py
└── build-info.txt
```

We upload it using:

```yaml
- name: Upload build artifact
  uses: actions/upload-artifact@v4
  with:
    name: calculator-build
    path: build/
```

---

## 33. Where we can See the Artifact

Go to:

```text
GitHub
 ↓
Actions
 ↓
Python CI Pipeline
 ↓
Successful run
 ↓
Summary
 ↓
Artifacts
```

They should see:

```text
Artifacts
calculator-build
```

Click it and download it.

Downloaded artifact contains:

```text
calculator.py
build-info.txt
```

---

## 34. Artifact vs Git Repository

**Git**

Stores:

Source Code

Example:

```text
app/calculator.py
tests/test_calculator.py
```

**Artifact**

Stores:

Build Output

Example:

```text
build/calculator.py
build/build-info.txt
```

Simple:

```text
Git
 ↓
Source
Build
 ↓
Artifact
```

---

## 35. Secrets

Now introduce secrets.

We will demonstrate a secret without printing its value.

GitHub Actions provides a secrets context for accessing configured secrets. Secret values should not be hardcoded in workflow files.  

### Create Secret

Go to:

```text
Repository
 ↓
Settings
 ↓
Secrets and variables
 ↓
Actions
 ↓
New repository secret
```

Create:

```text
Name:
DEMO_SECRET
Value:
hello-github-actions
```

Do not use a real password or production credential for this classroom demo.

---

## 36. Add Secret Step

Add this to ci.yml:

```yaml
      - name: Check secret
        env:
          DEMO_SECRET: ${{ secrets.DEMO_SECRET }}
        run: |
          if [ -n "$DEMO_SECRET" ]; then
            echo "Secret is available."
          else
            echo "Secret is not configured."
            exit 1
          fi
```

Expected:

```text
Secret is available.
```

Notice:

We do not do this:

```bash
echo "${{ secrets.DEMO_SECRET }}"
```

We don’t want to print secret values.

---

## 37. Why Secrets?

Real-world examples:

* AWS_ACCESS_KEY
* AWS_SECRET_KEY
* Docker registry password
* API token
* Cloud credentials
* Database password

Instead of:

```yaml
password: mypassword123
```

Use:

```yaml
password: ${{ secrets.DOCKER_PASSWORD }}
```

---

## 38. CI Pipeline with Secrets

Final flow:

```text
Push
 ↓
Checkout
 ↓
Setup Python
 ↓
Install
 ↓
Test
 ↓
Build
 ↓
Secret available?
 ↓
Upload Artifact
```

---

## 39. Demonstrate Failure

Change:

```python
def add(a, b):
    return a + b
```

to:

```python
def add(a, b):
    return a + b + 1
```

Run locally:

```bash
pytest
```

Expected:

```text
FAILED tests/test_calculator.py::test_add
```

Then:

```bash
git add .
git commit -m "Introduce test failure"
git push
```

GitHub Actions runs automatically.

Expected:

```text
[PASS] Checkout
[PASS] Setup Python
[PASS] Install dependencies
[FAIL] Run tests

Overall:

[FAIL] Python CI Pipeline
```

> "CI is not here to make developers happy. CI is here to catch broken code before it moves forward."

Then fix:

```python
def add(a, b):
    return a + b
```

Push again:

```bash
git add .
git commit -m "Fix calculator test"
git push
```

Expected:

```text
[PASS] Python CI Pipeline
```

---

## 40. Multiple Jobs Demo

Replace the workflow with:

```yaml
name: CI Pipeline
on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
  workflow_dispatch:
jobs:
  test:
    name: Test Application
    runs-on: ubuntu-latest
    steps:
      - name: Checkout source code
        uses: actions/checkout@v6
      - name: Setup Python
        uses: actions/setup-python@v7
        with:
          python-version: "3.12"
      - name: Install dependencies
        run: pip install -r requirements.txt
      - name: Run tests
        run: pytest -v
  build:
    name: Build Application
    runs-on: ubuntu-latest
    steps:
      - name: Checkout source code
        uses: actions/checkout@v6
      - name: Setup Python
        uses: actions/setup-python@v7
        with:
          python-version: "3.12"
      - name: Install dependencies
        run: pip install -r requirements.txt
      - name: Build application
        run: |
          chmod +x build.sh
          ./build.sh
      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: calculator-build
          path: build/
```

---

## 41. Important: Jobs Run in Parallel


```text
CI Pipeline
│
├── Test Application     [PASS]
│
└── Build Application    [PASS]
```

By default, jobs run independently and can run in parallel. If you need one job to wait for another, use `needs`.  

---

## 42. needs

Now modify:

```yaml
build:
  needs: test
```

Full relevant part:

```yaml
jobs:
  test:
    name: Test Application
    runs-on: ubuntu-latest
    steps:
      ...
  build:
    name: Build Application
    needs: test
    runs-on: ubuntu-latest
    steps:
      ...
```

Now:

```text
Test
 ↓
PASS
 ↓
Build
```

If test fails:

```text
Test
 ↓
FAIL
 ↓
Build does not run
```

This is a very important CI/CD concept.

---

## 43. Final Recommended ci.yml


```yaml
name: Python CI Pipeline
on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
  workflow_dispatch:
jobs:
  test:
    name: Test Application
    runs-on: ubuntu-latest
    steps:
      - name: Checkout source code
        uses: actions/checkout@v6
      - name: Setup Python
        uses: actions/setup-python@v7
        with:
          python-version: "3.12"
      - name: Display Python version
        run: python --version
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
      - name: Run tests
        run: |
          pytest -v
  build:
    name: Build Application
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Checkout source code
        uses: actions/checkout@v6
      - name: Setup Python
        uses: actions/setup-python@v7
        with:
          python-version: "3.12"
      - name: Build application
        run: |
          chmod +x build.sh
          ./build.sh
      - name: Show build output
        run: |
          ls -la build
          cat build/build-info.txt
      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: calculator-build
          path: build/
```

---

## 44. Final Pipeline


```text
                    GitHub Repository
                           │
                           │ git push
                           ▼
                  GitHub Actions Workflow
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
         TEST JOB                  BUILD JOB
              │                         │
       Checkout code             Checkout code
              │                         │
       Setup Python              Setup Python
              │                         │
       Install packages          Build application
              │                         │
          Run tests              Create build
              │                         │
          PASS / FAIL                  │
              │                        ▼
              │                  Upload Artifact
              │
              └──────────► build runs only
                           if test passes
```

---


## 45. Pipeline Execution Evidence

![GitHub Actions Workflow Execution Runs](./screenshots/01-github-actions-runs.png)

* **Repository:** `github.com/NEERASA-VEDA-VARSHIT/hey-cicd`
* **Workflow:** `Hello GitHub Actions`
* **Trigger 1 (Manual):** Workflow dispatch executed on `main` branch (11s, Success)
* **Trigger 2 (Push / Secrets):** Commit `056474f` ("secret added") validating secrets injection and build completion (8s, Success)
