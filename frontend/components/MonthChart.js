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

    useEffect(() => {
        const countByMonth = {};
        logs.forEach(log => {
            const [date] = log.start_time.split(' ');
            const [year, month] = date.split('-');
            const label = `${year}-${month}`;

            if (!selectedYear || selectedYear === year) {
                countByMonth[label] = (countByMonth[label] || 0) + 1;
            }
        });

        const chartData = Object.entries(countByMonth)
            .map((month, count) => ({ month, count }))
            .sort((a, b) => new Date(a.month + "-01") - new Date(b.month + "=01"));

            setData(chartData);
    }, [logs, selectedYear]);

    const years = Array.from(new Set(logs.map(log => log.start_time.split('-')[0])));

    return (
        <div style={{ flex: 1, minWidth: '300px', height: 450 }}>
        <h3>Aktivitas per Bulan</h3>
        <div style={{ marginBottom: '1rem' }}>
            <label>
            Tahun:{" "}
            <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
                <option value="">Semua</option>
                {years.map(year => (
                <option key={year} value={year}>{year}</option>
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
