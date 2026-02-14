import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { mockMenuItems, mockCategories } from '../data/mock-data';
import { ArrowLeft, Star, Flame, Leaf, Clock, MapPin, Phone } from 'lucide-react';

interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    categoryId: string;
    isPopular?: boolean;
    spicyLevel?: number;
    dietaryTags?: string[];
}

interface MenuData {
    id: string;
    name: string;
    items: string[];
    createdAt: string;
}

export default function MenuViewer() {
    const { menuId } = useParams();
    const [menuData, setMenuData] = useState<MenuData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load menu from localStorage (demo storage)
        const savedMenus = localStorage.getItem('ar-menus');
        if (savedMenus) {
            const menus = JSON.parse(savedMenus);
            const found = menus.find((m: MenuData) => m.id === menuId);
            if (found) {
                setMenuData(found);
            }
        }
        setLoading(false);
    }, [menuId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!menuData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="text-6xl mb-4">🍽️</div>
                    <h1 className="text-2xl font-bold text-white mb-2">Menu Not Found</h1>
                    <p className="text-purple-300">This menu may have been removed or the link is invalid.</p>
                </div>
            </div>
        );
    }

    // Get menu items from the saved item IDs
    const menuItems = menuData.items
        .map(id => mockMenuItems.find(item => item.id === id))
        .filter((item): item is MenuItem => item !== undefined);

    // Group items by category
    const groupedItems = menuItems.reduce((acc, item) => {
        const category = mockCategories.find(c => c.id === item.categoryId);
        if (!category) return acc;

        if (!acc[category.name]) {
            acc[category.name] = {
                icon: category.icon,
                items: []
            };
        }
        acc[category.name].items.push(item);
        return acc;
    }, {} as Record<string, { icon: string; items: MenuItem[] }>);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-purple-500/20">
                <div className="max-w-2xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                <span className="text-xl">🍽️</span>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-white">{menuData.name}</h1>
                                <p className="text-xs text-purple-300">Ghar Jaisa Khana</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-purple-300 text-sm">
                            <Clock size={14} />
                            <span>Open Now</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <div className="relative h-48 bg-gradient-to-br from-purple-600 to-pink-600 overflow-hidden">
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center"
                    >
                        <h2 className="text-4xl font-bold text-white mb-2">{menuData.name}</h2>
                        <div className="flex items-center justify-center gap-4 text-white/80 text-sm">
                            <span className="flex items-center gap-1">
                                <Star size={14} className="text-yellow-400" />
                                4.8 (Hostel Rating)
                            </span>
                            <span>•</span>
                            <span>{menuItems.length} items</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Menu Content */}
            <main className="max-w-2xl mx-auto px-4 py-6 space-y-8">
                {Object.entries(groupedItems).map(([categoryName, { icon, items }], categoryIndex) => (
                    <motion.section
                        key={categoryName}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: categoryIndex * 0.1 }}
                    >
                        {/* Category Header */}
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-2xl">{icon}</span>
                            <h3 className="text-xl font-bold text-white">{categoryName}</h3>
                            <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent" />
                        </div>

                        {/* Items */}
                        <div className="space-y-3">
                            {items.map((item, itemIndex) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: categoryIndex * 0.1 + itemIndex * 0.05 }}
                                    className="bg-slate-800/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4 hover:border-purple-500/40 transition-all"
                                >
                                    <div className="flex gap-4">
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <h4 className="font-bold text-white">{item.name}</h4>
                                                {item.isPopular && (
                                                    <span className="flex-shrink-0 px-2 py-0.5 bg-yellow-500/20 text-yellow-300 text-xs rounded-full">
                                                        ⭐ Popular
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-purple-300/70 mb-2 line-clamp-2">{item.description}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                                    Rs. {item.price}
                                                </span>
                                                <div className="flex gap-1">
                                                    {item.spicyLevel && item.spicyLevel > 0 && (
                                                        <span className="px-2 py-0.5 bg-red-500/20 text-red-300 text-xs rounded-full flex items-center gap-1">
                                                            <Flame size={10} />
                                                            {item.spicyLevel > 2 ? 'Hot' : 'Mild'}
                                                        </span>
                                                    )}
                                                    {item.dietaryTags?.map(tag => (
                                                        <span key={tag} className="px-2 py-0.5 bg-green-500/20 text-green-300 text-xs rounded-full">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                ))}

                {menuItems.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-5xl mb-4">📋</div>
                        <h3 className="text-xl font-bold text-white mb-2">Empty Menu</h3>
                        <p className="text-purple-300">No items have been added to this menu yet.</p>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-slate-900/80 backdrop-blur-xl border-t border-purple-500/20 py-6 mt-8">
                <div className="max-w-2xl mx-auto px-4 text-center">
                    <p className="text-purple-300 text-sm mb-2">Powered by</p>
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-xl">🇵🇰</span>
                        <span className="text-lg font-bold bg-gradient-to-r from-green-400 to-white bg-clip-text text-transparent">
                            Hostel Menu Pakistan
                        </span>
                    </div>
                    <p className="text-purple-300/50 text-xs mt-4">
                        Digital Menu for Pakistani Hostels
                    </p>
                </div>
            </footer>
        </div>
    );
}
