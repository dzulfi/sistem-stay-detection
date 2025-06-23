import { use, useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';


export default function DateChart({ logs }) {
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [cameraId, setCameraId] = useState('');
    const [cameraList, setCameraList] = useState([]);

    useEffect(() => {
        async function fetchCameras() {
            try {
                const res = await fetch('http://localhost:5000/api/cameras');
                if (res.ok) {
                    const cams = await res.json();
                    setCameraList(cams);
                } else {
                    console.log('gagal akses camera');
                    console.warn('Response gagal. Mungkin backend tidak aktif')
                }
            } catch (error) {
                window.alert('Silahkan hidupkan python dulu');
                console.warn('Tidak bisa terhubung ke backend. Pastikan server python aktif');
            }
        }
        fetchCameras();
    }, []);

    useEffect(() => {
        const countByDate = {};
        logs.forEach(log => {
            const [date] = log.start_time.split(' ');
            const inRange = (!startDate || date >= startDate) && (!endDate || date <= endDate);
            const matchesCamera = !cameraId ||log.cameraId ||log.camera_id === cameraId;

            if (inRange && matchesCamera) {
                countByDate[date] = (countByDate[date] || 0) + 1;
            }
        });

        const chartData = Object.entries(countByDate)
            .map(([date, count]) => ({ date, count }))
            .sort((a,b) => new Date(a.date) - new Date(b.date));
        
        setData(chartData);
    }, [logs, startDate, endDate, cameraId]);

    return (
        <div style={{ flex: 1, minWidth: '300px', height: 450 }}>
            <h3>Grafik per hari</h3>
            <div style={{ marginBottom: '1rem' }}>
                <label>
                    Dari: <input type='date' value={startDate} onChange={e => setStartDate(e.target.value)} />
                </label>
                <label style={{ marginLeft: '1rem' }}>
                    Sampai: <input type='date' value={endDate} onChange={e => setEndDate(e.target.value)} />
                </label>
                <label style={{ marginLeft: '1rem' }}>
                    Kamera:
                    <select value={cameraId} onChange={e => setCameraId(e.target.value)}>
                        <option value=''>Semua</option>
                        {cameraList.map(cam => (
                            <option key={cam._id} value={cam._id}> {cam.name_camera} </option>
                        ))}
                    </select>
                </label>
            </div>
            <ResponsiveContainer width="100%" height="80%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}