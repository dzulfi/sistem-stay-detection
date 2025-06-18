import { useEffect, useState } from "react";
import DateChart from "../components/DateChart";
import MonthChart from "../components/MonthChart";

export default function Dashboard() {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        fetch('/api/logs')
            .then(res => res.json())
            .then(setLogs);
    }, []);

    return (
        <div style={{ padding: '2rem '}}>
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Dashboard Aktivitas</h1>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <DateChart logs={logs} />
                <MonthChart logs={logs} />
            </div>
        </div>
    )
}
