import React, { useEffect, useRef, useState } from 'react';

const VirtualSensorGraph = ({ color = '#00D1FF', isActive, label = "Vibration Sensor", onReadingChange }) => {
    const canvasRef = useRef(null);
    const [mouseVelocity, setMouseVelocity] = useState(0);
    const lastMousePos = useRef({ x: 0, y: 0 });
    const lastTime = useRef(Date.now());
    const velocityRef = useRef(0); // Use ref for animation loop to avoid dependency lag

    // Mouse Physics
    const handleMouseMove = (e) => {
        if (!isActive) return;

        const now = Date.now();
        const dt = now - lastTime.current;
        if (dt > 16) { // ~60fps cap for physics calculation
            const dx = e.clientX - lastMousePos.current.x;
            const dy = e.clientY - lastMousePos.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const speed = dist / dt; // pixels per ms

            // Normalize speed to 0-10 range roughly
            // High speed mouse movement should cause high amplitude
            const intensity = Math.min(speed * 30, 50);
            velocityRef.current = intensity;
            setMouseVelocity(intensity);

            lastMousePos.current = { x: e.clientX, y: e.clientY };
            lastTime.current = now;
        }
    };

    // Auto-decay the velocity (friction) + Report to Parent
    useEffect(() => {
        const interval = setInterval(() => {
            // Decay
            velocityRef.current = Math.max(velocityRef.current * 0.9, 2); // Decay to a base noise level of 2

            // Calculate Stability based on chaos (velocity)
            // Velocity 0-2 (Idle) -> 100% Stability
            // Velocity 50 (Max) -> ~25% Stability
            const chaosLevel = velocityRef.current;
            const calculatedStability = Math.max(100 - (chaosLevel * 1.5), 0);

            if (onReadingChange) {
                onReadingChange(calculatedStability);
            }

        }, 50);
        return () => clearInterval(interval);
    }, [onReadingChange]);

    // Draw Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let offset = 0;

        // Initialize Data points
        // We use a fixed buffer
        const bufferSize = 200;
        const data = new Array(bufferSize).fill(0);

        const render = () => {
            offset -= 3; // Scroll speed

            // Generate next signal point
            // Signal = Sine Wave (Base Frequency) + Noise + Interaction (Velocity)
            const time = Date.now() / 100;
            const baseFreq = Math.sin(time) * 5;
            const noise = (Math.random() - 0.5) * 5;
            const interaction = (Math.random() - 0.5) * velocityRef.current * 3; // Velocity amplifies noise

            const nextPoint = baseFreq + noise + interaction;

            // Shift Buffer
            data.push(nextPoint);
            data.shift();

            // Clear Canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw Grid (Retro Scope Look)
            ctx.strokeStyle = '#ffffff08';
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (let x = 0; x < canvas.width; x += 20) { ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); }
            for (let y = 0; y < canvas.height; y += 20) { ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); }
            ctx.stroke();

            // Draw Signal
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;

            const centerY = canvas.height / 2;
            ctx.moveTo(0, centerY + data[0]);

            for (let i = 1; i < data.length; i++) {
                const x = (i / (data.length - 1)) * canvas.width;
                const y = centerY + data[i];
                ctx.lineTo(x, y);
            }

            ctx.stroke();

            // Glow effect
            ctx.shadowBlur = 15;
            ctx.shadowColor = color;
            ctx.stroke();
            ctx.shadowBlur = 0; // Reset

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => cancelAnimationFrame(animationFrameId);
    }, [color]);

    return (
        <div
            className="w-full h-40 bg-black/40 rounded border border-white/10 relative overflow-hidden cursor-crosshair group select-none transition-all hover:border-white/30"
            onMouseMove={handleMouseMove}
        >
            <canvas ref={canvasRef} width={400} height={160} className="w-full h-full block" />

            {/* UI Overlays */}
            <div className="absolute top-2 left-2 flex flex-col pointer-events-none">
                <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">{label}</span>
                <span className="text-xs font-bold font-mono" style={{ color: color }}>
                    {velocityRef.current > 10 ? 'DETECTING ACTIVITY' : 'MONITORING...'}
                </span>
            </div>

            <div className="absolute top-2 right-2 text-[10px] text-gray-600 pointer-events-none group-hover:text-white transition-colors font-mono border border-white/10 px-1 rounded bg-black/50">
                VIRTUAL PROBE ACTIVE
            </div>

            {/* Scanline Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 pointer-events-none bg-[length:100%_2px]"></div>
        </div>
    );
};

export default VirtualSensorGraph;
