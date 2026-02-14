import { Link } from 'react-router';
import type { Route } from './+types/qr-codes';
import { requireAuth } from '~/lib/supabase.server';
import { getRestaurant } from '~/lib/restaurant.server';
import { getMenus } from '~/lib/menu.server';
import { QrCode, Download, ExternalLink, Sparkles, Plus } from 'lucide-react';

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireAuth(request);
  const restaurant = await getRestaurant(request, user.id);

  if (!restaurant) return { menus: [] };

  const menus = await getMenus(request, restaurant.id);
  return { menus: menus.filter((m: { is_active: boolean }) => m.is_active) };
}

export default function QRCodes({ loaderData }: Route.ComponentProps) {
  const { menus } = loaderData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-2">
            QR Codes
          </h1>
          <p className="text-purple-300">Generate and manage QR codes for your active menus</p>
        </div>

        {menus.length === 0 ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center max-w-md">
              <div className="w-24 h-24 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <QrCode className="w-12 h-12 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">No active menus</h2>
              <p className="text-purple-300 mb-6">Create and activate a menu first to generate QR codes</p>
              <Link
                to="/dashboard/menus"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                <Plus className="w-5 h-5" />
                Create a Menu
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menus.map((menu: { id: string; name: string; menu_items: unknown[] }) => (
              <div key={menu.id} className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-all">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-1">{menu.name}</h3>
                  <p className="text-purple-300 text-sm">{menu.menu_items?.length || 0} items</p>
                </div>

                {/* QR Code placeholder — in production this would use a real QR library */}
                <div className="bg-white p-6 rounded-2xl mb-6">
                  <div className="w-full aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex flex-col items-center justify-center">
                    <QrCode className="w-24 h-24 text-slate-800 mb-2" />
                    <p className="text-slate-500 text-xs">Scan to view menu</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-white font-medium transition-all flex items-center justify-center gap-2">
                    <Download size={18} />
                    Download
                  </button>
                  <button className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl text-white font-medium transition-all flex items-center justify-center gap-2">
                    <ExternalLink size={18} />
                    Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
