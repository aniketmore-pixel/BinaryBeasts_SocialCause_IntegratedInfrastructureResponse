# api_server.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import numpy as np
import cv2
import base64
import io
import torch
from utils import get_pothole_model, detection_img

app = Flask(__name__)
CORS(app)  # Allow React to communicate with this server

# Load model once at startup
model = get_pothole_model()
model.eval()
CLASSES = ["Background", "Pothole"]

@app.route('/detect', methods=['POST'])
def detect():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    conf_threshold = float(request.form.get('conf_threshold', 0.2))
    iou_threshold = float(request.form.get('iou_threshold', 0.7))

    try:
        # 1. Read Image
        img = Image.open(file).convert("RGB")  # ensure 3 channels
        img = np.array(img)

        # 2. Resize to model input size (480x480)
        img_resized = cv2.resize(img, (480, 480))

        # 3. Run Detection
        result_img = detection_img(model, img_resized, CLASSES, conf_threshold, iou_threshold)

        # --- FIX START ---
        # Convert result to uint8 if it's float
        if result_img.dtype != np.uint8:
            # Clip values between 0-255 and convert
            result_img = np.clip(result_img * 255, 0, 255).astype(np.uint8)
        
        # Ensure shape is HxWx3
        if len(result_img.shape) == 2:
            result_img = cv2.cvtColor(result_img, cv2.COLOR_GRAY2RGB)
        elif result_img.shape[2] == 4:
            result_img = cv2.cvtColor(result_img, cv2.COLOR_RGBA2RGB)
        # --- FIX END ---

        # 4. Convert Result to Base64 for frontend
        result_pil = Image.fromarray(result_img)
        buff = io.BytesIO()
        result_pil.save(buff, format="JPEG")
        img_str = base64.b64encode(buff.getvalue()).decode("utf-8")

        return jsonify({
            "status": "success",
            "image": f"data:image/jpeg;base64,{img_str}"
        })
    except Exception as e:
        print("❌ Detection error:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("🤖 Pothole Detection API running on port 5003...")
    app.run(port=5003, debug=True)
