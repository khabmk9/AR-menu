import type { Route } from './+types/analytics';
import { requireAuth } from '~/lib/supabase.server';
import { getRestaurant } from '~/lib/restaurant.server';
import { getMenuAnalytics } from '~/lib/menu.server';
import { BarChart3, Eye, Smartphone, Monitor, Tablet, TrendingUp } from 'lucide-react';

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireAuth(request);
  const restaurant = await getRestaurant(request, user.id);

  if (!restaurant) return { totalScans: 0, sessions: [], deviceBreakdown: { mobile: 0, tablet: 0, desktop: 0 } };

  const analytics = await getMenuAnalytics(request, restaurant.id);

  const deviceBreakdown = analytics.sessions.reduce(
    (acc: Record<string, number>, s: { device_type: string | null }) => {
      const type = s.device_type || 'unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    },
    { mobile: 0, tablet: 0, desktop: 0 } as Record<string, number>
  );

  return { totalScans: analytics.totalScans, sessions: analytics.sessions, deviceBreakdown };
}

export default function Analytics({ loaderData }: Route.ComponentProps) {
  const { totalScans, sessions, deviceBreakdown } = loaderData;

  const deviceIcons: Record<string, typeof Smartphone> = {
    mobile: Smartphone,
    tablet: Tablet,
    desktop: Monitor,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-2">
            Analytics
          </h1>
          <p className="text-purple-300">Track how customers interact with your menus</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <span className="text-purple-300">Total Scans</span>
            </div>
            <div className="text-4xl font-bold text-white">{totalScans.toLocaleString()}</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-purple-300">Recent (last 20)</span>
            </div>
            <div className="text-4xl font-bold text-white">{sessions.length}</div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <span className="text-purple-300">Top Device</span>
            </div>
            <div className="text-4xl font-bold text-white capitalize">
              {Object.entries(deviceBreakdown).sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0] || '—'}
            </div>
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            Device Breakdown
          </h2>
          {totalScans === 0 ? (
            <p className="text-purple-300 text-center py-8">No scan data yet. Share your QR codes to start tracking!</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(deviceBreakdown).map(([device, count]) => {
                const Icon = deviceIcons[device] || Monitor;
                const percentage = totalScans > 0 ? Math.round(((count as number) / sessions.length) * 100) : 0;
                return (
                  <div key={device}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-purple-400" />
                        <span className="text-white capitalize font-medium">{device}</span>
                      </div>
                      <span className="text-purple-300 font-semibold">{count as number} ({percentage}%)</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Sessions */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Recent Sessions</h2>
          {sessions.length === 0 ? (
            <p className="text-purple-300 text-center py-8">No sessions recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {sessions.map((session: { id: string; device_type: string | null; created_at: string; session_duration: number | null }) => {
                const Icon = deviceIcons[session.device_type || 'desktop'] || Monitor;
                return (
                  <div key={session.id} className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-xl">
                    <div className="p-3 bg-purple-500/10 rounded-xl">
                      <Icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white capitalize">{session.device_type || 'Unknown'} device</div>
                      <div className="text-sm text-purple-300/70">{new Date(session.created_at).toLocaleString()}</div>
                    </div>
                    {session.session_duration && (
                      <div className="text-purple-300 text-sm">{Math.round(session.session_duration / 60)}m</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
