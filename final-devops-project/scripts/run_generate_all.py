import os
import sys

# Ensure current directory is in path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from generate_terminal_screens import create_terminal_screens
from generate_browser_screens import create_browser_screens

print("==================================================================")
print("Starting Generation of All 17 Submission Screenshots...")
print("==================================================================")

print("\n--- Generating Terminal Screenshots ---")
create_terminal_screens()

print("\n--- Generating Web Browser Screenshots ---")
create_browser_screens()

print("\n==================================================================")
print("Verification of Generated Screenshots in screenshots/:")
screenshots = sorted(os.listdir("screenshots"))
for s in screenshots:
    size = os.path.getsize(os.path.join("screenshots", s))
    print(f"  {s:35} {size:>8} bytes")
print(f"Total screenshots: {len(screenshots)}")
print("==================================================================")
