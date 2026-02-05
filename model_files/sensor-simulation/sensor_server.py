import random
import time
import threading
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow React to fetch data

# In-memory storage for sensor states
# Structure: { infra_id: { type: 'structural', data: { ... } } }
sensor_states = {}

def update_sensors():
    """Background thread to simulate realistic sensor physics."""
    while True:
        for infra_id, state in sensor_states.items():
            infra_type = state.get('type', 'generic')
            data = state['data']

            # --- SIMULATION LOGIC ---
            
            # 1. Structural (Bridges/Buildings)
            if infra_type in ['structural', 'bridge', 'road', 'building']:
                # Vibration random walk (0 to 10 scale)
                change = random.uniform(-0.5, 0.5)
                data['vibration'] = max(0, min(10, data['vibration'] + change))
                
                # Stability Physics: High vibration degrades stability
                if data['vibration'] > 6.5:
                    data['stability'] = max(0, data['stability'] - random.uniform(0.5, 2.0))
                    data['status'] = "CRITICAL: High Vibration Detected"
                elif data['vibration'] > 4.0:
                    data['stability'] = max(0, data['stability'] - random.uniform(0.1, 0.5))
                    data['status'] = "WARNING: Unstable Load"
                else:
                    # Slow recovery if stable
                    data['stability'] = min(100, data['stability'] + 0.2)
                    data['status'] = "Stable"

            # 2. Water / Pipeline
            elif infra_type in ['water', 'pipeline', 'sewage']:
                # Base pressure fluctuation
                data['pressure'] = max(0, data['pressure'] + random.uniform(-2, 2))
                
                # Random Anomaly: Pipe Burst (Sudden drop)
                if random.random() < 0.05: # 5% chance of event
                    data['pressure'] -= 15
                
                # Logic
                if data['pressure'] < 20:
                    data['status'] = "CRITICAL: Pressure Loss / Leak Detected"
                    data['flow_rate'] = max(0, data['flow_rate'] - 5)
                elif data['pressure'] > 90:
                    data['status'] = "WARNING: Overpressure"
                else:
                    data['status'] = "Normal Flow"
                    data['flow_rate'] = 450 + random.uniform(-10, 10)

            # 3. Power Grid (High Voltage / Substation)
            elif infra_type == 'powergrid':
                # Frequency Stability (Target 50.00 Hz) - Critical metric
                freq_drift = random.uniform(-0.05, 0.05)
                data['frequency'] = round(data['frequency'] + freq_drift, 3)
                
                # Force frequency back towards 50Hz (Grid inertia)
                if data['frequency'] > 50.2: data['frequency'] -= 0.08
                if data['frequency'] < 49.8: data['frequency'] += 0.08

                # Load fluctuation (MW)
                data['load_mw'] = max(0, data['load_mw'] + random.uniform(-2, 2))

                # Power Factor (Efficiency 0.0 - 1.0)
                data['power_factor'] = max(0.85, min(0.99, data['power_factor'] + random.uniform(-0.01, 0.01)))

                # Surge Event Logic (Random spike)
                if random.random() < 0.03: # 3% chance of surge
                    data['surge_detected'] = True
                    data['voltage'] = 250 + random.uniform(0, 50) # Huge spike
                    data['status'] = "CRITICAL: Power Surge Detected"
                else:
                    data['surge_detected'] = False
                    data['voltage'] = 220 + random.uniform(-5, 5) # Normal fluctuation

                    # Status based on Frequency deviations
                    if data['frequency'] < 49.5 or data['frequency'] > 50.5:
                        data['status'] = "DANGER: Frequency Instability"
                    elif data['load_mw'] > 480: # Assuming 500 max
                        data['status'] = "WARNING: High Load Demand"
                    else:
                        data['status'] = "Grid Optimal"

            # 4. General Energy (Household/Smart Meter)
            elif infra_type in ['energy', 'grid', 'power', 'electric']:
                # Voltage fluctuation (Target 220V)
                data['voltage'] = data['voltage'] + random.uniform(-1, 1)
                
                if data['voltage'] > 240:
                    data['status'] = "CRITICAL: Voltage Surge"
                    data['temperature'] += 1 # Overheating
                elif data['voltage'] < 200:
                    data['status'] = "WARNING: Brownout Detected"
                else:
                    data['status'] = "Grid Stable"
                    data['temperature'] = max(30, data['temperature'] - 0.5) # Cooling

        time.sleep(1) # Update every second

# Start simulation thread
thread = threading.Thread(target=update_sensors, daemon=True)
thread.start()

@app.route('/api/sensors/<infra_id>/<infra_type>', methods=['GET'])
def get_sensor_data(infra_id, infra_type):
    # Initialize if new infra
    infra_type_key = 'structural' # Default category mapping
    
    # Categorization Logic
    type_lower = infra_type.lower()
    
    if any(x in type_lower for x in ['powergrid', 'substation', 'transformer', 'high voltage']):
        infra_type_key = 'powergrid'
    elif any(x in type_lower for x in ['water', 'pipeline', 'sewage']):
        infra_type_key = 'water'
    elif any(x in type_lower for x in ['energy', 'grid', 'electric']):
        infra_type_key = 'energy'
    elif any(x in type_lower for x in ['road', 'bridge', 'building']):
        infra_type_key = 'structural'

    if infra_id not in sensor_states:
        # Initial States
        initial_data = {}
        if infra_type_key == 'structural':
            initial_data = {'vibration': 1.0, 'stability': 100.0, 'status': 'Stable'}
        elif infra_type_key == 'water':
            initial_data = {'pressure': 60.0, 'flow_rate': 450.0, 'status': 'Normal Flow'}
        elif infra_type_key == 'powergrid':
            initial_data = {
                'voltage': 220.0, 
                'frequency': 50.0, 
                'load_mw': 350.0, 
                'power_factor': 0.95,
                'surge_detected': False,
                'status': 'Grid Optimal'
            }
        elif infra_type_key == 'energy':
            initial_data = {'voltage': 220.0, 'temperature': 35.0, 'status': 'Grid Stable'}
        
        sensor_states[infra_id] = {'type': infra_type_key, 'data': initial_data}

    return jsonify({
        'success': True,
        'timestamp': time.time(),
        'sensor_type': sensor_states[infra_id]['type'],
        'data': sensor_states[infra_id]['data']
    })

if __name__ == '__main__':
    print("🚀 IoT Sensor Simulation Server running on port 5097...")
    app.run(port=5097)