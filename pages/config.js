import { useEffect, useState } from "react";

export default function ConfigPage() {
    const [configs, setConfigs] = useState([]);
    const [form, setForm] = useState({ username: '', password: '', ip: '', port: '' });

    useEffect(() => {
        fetch('/api/config')
            .then(res => res.json())
            .then(setConfigs);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch('/api/config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });
        setForm({ username: '', password: '', ip: '', port: '' });
        const res = await fetch('/api/config');
        setConfigs(await res.json());
    };

    const handleDelete = async (id) => {
        await fetch(`/api/config?id=${id}`, { method: 'DELETE' });
        const res = await fetch('/api/config');
        setConfigs(await res.json());
    };

    return (
        <div>
            <h1>Camera Configuration</h1>
            <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
                <input placeholder="Username" value={form.username} onChange={e => setForm({...form, username: e.target.value})} />
                <input placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                <input placeholder="IP Address" value={form.ip} onChange={e => setForm({...form, ip: e.target.value})} />
                <input placeholder="Port" value={form.port} onChange={e => setForm({...form, port: e.target.value})} />
                <button type="submit">Simpan</button>
            </form>

            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Password</th>
                        <th>IP</th>
                        <th>Port</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {configs.map(cfg => (
                        <tr key={cfg._id}>
                            <td>{cfg.username}</td>
                            <td>{cfg.password}</td>
                            <td>{cfg.ip}</td>
                            <td>{cfg.port}</td>
                            <td><button onClick={() => handleDelete(cfg._id)}>Hapus</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
