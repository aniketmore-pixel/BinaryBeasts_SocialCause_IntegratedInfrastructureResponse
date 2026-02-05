import os
import base64
import json
from groq import Groq
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize Groq Client
# Ensure GROQ_API_KEY is set in your .env file
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def assess_infrastructure(image_bytes: bytes) -> dict:
    """
    Sends image bytes to Groq Vision model and returns a structured assessment.
    """
    
    # 1. Encode the raw bytes to Base64
    base64_image = base64.b64encode(image_bytes).decode('utf-8')

    # 2. Define the System Prompt (The Expert Persona)
    system_prompt = (
        "You are an expert Civil Engineer specializing in pipeline and sewage infrastructure assessment. "
        "Analyze the input image for structural integrity, corrosion, blockage, and wear. "
        "You must return the result in strictly valid JSON format with exactly two keys:\n"
        "1. 'health_score': A float between 0.0 (critical failure) and 1.0 (pristine condition).\n"
        "2. 'description': A one-line technical summary of the visual state.\n\n"
        "Scoring Guide:\n"
        "- 0.9-1.0: New/Perfect condition.\n"
        "- 0.7-0.8: Good; minor surface wear or oxidation.\n"
        "- 0.4-0.6: Fair; visible corrosion, minor cracks, or debris buildup.\n"
        "- 0.0-0.3: Critical; structural collapse, major leakage, or severe blockage."
    )

    try:
        # 3. Call Groq API
        response = client.chat.completions.create(
            # 👇 UPDATED MODEL NAME 👇
            model="meta-llama/llama-4-scout-17b-16e-instruct", 
            messages=[
                {
                    "role": "system", 
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text", 
                            "text": "Analyze this infrastructure image and provide the JSON assessment."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            temperature=0.1,
            response_format={"type": "json_object"}
        )

        # 4. Parse the response
        result_content = response.choices[0].message.content
        
        
        print("DEBUG: Groq output:", result_content)

        return json.loads(result_content)

    except Exception as e:
        # Fallback error handling
        return {
            "health_score": 0.0,
            "description": f"Error analyzing image: {str(e)}",
            "error": True
        }

if __name__ == "__main__":
    # Simple test block to run this file directly
    test_image_path = "tests/test_pipe.jpg" 
    if os.path.exists(test_image_path):
        with open(test_image_path, "rb") as f:
            print(assess_infrastructure(f.read()))
    else:
        print("Test image not found. Place an image at 'tests/test_pipe.jpg' to test.")