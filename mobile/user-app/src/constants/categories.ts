
export interface Subcategory {
    id: string;
    name: string;
    icon: string;
}

export interface CategorySection {
    id: string;
    title: string;
    subtitle: string;
    icon: string;
    image: string;
    subcategories: Subcategory[];
}

export const CATEGORY_DATA: CategorySection[] = [
    {
        id: 'frozen',
        title: 'Ready to cook: Frozen',
        subtitle: '120+ Items • Quick & delicious',
        icon: '🥟',
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&q=80',
        subcategories: [
            { id: 'all', name: 'All Items', icon: '📦' },
            { id: 'chicken-momo', name: 'Chicken Momo', icon: '🥟' },
            { id: 'seafood-momo', name: 'Seafood Momo', icon: '🍣' },
            { id: 'veg-momo', name: 'Veg Momo', icon: '🥬' },
            { id: 'sha-phaley-momo', name: 'Sha-Phaley Momo', icon: '🥟' },
            { id: 'fried-fish', name: 'Fried Fish', icon: '🐟' },
            { id: 'fried-chicken', name: 'Fried Chicken', icon: '🍗' },
            { id: 'fried-veg', name: 'Fried Veg', icon: '🥦' },
            { id: 'multi-use-meat', name: 'Multi-use Meat', icon: '🍖' },
            { id: 'sauce-marinades', name: 'Sauce/Marinades', icon: '🍶' },
        ]
    },
    {
        id: '5min',
        title: '5 Min Meals',
        subtitle: '45+ Items • Instant satisfaction',
        icon: '⚡',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80',
        subcategories: [
            { id: 'all', name: 'All Items', icon: '📦' },
            { id: 'chicken-momo', name: 'Chicken Momo', icon: '🥟' },
            { id: 'seafood-momo', name: 'Seafood Momo', icon: '🍣' },
            { id: 'veg-momo', name: 'Veg Momo', icon: '🥬' },
            { id: 'sha-phaley-momo', name: 'Sha-Phaley Momo', icon: '🥟' },
            { id: 'fried-fish', name: 'Fried Fish', icon: '🐟' },
            { id: 'fried-chicken', name: 'Fried Chicken', icon: '🍗' },
            { id: 'fried-veg', name: 'Fried Veg', icon: '🥦' },
        ]
    },
    {
        id: '10min',
        title: '10 Min Meals',
        subtitle: '30+ Items • Fast & fresh',
        icon: '🥘',
        image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500&q=80',
        subcategories: [
            { id: 'all', name: 'All Items', icon: '📦' },
            { id: 'kebab-grills', name: 'Kebab/Grills', icon: '🍢' },
            { id: 'pulled-chicken', name: 'Pulled Chicken', icon: '🍗' },
            { id: 'bengali-main', name: 'Bengali Main Course', icon: '🍛' },
            { id: 'general-main', name: 'General Main Course', icon: '🥘' },
        ]
    },
    {
        id: 'veg',
        title: 'Fresh Vegetables',
        subtitle: '80+ Items • Farm to doorstep',
        icon: '🥬',
        image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&q=80',
        subcategories: [
            { id: 'all', name: 'All Items', icon: '📦' },
            { id: 'leafy', name: 'Leafy Greens', icon: '🥬' },
            { id: 'roots', name: 'Root Veggies', icon: '🥕' },
            { id: 'exotic', name: 'Exotics', icon: '🥑' },
            { id: 'daily', name: 'Daily Needs', icon: '🧅' },
            { id: 'organic', name: 'Organic', icon: '🌿' },
            { id: 'salads', name: 'Salad Mixes', icon: '🥗' },
        ]
    },
    {
        id: 'meat',
        title: 'Fresh & Frozen Meat',
        subtitle: '30+ Items • Premium cuts',
        icon: '🥩',
        image: 'https://images.unsplash.com/photo-1551028150-64b9f398f678?w=500&q=80',
        subcategories: [
            { id: 'all', name: 'All Items', icon: '📦' },
            { id: 'fresh-meat', name: 'Fresh Meat', icon: '🥩' },
            { id: 'frozen-meat', name: 'Frozen Meat', icon: '❄️' },
            { id: 'cold-cuts', name: 'Cold Cuts', icon: '🥓' },
            { id: 'chicken', name: 'Chicken', icon: '🍗' },
            { id: 'mutton', name: 'Mutton Chops', icon: '🍖' },
            { id: 'fish', name: 'Seafood', icon: '🐟' },
            { id: 'eggs', name: 'Organic Eggs', icon: '🥚' },
        ]
    },
    {
        id: 'kitchen',
        title: 'Kitchen Essentials',
        subtitle: '80+ Items • Pro grade tools',
        icon: '🍳',
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&q=80',
        subcategories: [
            { id: 'all', name: 'All Items', icon: '📦' },
            { id: 'tools', name: 'Tools', icon: '🍴' },
            { id: 'cookware', name: 'Cookware', icon: '🍳' },
        ]
    },
    {
        id: 'packaging',
        title: 'Packaging Materials',
        subtitle: '50+ Items • Sustainable',
        icon: '📦',
        image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=500&q=80',
        subcategories: [
            { id: 'all', name: 'All Items', icon: '📦' },
            { id: 'boxes', name: 'Boxes', icon: '📦' },
            { id: 'bags', name: 'Bags', icon: '🛍️' },
        ]
    },
];

export const DEFAULT_SUBCATEGORIES = [
    { id: 'all', name: 'All Items', icon: '📦' },
];
