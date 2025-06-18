// pages/config.js
import { useEffect, useState } from "react";

export default function ConfigPage() {
    const [configs, setConfigs] = useState([]);
    const [form, setForm] = useState({
        name_camera: '',
        username: '',
        password: '',
        ip_address: '',
        port: '',
        rtsp_url: '', // Tambahkan field RTSP URL
    });
    const [editId, setEditId] = useState(null);
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        fetchConfigs();
    }, []);

    const fetchConfigs = async () => {
        const res = await fetch('/api/config');
        if (res.ok) {
            setConfigs(await res.json());
        } else {
            console.error('Failed to fetch camera configurations');
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/config', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(form),
        });
        if (res.ok) {
            setForm({
                name_camera: '',
                username: '',
                password: '',
                ip_address: '',
                port: '',
                rtsp_url: '',
            });
            fetchConfigs();
        } else {
            const errorData = await res.json();
            alert(`Error adding camera: ${errorData.message}`);
        }
    }

    const handlerDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this camera?')) return;
        const res = await fetch(`/api/config?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
            fetchConfigs();
        } else {
            const errorData = await res.json();
            alert(`Error deleting camera: ${errorData.message}`);
        }
    }

    const startEdit = (cfg) => {
        setEditId(cfg._id);
        setEditForm({ ...cfg });
    }

    const cancelEdit = () => {
        setEditId(null);
        setEditForm({});
    }

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    }

    const saveEdit = async () => {
        const res = await fetch(`/api/config`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editForm)
        });4101
        if (res.ok) {
            cancelEdit();
            fetchConfigs();
        } else {
            const errorData = await res.json();
            alert(`Error updating camera: ${errorData.message}`);
        }
    }

    return (
        <div>
            <h1>Camera Configuration</h1>
            <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input placeholder="Camera Name" type="text" value={form.name_camera} onChange={e => setForm({ ...form, name_camera: e.target.value })} required />
                <input placeholder="Username" type="text" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
                <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                <input placeholder="IP Address" type="text" value={form.ip_address} onChange={e => setForm({ ...form, ip_address: e.target.value })} required />
                <input placeholder="Port (e.g., 80, 554)" type="text" value={form.port} onChange={e => setForm({ ...form, port: e.target.value })} required />
                <input placeholder="RTSP URL (Optional, if not using ONVIF)" type="text" value={form.rtsp_url} onChange={e => setForm({ ...form, rtsp_url: e.target.value })} />
                <button type="submit" style={{ gridColumn: 'span 2' }}>Add Camera</button>
            </form>

            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>Name Camera</th>
                        <th>Username</th>
                        <th>Password</th>
                        <th>IP Address</th>
                        <th>Port</th>
                        <th>RTSP URL</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {configs.map(cfg => (
                        <tr key={cfg._id}>
                            {editId === cfg._id ? (
                                <>
                                    <td><input name="name_camera" value={editForm.name_camera} onChange={handleEditChange} /></td>
                                    <td><input name="username" value={editForm.username} onChange={handleEditChange} /></td>
                                    <td><input name="password" type="password" value={editForm.password} onChange={handleEditChange} /></td>
                                    <td><input name="ip_address" value={editForm.ip_address} onChange={handleEditChange} /></td>
                                    <td><input name="port" value={editForm.port} onChange={handleEditChange} /></td>
                                    <td><input name="rtsp_url" value={editForm.rtsp_url || ''} onChange={handleEditChange} /></td>
                                    <td>
                                        <select name="status" value={editForm.status} onChange={handleEditChange}>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                            <option value="error">Error</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button onClick={saveEdit}>Save</button>
                                        <button onClick={cancelEdit}>Cancel</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{cfg.name_camera}</td>
                                    <td>{cfg.username}</td>
                                    <td>{cfg.password ? '********' : '-'}</td>
                                    <td>{cfg.ip_address}</td>
                                    <td>{cfg.port}</td>
                                    <td>{cfg.rtsp_url || 'Generated by ONVIF'}</td>
                                    <td>{cfg.status}</td>
                                    <td>
                                        <button onClick={() => startEdit(cfg)}>Edit</button>
                                        <button onClick={() => handlerDelete(cfg._id)}>Delete</button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}