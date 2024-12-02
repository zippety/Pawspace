"""Image conversion utility module.

This module provides functionality to convert images to base64 encoded strings,
with support for various image formats and automatic conversion to JPEG.
"""

import base64
import io
import sys
from PIL import Image


def convert_image_to_base64(input_path: str, output_path: str) -> None:
    """Convert an image file to base64 encoded string and save to file.

    This function handles various image formats, converting them to JPEG before
    encoding to base64. It properly handles transparency in PNG images by
    converting them to RGB with a white background.

    Args:
        input_path: Path to the input image file.
        output_path: Path where the base64 encoded string should be saved.

    Raises:
        SystemExit: If there is an error during conversion.
    """
    try:
        with Image.open(input_path) as img:
            # Convert to JPEG format
            if img.format != "JPEG":
                img = _convert_to_rgb(img)

            # Save as base64
            buffer = io.BytesIO()
            img.save(buffer, format="JPEG", quality=85)
            img_str = base64.b64encode(buffer.getvalue()).decode()

            # Write to output file
            with open(output_path, "w") as f:
                f.write(img_str)

            print(
                "Successfully converted {} to base64 and saved to {}"
                .format(input_path, output_path)
            )

    except Exception as e:
        print(f"Error converting image: {str(e)}")
        sys.exit(1)


def _convert_to_rgb(img: Image.Image) -> Image.Image:
    """Convert an image to RGB mode, handling transparency.

    Args:
        img: PIL Image object to convert.

    Returns:
        PIL Image object in RGB mode.
    """
    if img.mode in ("RGBA", "LA") or (
        img.mode == "P" and "transparency" in img.info
    ):
        background = Image.new("RGB", img.size, (255, 255, 255))
        if img.mode == "P":
            img = img.convert("RGBA")
        # 3 is alpha channel
        background.paste(img, mask=img.split()[3])
        return background
    return img.convert("RGB")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(
            "Usage: python image_converter.py "
            "<input_image_path> <output_text_path>"
        )
        sys.exit(1)

    input_path = sys.argv[1]
    output_path = sys.argv[2]
    convert_image_to_base64(input_path, output_path)
