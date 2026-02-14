import { Outlet, Link, useLocation, Form } from 'react-router';
import type { Route } from './+types/app-layout';
import {
  LayoutDashboard,
  QrCode,
  Settings,
  Sparkles,
  Smartphone,
  Menu as MenuIcon,
  X,
  Home,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import styles from './app-layout.module.css';

interface HostelProfile {
  name: string;
  slogan: string;
  logo: string | null;
}

export async function loader({ request }: Route.LoaderArgs) {
  // Return empty - we'll use client-side localStorage
  return {};
}

export default function AppLayout({ loaderData }: Route.ComponentProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hostelProfile, setHostelProfile] = useState<HostelProfile | null>(null);

  useEffect(() => {
    const profile = localStorage.getItem('hostel-profile');
    if (profile) {
      setHostelProfile(JSON.parse(profile));
    }
  }, []);

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/dashboard/ar-builder', label: 'Menu Builder', icon: Smartphone, featured: true },
    { to: '/dashboard/qr-codes', label: 'QR Codes', icon: QrCode },
    { to: '/setup', label: 'Hostel Setup', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className={styles.appLayout}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>🇵🇰</div>
          <div className={styles.logoText}>Hostel Menu</div>
          <button className={styles.closeSidebar} onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`${styles.navItem} ${isActive(item.to) ? styles.active : ''} ${item.featured ? styles.featured : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className={styles.navIcon} />
                {item.label}
                {item.featured && <span className={styles.newBadge}>Go</span>}
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          {hostelProfile && (
            <div className={styles.restaurantName}>
              {hostelProfile.name}
            </div>
          )}
          <div className={styles.userCard}>
            <div className={styles.userAvatar} style={{ background: 'linear-gradient(135deg, #22c55e, #10b981)' }}>
              {hostelProfile?.logo ? (
                <img src={hostelProfile.logo} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                hostelProfile?.name?.[0]?.toUpperCase() || '🏨'
              )}
            </div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{hostelProfile?.name || 'Hostel Warden'}</div>
              <div className={styles.userEmail}>{hostelProfile?.slogan || 'Ghar Jaisa Khana'}</div>
            </div>
          </div>
          <Link
            to="/"
            style={{ marginTop: 'var(--space-3)', display: 'block' }}
            className={styles.logoutButton}
          >
            <Home size={16} style={{ marginRight: '8px', display: 'inline' }} />
            Home Page
          </Link>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.menuToggle} onClick={() => setSidebarOpen(true)}>
              <MenuIcon size={22} />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-green-400 font-bold">🇵🇰</span>
              <span className="text-white font-semibold hidden sm:inline">Hostel Menu Pakistan</span>
            </div>
          </div>

          <div className={styles.headerRight}>
            <Link
              to="/setup"
              className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 hover:bg-green-500/30 transition-all text-sm font-medium hidden sm:flex items-center gap-2"
            >
              <Settings size={16} />
              Setup
            </Link>
            <Link
              to="/dashboard/ar-builder"
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white font-medium text-sm flex items-center gap-2"
            >
              <Sparkles size={16} />
              <span className="hidden sm:inline">Menu Builder</span>
            </Link>
          </div>
        </header>

        <div className={styles.contentArea}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
