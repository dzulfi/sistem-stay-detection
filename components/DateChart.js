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

    useEffect(() => {
        const countByDate = {};
        logs.forEach(log => {
            const [date] = log.start_time.split(' ');
            const inRange = (!startDate || date >= startDate) && (!endDate || date <= endDate);
            if (inRange) {
                countByDate[date] = (countByDate[date] || 0) + 1;
            }
        });

        const chartData = Object.entries(countByDate)
            .map(([date, count]) => ({ date, count }))
            .sort((a,b) => new Date(a.date) - new Date(b.date));
        
        setData(chartData);
    }, [logs, startDate, endDate]);

    return (
        <div style={{ flex: 1, minWidth: '300px', height: 450 }}>
            <h3>Grafik per bulan</h3>
            <div style={{ marginBottom: '1rem' }}>
                <label>
                    Dari: <input type='date' value={startDate} onChange={e => setStartDate(e.target.value)} />
                </label>
                <label style={{ marginLeft: '1rem' }}>
                    Sampai: <input type='date' value={endDate} onChange={e => setEndDate(e.target.value)} />
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