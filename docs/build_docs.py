#!/usr/bin/env python3
"""Build both Sphinx and MkDocs documentation."""

import os
import shutil
import subprocess
from pathlib import Path


def run_command(command, cwd=None):
    """Run a command and return its output."""
    print(f"Running: {' '.join(command)}")
    result = subprocess.run(
        command,
        cwd=cwd,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        print("Error output:")
        print(result.stderr)
        raise Exception(f"Command failed with exit code {result.returncode}")
    return result.stdout


def build_sphinx():
    """Build Sphinx documentation."""
    print("\nBuilding Sphinx documentation...")
    sphinx_dir = Path("sphinx")

    # Clean previous build
    build_dir = sphinx_dir / "_build"
    if build_dir.exists():
        shutil.rmtree(build_dir)

    # Build docs
    run_command(["make", "html"], cwd=sphinx_dir)
    print("✓ Sphinx documentation built successfully")


def build_mkdocs():
    """Build MkDocs documentation."""
    print("\nBuilding MkDocs documentation...")

    # Clean previous build
    site_dir = Path("site")
    if site_dir.exists():
        shutil.rmtree(site_dir)

    # Build docs
    run_command(["mkdocs", "build"])

    # Copy to Sphinx build directory
    user_guide_dir = Path("sphinx/_build/html/user-guide")
    if user_guide_dir.exists():
        shutil.rmtree(user_guide_dir)
    shutil.copytree("site", user_guide_dir)
    print("✓ MkDocs documentation built successfully")


def main():
    """Main function."""
    # Ensure we're in the docs directory
    os.chdir(Path(__file__).parent)

    print("=== Building Documentation ===")

    try:
        build_sphinx()
        build_mkdocs()
        print("\n✓ All documentation built successfully!")
        print("\nYou can find the combined documentation in:")
        print("  sphinx/_build/html/")
    except Exception as e:
        print(f"\n✗ Error building documentation: {e}")
        exit(1)


if __name__ == "__main__":
    main()
