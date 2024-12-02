"""Screenshot Watcher Module.

Monitor directories for new screenshot files and process them for PawSpace.
Handles detection, processing, and organization of screenshots taken by hosts
to document their pet-sitting spaces.
"""

import os
import time
from pathlib import Path
from typing import Optional

from watchdog.events import FileSystemEventHandler
from watchdog.observers import Observer


class ScreenshotHandler(FileSystemEventHandler):
    """Handle file system events related to screenshots.

    Extends FileSystemEventHandler to provide custom handling of screenshot
    files as they are created or modified.
    """

    def __init__(self, target_dir: str):
        """Initialize the ScreenshotHandler.

        Args:
            target_dir (str): The directory path to monitor for screenshots.
        """
        self.target_dir = target_dir
        super().__init__()

    def on_created(self, event) -> None:
        """Handle the creation of new files in the watched directory.

        Args:
            event: File system event containing information about created file.
        """
        if not event.is_directory:
            file_path = Path(event.src_path)
            if self._is_screenshot(file_path):
                self._process_screenshot(file_path)

    def _is_screenshot(self, file_path: Path) -> bool:
        """Check if a file is a screenshot based on extension and naming.

        Args:
            file_path (Path): The path to the file to check.

        Returns:
            bool: True if the file is a screenshot, False otherwise.
        """
        screenshot_extensions = {".png", ".jpg", ".jpeg"}
        return (
            file_path.suffix.lower() in screenshot_extensions
            and "screenshot" in file_path.name.lower()
        )

    def _process_screenshot(self, file_path: Path) -> Optional[Path]:
        """Process a screenshot file by organizing and modifying it.

        Args:
            file_path (Path): Path to the screenshot file to process.

        Returns:
            Optional[Path]: Path to processed file, None if processing failed.
        """
        try:
            # Add processing logic here
            return file_path
        except Exception as e:
            print(f"Error processing screenshot {file_path}: {e}")
            return None


def start_watching(directory: str) -> None:
    """Start watching a directory for new screenshots.

    Args:
        directory (str): The directory path to monitor for screenshots.
    """
    event_handler = ScreenshotHandler(directory)
    observer = Observer()
    observer.schedule(event_handler, directory, recursive=False)
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()


if __name__ == "__main__":
    watch_dir = os.path.expanduser("~/Screenshots")
    print(f"Starting screenshot watcher in: {watch_dir}")
    start_watching(watch_dir)
