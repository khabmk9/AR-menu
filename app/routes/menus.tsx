import { Link, Form, useNavigation, redirect } from 'react-router';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import type { Route } from './+types/menus';
import { requireAuth } from '~/lib/supabase.server';
import { getRestaurant } from '~/lib/restaurant.server';
import { getMenus, createMenu, deleteMenu, duplicateMenu, updateMenu } from '~/lib/menu.server';
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Copy, 
  QrCode,
  Search,
  Grid3x3,
  List,
  Sparkles,
  Power,
  PowerOff,
} from 'lucide-react';

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireAuth(request);
  const restaurant = await getRestaurant(request, user.id);

  if (!restaurant) {
    return { menus: [], restaurantId: null };
  }

  const menus = await getMenus(request, restaurant.id);
  return { menus, restaurantId: restaurant.id };
}

export async function action({ request }: Route.ActionArgs) {
  const user = await requireAuth(request);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "create") {
    const restaurant = await getRestaurant(request, user.id);
    if (!restaurant) return { error: "No restaurant found" };

    const name = formData.get("name") as string || "New Menu";
    const { error, headers } = await createMenu(request, restaurant.id, name);
    if (error) return { error };
    return redirect("/dashboard/menus", { headers });
  }

  if (intent === "delete") {
    const menuId = formData.get("menuId") as string;
    const { error, headers } = await deleteMenu(request, menuId);
    if (error) return { error };
    return redirect("/dashboard/menus", { headers });
  }

  if (intent === "duplicate") {
    const menuId = formData.get("menuId") as string;
    const { error, headers } = await duplicateMenu(request, menuId);
    if (error) return { error };
    return redirect("/dashboard/menus", { headers });
  }

  if (intent === "toggle") {
    const menuId = formData.get("menuId") as string;
    const currentStatus = formData.get("isActive") === "true";
    const { error, headers } = await updateMenu(request, menuId, { is_active: !currentStatus });
    if (error) return { error };
    return redirect("/dashboard/menus", { headers });
  }

  return null;
}

export default function Menus({ loaderData }: Route.ComponentProps) {
  const { menus, restaurantId } = loaderData;
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const filteredMenus = menus.filter((menu: { name: string }) =>
    menu.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!restaurantId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-white mb-4">Restaurant not found</p>
          <p className="text-purple-300">Please contact support if this issue persists.</p>
        </div>
      </div>
    );
  }

  if (menus.length === 0) {
    return (
      <>
        <Toaster position="top-right" />
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-2">
                  Your Menus
                </h1>
                <p className="text-purple-300">Create and manage your digital menus</p>
              </div>
            </div>

            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center max-w-md">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="text-6xl">📋</div>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">No menus yet</h2>
                <p className="text-lg text-purple-300 mb-8">
                  Create your first menu to get started with digital dining
                </p>
                <Form method="post">
                  <input type="hidden" name="intent" value="create" />
                  <input type="hidden" name="name" value="My First Menu" />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/50 flex items-center gap-2 mx-auto disabled:opacity-50"
                  >
                    <Sparkles className="w-5 h-5" />
                    {isSubmitting ? 'Creating...' : 'Create Your First Menu'}
                  </button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-2">
                Your Menus
              </h1>
              <p className="text-purple-300">Manage your {menus.length} digital menu{menus.length !== 1 ? 's' : ''}</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/50 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Menu
            </button>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
              <input
                type="text"
                placeholder="Search menus..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div className="flex items-center gap-2 bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'text-purple-300 hover:text-white'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'text-purple-300 hover:text-white'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Menus Grid */}
          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredMenus.map((menu: { id: string; name: string; is_active: boolean; menu_items: unknown[]; updated_at: string }) => {
                  const totalItems = menu.menu_items?.length || 0;
                  return (
                    <div key={menu.id} className="group">
                      <div className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 h-full hover:border-purple-500/40 transition-all hover:-translate-y-1">
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                            <div className="text-3xl">🍽️</div>
                          </div>
                          <Form method="post">
                            <input type="hidden" name="intent" value="toggle" />
                            <input type="hidden" name="menuId" value={menu.id} />
                            <input type="hidden" name="isActive" value={String(menu.is_active)} />
                            <button
                              type="submit"
                              className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors"
                              title={menu.is_active ? 'Deactivate' : 'Activate'}
                            >
                              {menu.is_active ? (
                                <Power className="w-4 h-4 text-green-400" />
                              ) : (
                                <PowerOff className="w-4 h-4 text-purple-400" />
                              )}
                            </button>
                          </Form>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-2 truncate">{menu.name}</h3>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="bg-slate-800/30 rounded-lg p-3">
                            <div className="text-purple-300 text-xs mb-1">Items</div>
                            <div className="text-white font-bold text-lg">{totalItems}</div>
                          </div>
                          <div className="bg-slate-800/30 rounded-lg p-3">
                            <div className="text-purple-300 text-xs mb-1">Status</div>
                            <div className={`font-bold text-lg ${menu.is_active ? 'text-green-400' : 'text-purple-400'}`}>
                              {menu.is_active ? 'Active' : 'Draft'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-purple-500/20">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${menu.is_active ? 'bg-green-400' : 'bg-purple-400'}`} />
                            <span className="text-sm text-purple-300">
                              {menu.is_active ? 'Live' : 'Draft'}
                            </span>
                          </div>
                          <div className="text-xs text-purple-400">
                            {new Date(menu.updated_at).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-purple-500/20">
                          <Link to="/dashboard/ar-builder" className="flex-1">
                            <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-all">
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                          </Link>
                          <Form method="post">
                            <input type="hidden" name="intent" value="duplicate" />
                            <input type="hidden" name="menuId" value={menu.id} />
                            <button type="submit" className="p-2 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors" title="Duplicate">
                              <Copy className="w-4 h-4 text-purple-300" />
                            </button>
                          </Form>
                          <Form method="post" onSubmit={(e) => { if (!confirm('Delete this menu? This cannot be undone.')) e.preventDefault(); }}>
                            <input type="hidden" name="intent" value="delete" />
                            <input type="hidden" name="menuId" value={menu.id} />
                            <button type="submit" className="p-2 bg-slate-800/50 hover:bg-red-500/20 rounded-lg transition-colors" title="Delete">
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </Form>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {filteredMenus.map((menu: { id: string; name: string; is_active: boolean; menu_items: unknown[]; updated_at: string }) => {
                  const totalItems = menu.menu_items?.length || 0;
                  return (
                    <div key={menu.id} className="group">
                      <div className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-all">
                        <div className="flex items-center gap-6">
                          <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                            <div className="text-4xl">🍽️</div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl md:text-2xl font-bold text-white truncate">{menu.name}</h3>
                              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                menu.is_active 
                                  ? 'bg-green-500/20 text-green-300' 
                                  : 'bg-purple-500/20 text-purple-300'
                              }`}>
                                {menu.is_active ? 'Active' : 'Draft'}
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-purple-300 flex-wrap">
                              <span>{totalItems} items</span>
                              <span>•</span>
                              <span className="text-purple-400">
                                Updated {new Date(menu.updated_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Link to="/dashboard/ar-builder">
                              <button className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-lg flex items-center gap-2 transition-all">
                                <Edit className="w-4 h-4" />
                                Edit
                              </button>
                            </Link>
                            <Form method="post">
                              <input type="hidden" name="intent" value="duplicate" />
                              <input type="hidden" name="menuId" value={menu.id} />
                              <button type="submit" className="p-2.5 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors">
                                <Copy className="w-5 h-5 text-purple-300" />
                              </button>
                            </Form>
                            <Form method="post" onSubmit={(e) => { if (!confirm('Delete this menu?')) e.preventDefault(); }}>
                              <input type="hidden" name="intent" value="delete" />
                              <input type="hidden" name="menuId" value={menu.id} />
                              <button type="submit" className="p-2.5 bg-slate-800/50 hover:bg-red-500/20 rounded-lg transition-colors">
                                <Trash2 className="w-5 h-5 text-red-400" />
                              </button>
                            </Form>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Create Menu Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-purple-500/30 rounded-3xl p-8 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Create New Menu</h3>
              <Form method="post" onSubmit={() => setShowCreateModal(false)}>
                <input type="hidden" name="intent" value="create" />
                <div className="mb-6">
                  <label className="text-sm font-medium text-purple-300 mb-2 block">Menu Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Dinner Menu"
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-white font-medium transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl text-white font-medium transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </Form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
