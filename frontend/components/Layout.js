import Sidebar from './Sidebar';

export default function Layout({ children }) {
    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <Sidebar />
            <main style={{ flex: 1, padding: '2rem', overflow: 'auto' }}>
                {children}
            </main>
        </div>
    )
}