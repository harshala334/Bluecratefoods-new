import { ImageSourcePropType } from 'react-native';

import { Ingredient, Recipe, Step, Nutrition, UserReview, Utensil } from '../types/recipe';

// Removed local interface definitions to avoid duplication


const commonIngredients: Ingredient[] = [
    { id: 101, name: 'Salt', amount: 5, unit: 'g', price: 0.50, category: 'Pantry' },
    { id: 102, name: 'Black Pepper', amount: 2, unit: 'g', price: 0.50, category: 'Pantry' },
    { id: 103, name: 'Olive Oil', amount: 10, unit: 'ml', price: 1.00, category: 'Pantry' },
];

// TODO: This mock data should be removed or moved to tests once the backend API is fully integrated
export const recipes: Recipe[] = [
    {
        id: 1,
        name: 'Avocado Toast Supreme',
        image: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=800',
        time: '5 min',
        difficulty: 'Easy',
        servings: 2,
        rating: 4.8,
        reviews: 124,
        description: 'Crispy sourdough bread topped with creamy avocado, poached eggs, and a sprinkle of chili flakes. The perfect breakfast or brunch.',
        category: '10min',
        basePrice: 12.50,
        spiceLevel: 1,
        tags: ['breakfast', 'healthy', 'avocado'],

        utensils: [
            { id: 1, name: 'Toaster', image: 'https://images.unsplash.com/photo-1583525528022-2621987d6063?w=200' },
            { id: 2, name: 'Knife', image: 'https://images.unsplash.com/photo-1593642532400-2682810df593?w=200' },
            { id: 3, name: 'Cutting Board', image: 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=200' },
            { id: 4, name: 'Small Pot', image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=200' }
        ],
        ingredients: [
            { id: 1, name: 'Sourdough Bread', amount: 2, unit: 'slices', price: 1.50, category: 'Bakery', isMandatory: true },
            { id: 2, name: 'Avocado', amount: 1, unit: 'pc', price: 2.00, category: 'Produce', isMandatory: true },
            { id: 3, name: 'Eggs', amount: 2, unit: 'pcs', price: 1.00, category: 'Dairy' },
            { id: 4, name: 'Chili Flakes', amount: 1, unit: 'g', price: 0.20, category: 'Spices' },
            ...commonIngredients
        ],
        steps: [
            { id: 1, title: 'Toast Bread', description: 'Toast the sourdough slices until golden brown.', time: 2, videoUrl: 'https://example.com/video1.mp4', timerSeconds: 120 },
            { id: 2, title: 'Mash Avocado', description: 'Mash the avocado with salt, pepper, and lime juice.', time: 2, videoUrl: 'https://example.com/video2.mp4' },
            { id: 3, title: 'Assemble', description: 'Spread avocado on toast and top with poached eggs.', time: 1, videoUrl: 'https://example.com/video3.mp4' }
        ],
        nutrition: { calories: 350, protein: 12, carbs: 25, fat: 18 },
        userReviews: [
            { id: 1, user: 'Sarah M.', rating: 5, comment: 'Absolutely delicious! The avocado was perfectly ripe.', date: '2 days ago' },
            { id: 2, user: 'John D.', rating: 4, comment: 'Great recipe, but I added a bit more chili flakes.', date: '1 week ago' },
            { id: 3, user: 'Emily R.', rating: 5, comment: 'My go-to breakfast now. So easy to make!', date: '2 weeks ago' }
        ]
    }
];
