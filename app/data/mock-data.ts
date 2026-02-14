export interface Restaurant {
  id: string;
  name: string;
  ownerName: string;
  slug: string;
  tagline: string;
  logoUrl: string;
  coverImageUrl: string;
  primaryColor: string;

  createdAt: string;
  menus: MenuWithCategories[];
}

export interface Menu {
  id: string;
  restaurantId: string;
  name: string;
  language: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryWithItems extends MenuCategory {
  items: MenuItem[];
}

export interface MenuWithCategories extends Menu {
  categories: CategoryWithItems[];
}

export interface MenuCategory {
  id: string;
  menuId: string;
  name: string;
  icon: string;
  order: number;
  createdAt: string;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  cost?: number;
  imageUrl: string;
  allergens: string[];
  dietaryTags: string[];
  isAvailable: boolean;
  isPopular: boolean;
  spicyLevel: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface QRCode {
  id: string;
  restaurantId: string;
  menuId: string;
  shortCode: string;
  qrImageUrl: string;
  scanCount: number;
  createdAt: string;
}

export interface ScanAnalytic {
  id: string;
  qrCodeId: string;
  restaurantId: string;
  scannedAt: string;
  deviceType: "mobile" | "tablet" | "desktop";
  duration: number;
}

// Pakistani Hostel Menu Data
export const mockMenus: Menu[] = [
  {
    id: "menu-1",
    restaurantId: "rest-1",
    name: "Daily Menu",
    language: "en",
    isActive: true,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T15:30:00Z",
  },
  {
    id: "menu-2",
    restaurantId: "rest-1",
    name: "Weekly Special",
    language: "en",
    isActive: true,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-18T12:00:00Z",
  },
];

// Pakistani Food Categories
export const mockCategories: MenuCategory[] = [
  { id: "cat-1", menuId: "menu-1", name: "Nashta (Breakfast)", icon: "🍳", order: 1, createdAt: "2024-01-15T10:00:00Z" },
  { id: "cat-2", menuId: "menu-1", name: "Dopehar (Lunch)", icon: "🍛", order: 2, createdAt: "2024-01-15T10:00:00Z" },
  { id: "cat-3", menuId: "menu-1", name: "Raat (Dinner)", icon: "🥘", order: 3, createdAt: "2024-01-15T10:00:00Z" },
  { id: "cat-4", menuId: "menu-1", name: "Chai & Snacks", icon: "☕", order: 4, createdAt: "2024-01-15T10:00:00Z" },
  { id: "cat-5", menuId: "menu-1", name: "Mithaiyan (Sweets)", icon: "🍮", order: 5, createdAt: "2024-01-15T10:00:00Z" },
];

// Pakistani Food Items with Real Images
export const mockMenuItems: MenuItem[] = [
  // ========== NASHTA (BREAKFAST) ==========
  {
    id: "item-1",
    categoryId: "cat-1",
    name: "Aloo Paratha",
    description: "Taza aata ka paratha stuffed with spiced aloo, served with dahi and achaar",
    price: 80,
    cost: 25,
    imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop",
    allergens: ["gluten", "dairy"],
    dietaryTags: ["vegetarian"],
    isAvailable: true,
    isPopular: true,
    spicyLevel: 1,
    order: 1,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "item-2",
    categoryId: "cat-1",
    name: "Halwa Puri",
    description: "Classic Pakistani nashta - Suji halwa with crispy puris and channay",
    price: 120,
    cost: 40,
    imageUrl: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&h=400&fit=crop",
    allergens: ["gluten", "dairy"],
    dietaryTags: ["vegetarian"],
    isAvailable: true,
    isPopular: true,
    spicyLevel: 1,
    order: 2,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "item-3",
    categoryId: "cat-1",
    name: "Anda Paratha",
    description: "Desi style egg paratha with fresh coriander and green chilli",
    price: 100,
    cost: 35,
    imageUrl: "https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=400&fit=crop",
    allergens: ["gluten", "eggs"],
    dietaryTags: [],
    isAvailable: true,
    isPopular: false,
    spicyLevel: 2,
    order: 3,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "item-4",
    categoryId: "cat-1",
    name: "Nihari with Naan",
    description: "Slow cooked beef shank in rich masala gravy, served with taza naan",
    price: 250,
    cost: 100,
    imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=400&fit=crop",
    allergens: ["gluten"],
    dietaryTags: [],
    isAvailable: true,
    isPopular: true,
    spicyLevel: 3,
    order: 4,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },

  // ========== DOPEHAR (LUNCH) ==========
  {
    id: "item-5",
    categoryId: "cat-2",
    name: "Chicken Biryani",
    description: "Aromatic basmati rice with tender chicken pieces, saffron and special masala",
    price: 280,
    cost: 90,
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop",
    allergens: [],
    dietaryTags: [],
    isAvailable: true,
    isPopular: true,
    spicyLevel: 2,
    order: 1,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "item-6",
    categoryId: "cat-2",
    name: "Beef Pulao",
    description: "Yakhni style pulao with tender beef chunks and caramelized onions",
    price: 300,
    cost: 110,
    imageUrl: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=400&fit=crop",
    allergens: [],
    dietaryTags: [],
    isAvailable: true,
    isPopular: true,
    spicyLevel: 1,
    order: 2,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "item-7",
    categoryId: "cat-2",
    name: "Daal Chawal",
    description: "Tadka daal with steamed rice, salad and achaar - complete meal",
    price: 150,
    cost: 40,
    imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop",
    allergens: [],
    dietaryTags: ["vegetarian", "vegan"],
    isAvailable: true,
    isPopular: false,
    spicyLevel: 1,
    order: 3,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "item-8",
    categoryId: "cat-2",
    name: "Chicken Karahi",
    description: "Fresh chicken cooked in tomato and green chilli with desi ghee",
    price: 450,
    cost: 180,
    imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=400&fit=crop",
    allergens: [],
    dietaryTags: [],
    isAvailable: true,
    isPopular: true,
    spicyLevel: 2,
    order: 4,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },

  // ========== RAAT (DINNER) ==========
  {
    id: "item-9",
    categoryId: "cat-3",
    name: "Seekh Kebab",
    description: "Charcoal grilled minced meat kebabs with mint chutney and naan",
    price: 350,
    cost: 130,
    imageUrl: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=400&fit=crop",
    allergens: ["gluten"],
    dietaryTags: [],
    isAvailable: true,
    isPopular: true,
    spicyLevel: 2,
    order: 1,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "item-10",
    categoryId: "cat-3",
    name: "Mutton Korma",
    description: "Royal style korma with tender mutton in yogurt and cashew gravy",
    price: 500,
    cost: 200,
    imageUrl: "https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=400&h=400&fit=crop",
    allergens: ["dairy", "nuts"],
    dietaryTags: [],
    isAvailable: true,
    isPopular: true,
    spicyLevel: 1,
    order: 2,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "item-11",
    categoryId: "cat-3",
    name: "Chapli Kebab",
    description: "Peshawari style flat kebabs with pomegranate seeds and fresh tomatoes",
    price: 320,
    cost: 120,
    imageUrl: "https://images.unsplash.com/photo-1606471191009-63994c53433b?w=400&h=400&fit=crop",
    allergens: [],
    dietaryTags: [],
    isAvailable: true,
    isPopular: false,
    spicyLevel: 2,
    order: 3,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "item-12",
    categoryId: "cat-3",
    name: "Butter Chicken",
    description: "Creamy tomato based curry with tender chicken tikka pieces",
    price: 400,
    cost: 150,
    imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=400&fit=crop",
    allergens: ["dairy"],
    dietaryTags: [],
    isAvailable: true,
    isPopular: true,
    spicyLevel: 1,
    order: 4,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },

  // ========== CHAI & SNACKS ==========
  {
    id: "item-13",
    categoryId: "cat-4",
    name: "Doodh Patti Chai",
    description: "Strong Pakistani tea brewed with full cream milk and elaichi",
    price: 40,
    cost: 10,
    imageUrl: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=400&fit=crop",
    allergens: ["dairy"],
    dietaryTags: ["vegetarian"],
    isAvailable: true,
    isPopular: true,
    spicyLevel: 0,
    order: 1,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "item-14",
    categoryId: "cat-4",
    name: "Samosa",
    description: "Crispy fried pastry filled with spiced aloo and matar",
    price: 30,
    cost: 8,
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop",
    allergens: ["gluten"],
    dietaryTags: ["vegetarian", "vegan"],
    isAvailable: true,
    isPopular: true,
    spicyLevel: 1,
    order: 2,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "item-15",
    categoryId: "cat-4",
    name: "Pakora Plate",
    description: "Mixed vegetable pakoras with imli and pudina chutney",
    price: 80,
    cost: 25,
    imageUrl: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400&h=400&fit=crop",
    allergens: ["gluten"],
    dietaryTags: ["vegetarian"],
    isAvailable: true,
    isPopular: false,
    spicyLevel: 1,
    order: 3,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "item-16",
    categoryId: "cat-4",
    name: "Lassi (Sweet/Salt)",
    description: "Thick creamy yogurt drink - meethi or namkeen",
    price: 60,
    cost: 20,
    imageUrl: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400&h=400&fit=crop",
    allergens: ["dairy"],
    dietaryTags: ["vegetarian"],
    isAvailable: true,
    isPopular: true,
    spicyLevel: 0,
    order: 4,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },

  // ========== MITHAIYAN (SWEETS) ==========
  {
    id: "item-17",
    categoryId: "cat-5",
    name: "Gulab Jamun",
    description: "Soft khoya balls soaked in rose flavored sugar syrup",
    price: 100,
    cost: 30,
    imageUrl: "https://images.unsplash.com/photo-1666190020499-e0ef5c955cb0?w=400&h=400&fit=crop",
    allergens: ["dairy", "gluten"],
    dietaryTags: ["vegetarian"],
    isAvailable: true,
    isPopular: true,
    spicyLevel: 0,
    order: 1,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "item-18",
    categoryId: "cat-5",
    name: "Kheer",
    description: "Creamy rice pudding with cardamom, saffron and dry fruits",
    price: 80,
    cost: 25,
    imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop",
    allergens: ["dairy", "nuts"],
    dietaryTags: ["vegetarian"],
    isAvailable: true,
    isPopular: true,
    spicyLevel: 0,
    order: 2,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "item-19",
    categoryId: "cat-5",
    name: "Jalebi",
    description: "Crispy fried swirls soaked in sweet syrup - served hot",
    price: 60,
    cost: 15,
    imageUrl: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=400&h=400&fit=crop",
    allergens: ["gluten", "dairy"],
    dietaryTags: ["vegetarian"],
    isAvailable: true,
    isPopular: false,
    spicyLevel: 0,
    order: 3,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "item-20",
    categoryId: "cat-5",
    name: "Gajar Ka Halwa",
    description: "Traditional carrot dessert with khoya, ghee and almonds",
    price: 120,
    cost: 40,
    imageUrl: "https://images.unsplash.com/photo-1650962617498-8e0b1edfd3c7?w=400&h=400&fit=crop",
    allergens: ["dairy", "nuts"],
    dietaryTags: ["vegetarian"],
    isAvailable: true,
    isPopular: true,
    spicyLevel: 0,
    order: 4,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
];

export const mockQRCodes: QRCode[] = [
  {
    id: "qr-1",
    restaurantId: "rest-1",
    menuId: "menu-1",
    shortCode: "hostel123",
    qrImageUrl: "",
    scanCount: 856,
    createdAt: "2024-01-15T10:00:00Z",
  },
];

export const mockAnalytics: ScanAnalytic[] = Array.from({ length: 50 }, (_, i) => ({
  id: `scan-${i + 1}`,
  qrCodeId: "qr-1",
  restaurantId: "rest-1",
  scannedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  deviceType: ["mobile", "tablet", "desktop"][Math.floor(Math.random() * 3)] as "mobile" | "tablet" | "desktop",
  duration: Math.floor(Math.random() * 300) + 30,
}));

// Build nested data structure
const categoriesWithItems: CategoryWithItems[] = mockCategories.map(cat => ({
  ...cat,
  items: mockMenuItems.filter(item => item.categoryId === cat.id)
}));

const menusWithCategories: MenuWithCategories[] = mockMenus.map(menu => ({
  ...menu,
  categories: categoriesWithItems.filter(cat => cat.menuId === menu.id)
}));

export const mockRestaurant: Restaurant = {
  id: "rest-1",
  name: "Hostel Menu",
  ownerName: "Hostel Warden",
  slug: "hostel-menu",
  tagline: "Ghar Jaisa Khana - Home Style Food",
  logoUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=200&fit=crop",
  coverImageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=400&fit=crop",
  primaryColor: "#10B981",

  createdAt: "2024-01-15T10:00:00Z",
  menus: menusWithCategories,
};

export const mockRestaurants = [mockRestaurant];

// Currency formatter for PKR
export const formatPKR = (amount: number): string => {
  return `Rs. ${amount.toLocaleString('en-PK')}`;
};
