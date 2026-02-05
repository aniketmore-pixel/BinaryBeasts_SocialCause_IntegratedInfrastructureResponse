from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from groq_client import assess_infrastructure
from utils.image_helper import validate_and_process_image
import uvicorn

app = FastAPI(title="InfraScan API")

# --- Enable CORS ---
origins = [
    "http://localhost:3000",  # React dev server
    "http://127.0.0.1:3000",
    "*"  # Or allow all origins for testing (not recommended in production)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze_infra(file: UploadFile = File(...)):
    if file.content_type and not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")
    
    raw_content = await file.read()
    
    try:    
        optimized_content = validate_and_process_image(raw_content)
        result = assess_infrastructure(optimized_content)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid image file: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8047)
