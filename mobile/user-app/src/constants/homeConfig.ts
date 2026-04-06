export interface CategoryConfig {
  id: string;
  title: string;
  subtitle: string;
  filter: string;
  row: number;
}

export const HOME_CATEGORIES: CategoryConfig[] = [
  // Row 1: Vertical/Bento (Next to Promo)
  { id: 'frozen', title: 'Frozen : Ready-to-Cook', subtitle: '120+ Items • Quick & delicious', filter: 'frozen', row: 1 },

  // Row 2: Curated Deliveries (Auto-adjusting grid)
  { id: '5min', title: '5 Min Meals', subtitle: '45+ Items • Instant satisfaction', filter: '5min', row: 2 },
  { id: '10min', title: '10 Min Meals', subtitle: '30+ Items • Fast & fresh', filter: '10min', row: 2 },

  // Row 3: Sourcing Categories — 4 squares with local images
  { id: 'veg', title: 'Fresh Vegetables', subtitle: '80+ Items • Farm to doorstep', filter: 'veg', row: 3 },
  { id: 'meat', title: 'Fresh & Frozen Meat', subtitle: '30+ Items • Premium cuts', filter: 'meat', row: 3 },
  { id: 'kitchen', title: 'Kitchen Essentials', subtitle: '80+ Items • Pro grade tools', filter: 'kitchen', row: 3 },
  { id: 'packaging', title: 'Packaging Materials', subtitle: '50+ Items • Sustainable', filter: 'packaging', row: 3 },
];
