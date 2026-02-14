import { Form, redirect, useNavigation } from 'react-router';
import type { Route } from './+types/settings';
import { requireAuth } from '~/lib/supabase.server';
import { getRestaurant, updateRestaurant } from '~/lib/restaurant.server';
import { Settings as SettingsIcon, Store, User, Save } from 'lucide-react';

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireAuth(request);
  const restaurant = await getRestaurant(request, user.id);
  return { user, restaurant };
}

export async function action({ request }: Route.ActionArgs) {
  const user = await requireAuth(request);
  const formData = await request.formData();
  const restaurant = await getRestaurant(request, user.id);

  if (!restaurant) return { error: "No restaurant found" };

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const address = formData.get("address") as string;
  const phone = formData.get("phone") as string;
  const website = formData.get("website") as string;

  const { error, headers } = await updateRestaurant(request, restaurant.id, {
    name: name || restaurant.name,
    description: description || undefined,
    address: address || undefined,
    phone: phone || undefined,
    website: website || undefined,
  });

  if (error) return { error };
  return redirect("/dashboard/settings", { headers });
}

export default function Settings({ loaderData, actionData }: Route.ComponentProps) {
  const { user, restaurant } = loaderData;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-2">
            Settings
          </h1>
          <p className="text-purple-300">Manage your account and restaurant details</p>
        </div>

        {actionData && 'error' in actionData && actionData.error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300">
            {actionData.error}
          </div>
        )}

        {/* Account Section */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-purple-400" />
            Account
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-purple-300 mb-2 block">Email</label>
              <input
                type="email"
                value={user.email || ''}
                readOnly
                className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/20 rounded-xl text-white/60 cursor-not-allowed"
              />
              <p className="text-xs text-purple-400 mt-1">Email cannot be changed here</p>
            </div>
            <div>
              <label className="text-sm font-medium text-purple-300 mb-2 block">Name</label>
              <input
                type="text"
                value={user.user_metadata?.full_name || ''}
                readOnly
                className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/20 rounded-xl text-white/60 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Restaurant Section */}
        {restaurant && (
          <Form method="post">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 mb-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Store className="w-5 h-5 text-purple-400" />
                Restaurant Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-purple-300 mb-2 block">Restaurant Name</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={restaurant.name}
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-purple-300 mb-2 block">Description</label>
                  <textarea
                    name="description"
                    defaultValue={restaurant.description || ''}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-purple-300 mb-2 block">Address</label>
                  <input
                    type="text"
                    name="address"
                    defaultValue={restaurant.address || ''}
                    placeholder="123 Main St, City"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-purple-300 mb-2 block">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      defaultValue={restaurant.phone || ''}
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-purple-300 mb-2 block">Website</label>
                    <input
                      type="url"
                      name="website"
                      defaultValue={restaurant.website || ''}
                      placeholder="https://myrestaurant.com"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/50 flex items-center gap-2 disabled:opacity-50 transition-all"
            >
              <Save className="w-5 h-5" />
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </Form>
        )}
      </div>
    </div>
  );
}
