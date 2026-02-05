import requests
import os

# ========================
# CONFIGURATION
# ========================
API_URL = "http://localhost:5004/predict-health"
IMAGE_PATH = "wall.jpg"  # ⚠️ REPLACE this with your actual image filename

def test_prediction():
    # 1. Check if image exists
    if not os.path.exists(IMAGE_PATH):
        print(f"❌ Error: Image file '{IMAGE_PATH}' not found.")
        print("   Please place a .jpg or .png file in this folder and update IMAGE_PATH.")
        return

    print(f"🚀 Sending {IMAGE_PATH} to {API_URL}...")

    # 2. Prepare the payload
    # 'file' key matches: request.files["file"] in your Flask app
    files = {'file': open(IMAGE_PATH, 'rb')}

    try:
        # 3. Send POST request
        response = requests.post(API_URL, files=files)
        
        # 4. Handle Response
        if response.status_code == 200:
            data = response.json()
            print("\n✅ Success!")
            print(f"   Health Score:  {data.get('health_score')}")
            print(f"   Distress Prob: {data.get('distress_prob')}")
            print("-" * 30)
            print(f"   Full Response: {data}")
        else:
            print(f"\n⚠️ Server returned error: {response.status_code}")
            print(f"   Message: {response.text}")

    except requests.exceptions.ConnectionError:
        print("\n❌ Connection Refused.")
        print("   Is your Flask server running? Run 'python app.py' in a separate terminal.")
    except Exception as e:
        print(f"\n❌ An error occurred: {e}")
    finally:
        files['file'].close()

if __name__ == "__main__":
    test_prediction()