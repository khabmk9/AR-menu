import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import {
  TrendingUp,
  MenuSquare,
  Eye,
  Plus,
  QrCode,
  Smartphone,
  Sparkles,
  ArrowUpRight,
  Settings,
  ChefHat,
} from 'lucide-react';

interface HostelProfile {
  name: string;
  slogan: string;
  logo: string | null;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

interface SavedMenu {
  id: string;
  name: string;
  items: string[];
  createdAt: string;
}

export default function DashboardHome() {
  const [hostelProfile, setHostelProfile] = useState<HostelProfile | null>(null);
  const [savedMenus, setSavedMenus] = useState<SavedMenu[]>([]);
  const [customItems, setCustomItems] = useState<MenuItem[]>([]);
  const [totalScans, setTotalScans] = useState(0);

  useEffect(() => {
    // Load hostel profile
    const profile = localStorage.getItem('hostel-profile');
    if (profile) {
      setHostelProfile(JSON.parse(profile));
    }

    // Load saved menus
    const menus = localStorage.getItem('ar-menus');
    if (menus) {
      setSavedMenus(JSON.parse(menus));
    }

    // Load custom items
    const items = localStorage.getItem('custom-menu-items');
    if (items) {
      setCustomItems(JSON.parse(items));
    }

    // Simulate some scans for demo
    setTotalScans(Math.floor(Math.random() * 100) + 10);
  }, []);

  const displayName = hostelProfile?.name || 'Hostel Warden';

  const stats = [
    {
      label: 'Menu Views',
      value: totalScans.toString(),
      change: 'This month',
      icon: Eye,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-500/10 to-emerald-500/10',
    },
    {
      label: 'Saved Menus',
      value: savedMenus.length.toString(),
      change: 'Active',
      icon: MenuSquare,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-500/10 to-cyan-500/10',
    },
    {
      label: 'Custom Dishes',
      value: customItems.length.toString(),
      change: 'Your items',
      icon: ChefHat,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-500/10 to-pink-500/10',
    },
    {
      label: 'QR Codes',
      value: savedMenus.length.toString(),
      change: 'Generated',
      icon: QrCode,
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-500/10 to-red-500/10',
    },
  ];

  const quickActions = [
    {
      title: 'Menu Builder',
      description: 'Apna digital menu banayein',
      icon: Sparkles,
      to: '/dashboard/ar-builder',
      featured: true,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Naya Dish Add Karein',
      description: 'Custom khaana add karein',
      icon: Plus,
      to: '/dashboard/ar-builder',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'QR Code Banayein',
      description: 'Menu ka QR generate karein',
      icon: QrCode,
      to: '/dashboard/ar-builder',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Hostel Setup',
      description: 'Hostel info update karein',
      icon: Settings,
      to: '/setup',
      gradient: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950/30 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {hostelProfile?.logo ? (
              <img
                src={hostelProfile.logo}
                alt="Hostel Logo"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-green-500/30"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">🇵🇰</span>
              </div>
            )}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                {displayName} 👋
              </h1>
              <p className="text-lg text-green-300">
                {hostelProfile?.slogan || 'Ghar Jaisa Khana'}
              </p>
            </div>
          </div>

          {!hostelProfile && (
            <Link
              to="/setup"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-xl text-green-300 hover:bg-green-500/30 transition-all"
            >
              <Settings className="w-4 h-4" />
              Hostel Setup Karein →
            </Link>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="group">
                <div className={`bg-gradient-to-br ${stat.bgColor} backdrop-blur-xl border border-green-500/20 rounded-2xl p-4 md:p-6 h-full transition-all group-hover:border-green-500/40 hover:-translate-y-1`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-2 md:p-3 bg-gradient-to-br ${stat.color} rounded-xl`}>
                      <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div className="flex items-center gap-1 text-green-300 text-xs font-medium">
                      {stat.change}
                    </div>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-green-300 text-sm">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-green-400" />
            Jaldi Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={index} to={action.to} className="block group">
                  <div className={`relative bg-slate-900/50 backdrop-blur-xl border border-green-500/20 rounded-2xl p-6 h-full transition-all group-hover:border-green-500/40 group-hover:-translate-y-1 overflow-hidden ${action.featured ? 'ring-2 ring-green-500/50' : ''
                    }`}>
                    {action.featured && (
                      <div className="absolute top-3 right-3">
                        <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full">
                          START
                        </span>
                      </div>
                    )}

                    <div className={`inline-flex p-3 bg-gradient-to-br ${action.gradient} rounded-xl mb-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                      {action.title}
                      <ArrowUpRight className="w-5 h-5 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>

                    <p className="text-green-300 text-sm">{action.description}</p>

                    <div className={`absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br ${action.gradient} opacity-5 blur-3xl rounded-full group-hover:opacity-10 transition-opacity`} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Saved Menus */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-green-400" />
              Aapke Menus
            </h2>
            <Link to="/dashboard/ar-builder" className="text-green-400 hover:text-green-300 text-sm font-medium">
              Naya Menu →
            </Link>
          </div>

          {savedMenus.length === 0 ? (
            <div className="bg-slate-900/50 backdrop-blur-xl border border-green-500/20 rounded-2xl p-12 text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-lg font-semibold text-white mb-2">Koi menu nahi banaya</p>
              <p className="text-green-300 text-sm mb-6">Pehla menu banayein aur QR code share karein!</p>
              <Link
                to="/dashboard/ar-builder"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all"
              >
                <Plus className="w-5 h-5" />
                Pehla Menu Banayein
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedMenus.map((menu) => (
                <Link key={menu.id} to={`/menu/${menu.id}`} className="block group">
                  <div className="bg-slate-900/50 backdrop-blur-xl border border-green-500/20 rounded-2xl p-6 hover:border-green-500/40 transition-all group-hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-white">{menu.name}</h3>
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                    </div>
                    <p className="text-green-300 text-sm">{menu.items.length} items</p>
                    <p className="text-green-400/50 text-xs mt-2">
                      {new Date(menu.createdAt).toLocaleDateString('en-PK')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
