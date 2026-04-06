export interface Ingredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
  spiciness?: number;
  price: number;
  category: string;
  secondaryCategories?: string[];
  image?: string;
  utensils?: Utensil[];
  steps?: Step[];
  isMandatory?: boolean;
  bulkTiers?: any[];
}

export interface Step {
  id: number;
  title: string;
  description: string;
  time: number;
  tip?: string;
  videoUrl?: string;
  timerSeconds?: number;
}

export interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface UserReview {
  id: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Utensil {
  id: number;
  name: string;
  image: string;
}

export interface Recipe {
  id: number;
  name: string;
  image: string;
  badge?: string;
  isActive?: boolean;
  inStock?: boolean;
  time?: string;
  difficulty?: string;
  servings: number;
  rating: number;
  reviews: number;
  description: string;
  ingredients: Ingredient[];
  steps: Step[];
  nutrition: Nutrition;
  category: string;
  subcategory?: string;
  basePrice: number;
  price?: number; // Added price
  utensils?: Utensil[];
  userReviews?: UserReview[];
  authorName?: string; // Added for User Profile tag
  authorId?: string;
  tags?: string[];
  secondaryCategories?: string[];
  spiceLevel?: number; // 0-5
  isApproved?: boolean;
  status?: 'pending' | 'approved' | 'rejected';
  videoUrl?: string;
  bulkTiers?: { quantity: string; price: number }[];
  unit?: string;
}
