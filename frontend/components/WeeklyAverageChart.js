import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

// fungsi bantu untuk konversi durasi "00:02:30" ke detik
function durationToSeconds(duration) {
    const [h, m, s] = duration.split(':').map(Number);
    return h * 3600 + m * 60 + s;
}

export default function WeeklyAverageChart({ logs }) {
    const [data, setData] = useState([]);

    useEffect(() => {
        const dayTotals = {
            Monday: [],
            Tuesday: [],
            Wednesday: [],
            Thursday: [],
            Friday: [],
            Saturday: [],
            Sunday: [],
        }

        logs.forEach(log => {
            const date = new Date(log.start_time);
            const day = date.toLocaleDateString('en-US', { weekday: 'long' });
            const duration = durationToSeconds(log.duration);
            if (dayTotals[day]) {
                dayTotals[day].push(duration);
            }
            // console.log(date)
            // console.log(day)
            // console.log(duration)
        });

        const averageByDay = Object.entries(dayTotals).map(([day, durations]) => {
            const total = durations.reduce((sum, dur) => sum + dur, 0);
            const avg = durations.length ? total / durations.length : 0;
            return {
                day,
                avg_minutes: (avg / 60).toFixed(2) // konversi ke menit
            }
        });

        setData(averageByDay);
    }, [logs]);

    return (
        <div style={{ flex: 1, minWidth: '300px', height: 450 }}>
            <h3>Rata-rata Durasi Perhari</h3>
            <ResponsiveContainer width="100%" height="90%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis label={{ value: 'Menit', angle: -90, position: 'insideLeft'}} />
                    <Bar dataKey="avg_minutes" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}