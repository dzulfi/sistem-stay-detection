import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function MonthChart({ logs }) {
    const [data, setData] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedCamera, setSelectedCamera] = useState('');
    const [cameraOptions, setCameraOptions] = useState([]);

    const cameraMatch = !selectedCamera || selectedCamera === log.camera_id;

    useEffect(() => {
        async function fetchCameras() {
            try {
                const res = await fetch('http://localhost:5000/api/cameras');
                if (res.ok) {
                    const cams = await res.json();
                    setCameraOptions(cams)
                } else {
                    console.log('gagal akses camera');
                    console.warn('Response gagal. Mungkin backend tidak aktif')
                }
            } catch (error) {
                window.alert('Silahkan hidupkan python dahulu');
                console.warn('tidak bisa terhubung ke backend. pastikan server python aktif');
            }
        }
        fetchCameras();
    }, []);

    useEffect(() => {
        const countByMonth = {};
        const months = Array.from({ length: 12 }, (_, i) => `${i + 1}`.padStart(2, '0'))

        logs.forEach(log => {
            const [date] = log.start_time.split(' ');
            const [year, month] = date.split('-');
            // const label = `${year}-${month}`;
            const camId = log.camera_id;

            const label = `${year}-${month}`;
            const yearMatch = !selectedYear || selectedYear === year;
            const cameraMatch = !selectedCamera ||selectedCamera === camId;

            if (yearMatch && cameraMatch) {
                countByMonth[label] = (countByMonth[label] || 0) + 1;
            }
        });

        // const chartData = Object.entries(countByMonth)
        //     .map((month, count) => ({ month, count }))
        //     .sort((a, b) => new Date(a.month + "-01") - new Date(b.month + "=01"));
        const monthFull = months.map(month => {
            const key = `${selectedYear || new Date().getFullYear()}-${month}`;
            return {
                month: key,
                count: countByMonth[key] || 0
            }
        })
            setData(monthFull);
    }, [logs, selectedYear, selectedCamera]);

    const years = Array.from(new Set(logs.map(log => log.start_time.split('-')[0])));

    return (
        <div style={{ flex: 1, minWidth: '300px', height: 450 }}>
        <h3>Aktivitas per Bulan</h3>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <label>
            Tahun:{" "}
            <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
                <option value="">Semua</option>
                {years.map(year => (
                <option key={year} value={year}>{year}</option>
                ))}
            </select>
            </label>
            <label>
                Kamera:{" "}
                <select value={selectedCamera} onChange={e => setSelectedCamera(e.target.value)}>
                    <option value="">Semua</option>
                    {cameraOptions.map(cam => (
                        <option key={cam._id} value={cam._id}> {cam.name_camera} </option>
                    ))}
                </select>
            </label>
        </div>
        <ResponsiveContainer width="100%" height="80%">
            <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
        </ResponsiveContainer>
        </div>
    );
}
