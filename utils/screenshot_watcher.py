"""Screenshot watcher utility module.

This module monitors a directory for new screenshots and processes them,
automatically converting them to JPEG format and generating base64 encoded
versions.
"""

import base64
import io
import os
import shutil
import time
from PIL import Image
from watchdog.events import FileSystemEventHandler
from watchdog.observers import Observer

# Configure paths
SCREENSHOTS_DIR = r"C:\Users\djbro\Pictures\Screenshots"
WORKSPACE_DIR = (
    r"Z:\1rescue\project-bolt-sb1-mbbhsz (1)\Pawspace2\screenshots"
)
PROCESSED_DIR = os.path.join(WORKSPACE_DIR, "processed")
JPEG_DIR = os.path.join(WORKSPACE_DIR, "jpeg")

# Ensure directories exist
os.makedirs(WORKSPACE_DIR, exist_ok=True)
os.makedirs(PROCESSED_DIR, exist_ok=True)
os.makedirs(JPEG_DIR, exist_ok=True)


def convert_to_jpeg(image_path: str, output_path: str) -> bool:
    """Convert an image file to JPEG format.

    Args:
        image_path: Path to the source image file.
        output_path: Path where the JPEG file should be saved.

    Returns:
        bool: True if conversion was successful, False otherwise.
    """
    try:
        with Image.open(image_path) as img:
            # Convert to RGB mode if necessary
            if img.mode in ("RGBA", "LA") or (
                img.mode == "P" and "transparency" in img.info
            ):
                background = Image.new("RGB", img.size, (255, 255, 255))
                if img.mode == "P":
                    img = img.convert("RGBA")
                background.paste(img, mask=img.split()[3])
                img = background
            else:
                img = img.convert("RGB")

            # Save as JPEG
            img.save(output_path, format="JPEG", quality=85)
            print(f"Successfully converted {image_path} to JPEG")
            return True
    except Exception as e:
        print(f"Error converting image to JPEG: {str(e)}")
        return False


def convert_to_base64(image_path: str, output_path: str) -> bool:
    """Convert an image file to base64 encoded string and save to file.

    Args:
        image_path: Path to the source image file.
        output_path: Path where the base64 encoded string should be saved.

    Returns:
        bool: True if conversion was successful, False otherwise.
    """
    try:
        with Image.open(image_path) as img:
            # Convert to RGB mode if necessary
            if img.mode in ("RGBA", "LA") or (
                img.mode == "P" and "transparency" in img.info
            ):
                background = Image.new("RGB", img.size, (255, 255, 255))
                if img.mode == "P":
                    img = img.convert("RGBA")
                background.paste(img, mask=img.split()[3])
                img = background
            else:
                img = img.convert("RGB")

            # Save as base64
            buffer = io.BytesIO()
            img.save(buffer, format="JPEG", quality=85)
            img_str = base64.b64encode(buffer.getvalue()).decode()

            with open(output_path, "w") as f:
                f.write(img_str)

            msg = "Successfully converted {} to base64 and saved to {}"
            print(msg.format(image_path, output_path))
            return True
    except Exception as e:
        print(f"Error converting image to base64: {str(e)}")
        return False


class ScreenshotHandler(FileSystemEventHandler):
    """Handle file system events for screenshot files.

    This class monitors a directory for new screenshot files and processes them
    by converting to JPEG format and generating base64 encoded versions.
    """

    def on_created(self, event) -> None:
        """Handle the creation of new files in the watched directory.

        Args:
            event: The file system event containing information about the
                created file.
        """
        if event.is_directory:
            return

        # Get the file path and check if it's an image
        filepath = event.src_path
        filename = os.path.basename(filepath)
        base_name, ext = os.path.splitext(filename)
        if ext.lower() not in [".png", ".jpg", ".jpeg"]:
            return

        try:
            # Wait a brief moment to ensure file is completely written
            time.sleep(1)

            # Copy original to workspace
            workspace_path = os.path.join(WORKSPACE_DIR, filename)
            shutil.copy2(filepath, workspace_path)

            # If it's a PNG, convert to JPEG
            jpeg_path = None
            if ext.lower() == ".png":
                jpeg_path = os.path.join(JPEG_DIR, f"{base_name}.jpg")
                convert_to_jpeg(filepath, jpeg_path)

            # Convert to base64 text (using JPEG version if available)
            txt_path = os.path.join(WORKSPACE_DIR, f"{base_name}.txt")
            source = jpeg_path if ext.lower() == ".png" else filepath
            if convert_to_base64(source, txt_path):
                # Move original to processed folder
                processed_path = os.path.join(PROCESSED_DIR, filename)
                shutil.move(filepath, processed_path)
                print(f"Processed {filename}")

        except Exception as e:
            print(f"Error processing {filepath}: {str(e)}")


def main() -> None:
    """Start watching for screenshots in the configured directory."""
    # Create an observer and handler
    event_handler = ScreenshotHandler()
    observer = Observer()
    observer.schedule(event_handler, SCREENSHOTS_DIR, recursive=False)
    observer.start()

    msg = "Watching for screenshots in {}"
    print(msg.format(SCREENSHOTS_DIR))
    print("Press Ctrl+C to stop")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        print("\nStopping screenshot watcher...")

    observer.join()


if __name__ == "__main__":
    main()
