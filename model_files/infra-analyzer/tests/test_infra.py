import requests

# 1. Define the URL
url = "http://localhost:8047/analyze"

# 2. Point to your image file
image_path = "broken-pipe1.jpg" # Make sure this file exists!

# 3. Send the POST request
try:
    with open(image_path, "rb") as f:
        files = {"file": f}
        print("Sending image to API...")
        response = requests.post(url, files=files)
    
    # 4. Print the result
    if response.status_code == 200:
        data = response.json()
        print("\n✅ Success!")
        print(f"Score: {data['quality_score']}")
        print(f"Status: {data['description']}")
    else:
        print(f"\n❌ Error {response.status_code}: {response.text}")

except FileNotFoundError:
    print(f"❌ Could not find file: {image_path}")