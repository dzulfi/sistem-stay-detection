// pages/recognition.js
import { useEffect, useState } from "react";
import LiveStream from "../components/LiveStream";

export default function RecognitionPage() {
    const [cameras, setCameras] = useState([]);

    useEffect(() => {
        async function fetchCameras() {
            try {
                const res = await fetch("http://localhost:5000/api/cameras");
                if (res.ok){
                    const data = await res.json();
                    setCameras(data);
                } else {
                    console.log("gagal akses kamera");
                    console.warn("Response gagal. Mungkin backend tidak aktif");
                }
            } catch (error) {
                window.alert("Silahkan hidupkan python dahulu");
                console.warn("Tidak bisa terhubung ke backend. Pastikan server pyhon aktif");
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap4">
                {cameras.map((cam) => (
                    <LiveStream key={cam._id} camera={cam} />
                ))}
            </div>
        </div>
    );
}
