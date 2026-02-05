import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import GlobalAveragePooling2D, Dense, Dropout
from tensorflow.keras.models import Model, Sequential
import numpy as np
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS

# ========================
# Config
# ========================
IMG_SIZE = (224, 224)
MODEL_WEIGHTS = "kunalmodel/model.weights.h5"

# ========================
# Build model architecture
# ========================
base_model = MobileNetV2(input_shape=(224,224,3), include_top=False, weights="imagenet")
base_model.trainable = False

model = Sequential([
    base_model,
    GlobalAveragePooling2D(),
    Dense(128, activation="relu"),
    Dropout(0.4),
    Dense(1, activation="sigmoid")
])

# Load your trained weights
model.load_weights(MODEL_WEIGHTS)
model.trainable = False
print("✅ Model loaded with custom weights successfully")

# ========================
# Flask app
# ========================
app = Flask(__name__)
CORS(app)

def preprocess_image(file):
    img = Image.open(file).convert("RGB")
    img = img.resize(IMG_SIZE)
    img_array = np.array(img) / 255.0
    img_batch = np.expand_dims(img_array, axis=0)
    return img_batch.astype(np.float32)

@app.route("/predict-health", methods=["POST"])
def predict_health():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files["file"]
    try:
        img_batch = preprocess_image(file)
        distress_prob = float(model.predict(img_batch, verbose=0)[0][0])
        health_score = max(0.0, min(1.0, 1 - distress_prob))
        return jsonify({
            "status": "success",
            "health_score": round(health_score, 3),
            "distress_prob": round(distress_prob, 3)
        })
    except Exception as e:
        print("❌ Prediction error:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = 5004
    print(f"🛠️ Wall Health API running on port {port}...")
    app.run(port=port, debug=True)
