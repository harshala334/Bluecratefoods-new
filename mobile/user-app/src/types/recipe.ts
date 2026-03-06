export interface Ingredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
  price: number;
  category: string;
  isMandatory?: boolean;
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
  time: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  servings: number;
  rating: number;
  reviews: number;
  description: string;
  ingredients: Ingredient[];
  steps: Step[];
  nutrition: Nutrition;
  category: string;
  basePrice: number;
  utensils?: Utensil[];
  userReviews?: UserReview[];
  authorName?: string; // Added for User Profile tag
  authorId?: string;
  tags?: string[];
  spiceLevel?: number; // 0-5
  isApproved?: boolean;
  status?: 'pending' | 'approved' | 'rejected';
  videoUrl?: string;
  bulkTiers?: { quantity: string; price: number }[];
  unit?: string;
}
