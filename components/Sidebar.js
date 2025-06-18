import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Sidebar() {
  const router = useRouter();
    // routing menu (samakan routing dengan nama file)
  const menu = [
    { path: '/home', label: 'Home' },
    { path: '/report', label: 'Report' },
    { path: '/recognition', label: 'Live Stream'},
    { path: '/config', label: 'Config Camera'}
  ];

  return (
    <aside style={{
      width: '200px',
      background: '#f4f4f4',
      padding: '1rem',
      borderRight: '1px solid #ccc',
    }}>
      <h2>Menu</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {menu.map(item => (
          <li key={item.path} style={{ marginBottom: '1rem' }}>
            <Link href={item.path} legacyBehavior>
              <a style={{
                color: router.pathname === item.path ? 'blue' : 'black',
                fontWeight: router.pathname === item.path ? 'bold' : 'normal',
              }}>
                {item.label}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
