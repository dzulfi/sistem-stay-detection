// pages/recognition.js
import { useEffect, useState } from "react";
import LiveStream from "../components/LiveStream";

export default function RecognitionPage() {
    const [cameras, setCameras] = useState([]);

    useEffect(() => {
        async function fetchCameras() {
            try {
                const res = await fetch("http://localhost:5000/api/cameras");
                const data = await res.json();
                setCameras(data);
            } catch (error) {
                console.error("Failed to fetch cameras:", error);
            }
        }

        fetchCameras();

        // Opsional: refresh otomatis setiap 10 detik
        const interval = setInterval(fetchCameras, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Recognition</h1>
            <div className="flex flex-wrap -mx-2">
                {cameras.map((cam) => (
                    <LiveStream key={cam._id} camera={cam} />
                ))}
            </div>
        </div>
    );
}
