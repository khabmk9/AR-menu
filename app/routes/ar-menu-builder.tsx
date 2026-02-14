import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import toast, { Toaster } from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';

// Lazy load 3D viewer to avoid SSR issues
const Food3DViewer = lazy(() => import('../components/food-3d-viewer'));

import {
  Search,
  Smartphone,
  Monitor,
  Download,
  QrCode,
  Settings2,
  Layers,
  Palette,
  Type,
  Image as ImageIcon,
  Save,
  Upload,
  Grid3x3,
  Sparkles,
  Box,
  Maximize2,
  Trash2,
  Copy,
  X,
  Plus,
} from 'lucide-react';
import { mockMenuItems, mockCategories } from '../data/mock-data';

type ViewMode = '2d' | '3d' | 'ar';
type Tab = 'items' | 'design' | 'settings';

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
  allergens?: string[];
  isAvailable?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function ARMenuBuilder() {
  const [activeTab, setActiveTab] = useState<Tab>('items');
  const [viewMode, setViewMode] = useState<ViewMode>('3d');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [addedItems, setAddedItems] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [menuName, setMenuName] = useState('Hostel Menu');
  const [showQRModal, setShowQRModal] = useState(false);
  const [menuId, setMenuId] = useState<string>('');
  const [menuUrl, setMenuUrl] = useState<string>('');
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [customItems, setCustomItems] = useState<MenuItem[]>([]);
  const [hostelProfile, setHostelProfile] = useState<{ name: string; slogan: string; logo: string | null } | null>(null);
  const [newItem, setNewItem] = useState({ name: '', price: '', category: 'cat-1', image: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Load hostel profile and custom items
  useEffect(() => {
    const savedProfile = localStorage.getItem('hostel-profile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setHostelProfile(profile);
      setMenuName(profile.name);
    }
    const savedCustomItems = localStorage.getItem('custom-menu-items');
    if (savedCustomItems) {
      setCustomItems(JSON.parse(savedCustomItems));
    }
  }, []);

  // GSAP Animations
  useGSAP(() => {
    if (containerRef.current) {
      gsap.from('.stat-card', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
      });

      gsap.from('.menu-item-card', {
        scale: 0.9,
        opacity: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: 'back.out(1.7)',
      });
    }
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    if (previewRef.current && addedItems.length > 0) {
      gsap.from(previewRef.current.querySelectorAll('.preview-item'), {
        x: -20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
      });
    }
  }, [addedItems]);

  const categories = Array.from(new Set(mockCategories.map(c => c.name)));

  const filteredItems = mockMenuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory ||
      mockCategories.find(c => c.id === item.categoryId)?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    e.dataTransfer.setData('itemId', itemId);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('itemId');
    if (itemId && !addedItems.includes(itemId)) {
      setAddedItems([...addedItems, itemId]);
      toast.success('Item added to menu!', { icon: '✨' });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleRemoveItem = (itemId: string) => {
    setAddedItems(addedItems.filter(id => id !== itemId));
    toast.success('Item removed', { icon: '🗑️' });
  };

  const handleSave = () => {
    if (addedItems.length === 0) {
      toast.error('Add some items to your menu first!');
      return;
    }

    const id = menuId || `menu-${Date.now()}`;
    setMenuId(id);

    const menuData = {
      id,
      name: menuName,
      items: addedItems,
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    const existingMenus = JSON.parse(localStorage.getItem('ar-menus') || '[]');
    const updatedMenus = existingMenus.filter((m: { id: string }) => m.id !== id);
    updatedMenus.push(menuData);
    localStorage.setItem('ar-menus', JSON.stringify(updatedMenus));

    toast.success('✅ Menu saved successfully!');
  };

  const handleExport = () => {
    toast.success('Exporting menu as PDF...', { icon: '📄' });
  };

  const handleGenerateQR = () => {
    if (addedItems.length === 0) {
      toast.error('Add some items to your menu first!');
      return;
    }

    // Save menu first
    const id = menuId || `menu-${Date.now()}`;
    setMenuId(id);

    const menuData = {
      id,
      name: menuName,
      items: addedItems,
      createdAt: new Date().toISOString(),
    };

    const existingMenus = JSON.parse(localStorage.getItem('ar-menus') || '[]');
    const updatedMenus = existingMenus.filter((m: { id: string }) => m.id !== id);
    updatedMenus.push(menuData);
    localStorage.setItem('ar-menus', JSON.stringify(updatedMenus));

    // Generate URL
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${baseUrl}/menu/${id}`;
    setMenuUrl(url);

    setShowQRModal(true);
    toast.success('QR Code generated!', { icon: '📱' });
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 512;
      canvas.height = 512;
      ctx!.fillStyle = 'white';
      ctx!.fillRect(0, 0, 512, 512);
      ctx!.drawImage(img, 56, 56, 400, 400);

      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `${menuName.replace(/\s+/g, '-').toLowerCase()}-qr.png`;
      downloadLink.click();
      toast.success('QR Code downloaded!', { icon: '✅' });
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(menuUrl);
      toast.success('Link copied to clipboard!', { icon: '📋' });
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewItem({ ...newItem, image: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCustomItem = () => {
    if (!newItem.name || !newItem.price || !newItem.image) {
      toast.error('Please fill all fields and upload an image');
      return;
    }

    const item: MenuItem = {
      id: `custom-${Date.now()}`,
      categoryId: newItem.category,
      name: newItem.name,
      description: 'Custom dish',
      price: parseFloat(newItem.price),
      imageUrl: newItem.image,
      allergens: [],
      dietaryTags: [],
      isAvailable: true,
      isPopular: false,
      spicyLevel: 1,
      order: customItems.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedItems = [...customItems, item];
    setCustomItems(updatedItems);
    localStorage.setItem('custom-menu-items', JSON.stringify(updatedItems));

    // Auto-add to menu
    setAddedItems([...addedItems, item.id]);

    setNewItem({ name: '', price: '', category: 'cat-1', image: '' });
    setShowAddItemModal(false);
    toast.success('Custom item added!', { icon: '🍽️' });
  };

  // Combine mock items with custom items
  const allMenuItems = [...mockMenuItems, ...customItems];

  const groupedItems = addedItems.reduce((acc, itemId) => {
    const item = allMenuItems.find(i => i.id === itemId);
    if (!item) return acc;

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
    <>
      <Toaster position="top-right" />
      <div ref={containerRef} className="flex h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 overflow-hidden">

        {/* Sidebar */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="w-80 bg-slate-900/50 backdrop-blur-xl border-r border-purple-500/20 flex flex-col"
        >
          <div className="p-6 border-b border-purple-500/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">AR Menu Builder</h2>
                <p className="text-sm text-purple-300">Create immersive experiences</p>
              </div>
            </div>
          </div>

          <div className="flex border-b border-purple-500/20">
            {[
              { id: 'items' as Tab, icon: Layers, label: 'Items' },
              { id: 'design' as Tab, icon: Palette, label: 'Design' },
              { id: 'settings' as Tab, icon: Settings2, label: 'Settings' },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all ${activeTab === tab.id
                    ? 'text-white bg-purple-500/20 border-b-2 border-purple-500'
                    : 'text-purple-300 hover:text-white hover:bg-purple-500/10'
                    }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="wait">
              {activeTab === 'items' && (
                <motion.div
                  key="items"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-4 space-y-4"
                >
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                    <input
                      type="text"
                      placeholder="Search items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-purple-500/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${!selectedCategory
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-slate-800/50 text-purple-300 hover:bg-slate-800'
                        }`}
                    >
                      All
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedCategory === category
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-slate-800/50 text-purple-300 hover:bg-slate-800'
                          }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>

                  {/* Add Custom Dish Button */}
                  <button
                    onClick={() => setShowAddItemModal(true)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-500/30 rounded-xl text-green-300 font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={18} />
                    Add Custom Dish
                  </button>

                  <div className="space-y-3">
                    {filteredItems.map((item) => (
                      <div
                        key={item.id}
                        className="menu-item-card group cursor-grab active:cursor-grabbing"
                        draggable
                        onDragStart={(e) => handleDragStart(e, item.id)}
                      >
                        <div className="bg-slate-800/30 backdrop-blur-sm border border-purple-500/20 rounded-xl p-3 hover:border-purple-500/40 transition-all">
                          <div className="flex gap-3 mb-2">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-white text-sm mb-1 truncate">{item.name}</h4>
                              <p className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Rs. {item.price}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-purple-300/70 line-clamp-2">{item.description}</p>
                          {(item.isPopular || item.dietaryTags?.length) && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {item.isPopular && (
                                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-300 text-xs rounded-full">
                                  ⭐ Popular
                                </span>
                              )}
                              {item.dietaryTags?.map((tag) => (
                                <span key={tag} className="px-2 py-0.5 bg-green-500/20 text-green-300 text-xs rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'design' && (
                <motion.div
                  key="design"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-4 space-y-6"
                >
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-purple-300 mb-3">
                      <Type size={16} />
                      Typography
                    </label>
                    <div className="space-y-2">
                      <div className="bg-slate-800/30 border border-purple-500/20 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-white">Large Text</span>
                          <input type="checkbox" className="toggle-checkbox" />
                        </div>
                        <p className="text-xs text-purple-300/50">Increase readability</p>
                      </div>
                      <div className="bg-slate-800/30 border border-purple-500/20 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-white">Bold Prices</span>
                          <input type="checkbox" defaultChecked className="toggle-checkbox" />
                        </div>
                        <p className="text-xs text-purple-300/50">Make prices stand out</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-purple-300 mb-3">
                      <Palette size={16} />
                      Color Theme
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {[
                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                      ].map((gradient, i) => (
                        <button
                          key={i}
                          className="w-full h-12 rounded-lg border-2 border-transparent hover:border-white/50 transition-all"
                          style={{ background: gradient }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-purple-300 mb-3">
                      <ImageIcon size={16} />
                      Image Settings
                    </label>
                    <div className="space-y-2">
                      <div className="bg-slate-800/30 border border-purple-500/20 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-white">Show Images</span>
                          <input type="checkbox" defaultChecked className="toggle-checkbox" />
                        </div>
                      </div>
                      <div className="bg-slate-800/30 border border-purple-500/20 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-white">3D Models</span>
                          <input type="checkbox" defaultChecked className="toggle-checkbox" />
                        </div>
                        <p className="text-xs text-purple-300/50">Enable AR preview</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-4 space-y-4"
                >
                  <div>
                    <label className="text-sm font-medium text-purple-300 mb-2 block">Menu Name</label>
                    <input
                      type="text"
                      value={menuName}
                      onChange={(e) => setMenuName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-800/50 border border-purple-500/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                  </div>

                  <div className="bg-slate-800/30 border border-purple-500/20 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-white mb-3">Menu Statistics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-purple-300 text-sm">Items Added</span>
                        <span className="text-white font-semibold">{addedItems.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-300 text-sm">Categories</span>
                        <span className="text-white font-semibold">{Object.keys(groupedItems).length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-300 text-sm">Status</span>
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-300 text-xs rounded-full">Active</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Main Canvas */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <motion.div
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            className="h-16 bg-slate-900/50 backdrop-blur-xl border-b border-purple-500/20 flex items-center justify-between px-6"
          >
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-slate-800/50 hover:bg-slate-800 border border-purple-500/20 rounded-lg text-white text-sm font-medium transition-all flex items-center gap-2">
                <Grid3x3 size={16} />
                Layout
              </button>
            </div>

            <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg p-1 border border-purple-500/20">
              {[
                { id: '2d' as ViewMode, icon: Monitor, label: '2D' },
                { id: '3d' as ViewMode, icon: Box, label: '3D' },
                { id: 'ar' as ViewMode, icon: Smartphone, label: 'AR' },
              ].map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setViewMode(mode.id)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${viewMode === mode.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'text-purple-300 hover:text-white'
                      }`}
                  >
                    <Icon size={16} />
                    {mode.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerateQR}
                className="px-4 py-2 bg-slate-800/50 hover:bg-slate-800 border border-purple-500/20 rounded-lg text-white text-sm font-medium transition-all flex items-center gap-2"
              >
                <QrCode size={16} />
                QR Code
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg text-white text-sm font-medium transition-all flex items-center gap-2"
              >
                <Save size={16} />
                Save
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg text-white text-sm font-medium transition-all flex items-center gap-2"
              >
                <Download size={16} />
                Export
              </button>
            </div>
          </motion.div>

          {/* Preview Area */}
          <div className="flex-1 p-8 overflow-auto custom-scrollbar">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <div
                ref={previewRef}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className={`relative bg-gradient-to-br from-slate-900/80 to-purple-900/40 backdrop-blur-xl rounded-3xl border-2 ${addedItems.length === 0 ? 'border-dashed border-purple-500/30' : 'border-purple-500/20'
                  } p-8 min-h-[600px] transition-all`}
              >
                {/* Phone Mockup for AR Mode */}
                {viewMode === 'ar' && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[375px] h-20 bg-black rounded-t-3xl">
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-full flex items-center justify-center gap-2">
                      <div className="w-12 h-1 bg-slate-700 rounded-full" />
                      <div className="w-2 h-2 bg-slate-700 rounded-full" />
                    </div>
                  </div>
                )}

                {/* Menu Header */}
                <div className="text-center mb-8">
                  <div className="inline-block p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl mb-4">
                    <div className="text-5xl">🍽️</div>
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    {menuName}
                  </h2>
                  <p className="text-purple-300">Fine dining with a modern twist</p>
                </div>

                {/* Drop Zone / Menu Items */}
                {addedItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mb-4">
                      <Upload className="w-10 h-10 text-purple-400" />
                    </div>
                    <p className="text-xl font-semibold text-white mb-2">Drag items here to build your menu</p>
                    <p className="text-purple-300 text-sm">Items will automatically organize by category</p>
                  </div>
                ) : viewMode === '3d' ? (
                  // 3D View Mode - Show interactive 3D scene
                  <div className="h-[600px] relative">
                    <Suspense fallback={
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                          <p className="text-purple-300">Loading 3D Scene...</p>
                        </div>
                      </div>
                    }>
                      <Food3DViewer
                        items={addedItems.map(id => {
                          const item = mockMenuItems.find(i => i.id === id);
                          return item ? {
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            imageUrl: item.imageUrl
                          } : null;
                        }).filter((item): item is { id: string; name: string; price: number; imageUrl: string } => item !== null)}
                        selectedItemId={selectedItem}
                        onSelectItem={(id) => setSelectedItem(id)}
                      />
                    </Suspense>
                    {/* 3D Mode header */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-sm px-6 py-2 rounded-full border border-purple-500/30">
                      <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {menuName}
                      </h2>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {Object.entries(groupedItems).map(([categoryName, { icon, items }]) => (
                      <motion.div
                        key={categoryName}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-3xl">{icon}</span>
                          <h3 className="text-2xl font-bold text-white">{categoryName}</h3>
                          <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent" />
                        </div>

                        <div className="grid gap-4">
                          {items.map((item) => (
                            <motion.div
                              key={item.id}
                              className="preview-item group relative bg-slate-800/30 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4 hover:border-purple-500/40 transition-all"
                              whileHover={{ scale: 1.02 }}
                            >
                              <div className="flex gap-4">
                                <div className="relative">
                                  <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="w-24 h-24 rounded-xl object-cover"
                                  />
                                  {viewMode === '3d' && (
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Maximize2 className="w-6 h-6 text-white" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-lg font-bold text-white mb-1">{item.name}</h4>
                                  <p className="text-sm text-purple-300/70 mb-2 line-clamp-2">{item.description}</p>
                                  <div className="flex items-center justify-between">
                                    <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                      Rs. {item.price}
                                    </p>
                                    {item.isPopular && (
                                      <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full font-medium">
                                        ⭐ Popular
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/20 rounded-lg"
                                >
                                  <Trash2 className="w-5 h-5 text-red-400" />
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* QR Code Modal */}
        <AnimatePresence>
          {showQRModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setShowQRModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-900 border border-purple-500/30 rounded-3xl p-8 max-w-md w-full mx-4"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">Your QR Code</h3>
                  <button
                    onClick={() => setShowQRModal(false)}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-purple-300" />
                  </button>
                </div>

                <div className="bg-white p-8 rounded-2xl mb-6 flex items-center justify-center">
                  <QRCodeSVG
                    id="qr-code-svg"
                    value={menuUrl || 'https://menuflow.com'}
                    size={256}
                    level="H"
                    includeMargin={true}
                    fgColor="#1e1b4b"
                  />
                </div>

                <div className="bg-slate-800/50 rounded-xl p-3 mb-4">
                  <p className="text-purple-300 text-xs mb-1">Menu URL:</p>
                  <p className="text-white text-sm font-mono break-all">{menuUrl}</p>
                </div>

                <p className="text-purple-300 text-center mb-6">
                  Scan this code to view your menu on any device
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleDownloadQR}
                    className="px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-white font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={18} />
                    Download
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl text-white font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <Copy size={18} />
                    Copy Link
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Custom Item Modal */}
        <AnimatePresence>
          {showAddItemModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setShowAddItemModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-900 border border-purple-500/30 rounded-3xl p-6 max-w-md w-full mx-4"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Add Custom Dish</h3>
                  <button
                    onClick={() => setShowAddItemModal(false)}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-purple-300" />
                  </button>
                </div>

                {/* Image Upload */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {newItem.image ? (
                  <div className="relative mb-4">
                    <img src={newItem.image} alt="Preview" className="w-full h-40 object-cover rounded-xl" />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-2 right-2 px-3 py-1 bg-slate-900/80 rounded-lg text-white text-sm"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-8 border-2 border-dashed border-purple-500/30 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-purple-500/50 mb-4"
                  >
                    <Upload className="w-8 h-8 text-purple-400" />
                    <span className="text-purple-300 text-sm">Upload Food Image</span>
                  </button>
                )}

                {/* Name Input */}
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="Dish Name (e.g., Chicken Biryani)"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-xl text-white placeholder-slate-500 mb-3"
                />

                {/* Price Input */}
                <div className="flex gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-xl">
                      <span className="text-purple-400">Rs.</span>
                      <input
                        type="number"
                        value={newItem.price}
                        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                        placeholder="Price"
                        className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Category Select */}
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-xl text-white mb-4"
                >
                  {mockCategories.map(cat => (
                    <option key={cat.id} value={cat.id} className="bg-slate-900">
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>

                {/* Add Button */}
                <button
                  onClick={handleAddCustomItem}
                  className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl text-white font-semibold flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Add to Menu
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #a855f7, #ec4899);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #9333ea, #db2777);
        }
        
        .toggle-checkbox {
          appearance: none;
          width: 44px;
          height: 24px;
          background: rgba(148, 163, 184, 0.2);
          border-radius: 12px;
          position: relative;
          cursor: pointer;
          transition: all 0.3s;
        }
        .toggle-checkbox:checked {
          background: linear-gradient(135deg, #a855f7, #ec4899);
        }
        .toggle-checkbox::before {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          top: 2px;
          left: 2px;
          transition: all 0.3s;
        }
        .toggle-checkbox:checked::before {
          left: 22px;
        }
      `}</style>
    </>
  );
}
