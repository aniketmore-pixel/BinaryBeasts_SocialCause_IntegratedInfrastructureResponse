import io
from PIL import Image

# Standard max dimension for AI analysis (balances speed vs detail)
MAX_DIMENSION = 1536 

def validate_and_process_image(image_bytes: bytes) -> bytes:
    """
    1. Validates that the bytes are a real image.
    2. Resizes the image if it exceeds MAX_DIMENSION (maintaining aspect ratio).
    3. Converts to JPEG format for consistency.
    4. Returns the optimized bytes.
    """
    try:
        # Open image from bytes
        img = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB (handles PNGs with transparency issues)
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")

        # Check dimensions
        width, height = img.size
        
        # Resize if too large
        if width > MAX_DIMENSION or height > MAX_DIMENSION:
            # Calculate new size maintaining aspect ratio
            img.thumbnail((MAX_DIMENSION, MAX_DIMENSION))

        # Save back to bytes
        output_buffer = io.BytesIO()
        # Quality=85 reduces file size significantly with no visible loss for AI
        img.save(output_buffer, format="JPEG", quality=85) 
        
        return output_buffer.getvalue()

    except Exception as e:
        raise ValueError(f"Invalid image file: {str(e)}")