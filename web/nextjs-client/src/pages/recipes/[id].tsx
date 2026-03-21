import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { FiClock, FiStar, FiMinus, FiPlus, FiCheck, FiChevronRight, FiShoppingCart } from 'react-icons/fi';
import { GiMeal, GiCookingPot } from 'react-icons/gi';
import { useCartStore } from '@/stores/cartStore';
import toast from 'react-hot-toast';
import * as fpixel from '@/utils/fpixel';

export default function RecipeDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const addItem = useCartStore((state: any) => state.addItem);

  const [servings, setServings] = useState(2);
  const [selectedIngredients, setSelectedIngredients] = useState<Set<number>>(new Set());
  const [activeStep, setActiveStep] = useState<number | null>(null);

  // Mock recipe data
  const recipe = {
    id: id,
    name: 'Creamy Pasta Carbonara',
    // TODO: [CLOUDINARY] Serve recipe images from Cloudinary
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800',
    time: '25 min',
    difficulty: 'Medium',
    servings: 2,
    rating: 4.9,
    reviews: 2847,
    description: 'A classic Italian dish with crispy bacon, creamy sauce, and perfectly cooked pasta. This authentic recipe will transport you to Rome with every bite.',
    ingredients: [
      { id: 1, name: 'Spaghetti Pasta', amount: 200, unit: 'g', price: 2.99, category: 'Pantry' },
      { id: 2, name: 'Bacon Strips', amount: 150, unit: 'g', price: 4.99, category: 'Meat' },
      { id: 3, name: 'Eggs (Large)', amount: 3, unit: 'pcs', price: 3.49, category: 'Dairy' },
      { id: 4, name: 'Parmesan Cheese', amount: 100, unit: 'g', price: 5.99, category: 'Dairy' },
      { id: 5, name: 'Black Pepper', amount: 5, unit: 'g', price: 1.99, category: 'Spices' },
      { id: 6, name: 'Salt', amount: 10, unit: 'g', price: 0.99, category: 'Pantry' },
      { id: 7, name: 'Garlic Cloves', amount: 2, unit: 'pcs', price: 0.99, category: 'Vegetables' },
      { id: 8, name: 'Olive Oil', amount: 15, unit: 'ml', price: 2.49, category: 'Pantry' },
    ],
    steps: [
      {
        id: 1,
        title: 'Prepare Ingredients',
        description: 'Dice the bacon into small pieces. Grate the Parmesan cheese. Separate egg yolks from whites.',
        time: 5,
        tip: 'Use fresh eggs at room temperature for the best creamy texture.'
      },
      {
        id: 2,
        title: 'Cook Pasta',
        description: 'Bring a large pot of salted water to boil. Add spaghetti and cook until al dente.',
        time: 10,
        tip: 'Save 1 cup of pasta water before draining - you\'ll need it for the sauce!'
      },
      {
        id: 3,
        title: 'Cook Bacon',
        description: 'In a large pan, cook bacon over medium heat until crispy. Remove and set aside.',
        time: 5,
        tip: 'Don\'t discard the bacon fat - it adds amazing flavor to the dish.'
      },
      {
        id: 4,
        title: 'Make Sauce',
        description: 'Mix egg yolks with grated Parmesan. Add black pepper generously.',
        time: 2,
        tip: 'The residual heat will cook the eggs - don\'t add them to hot pasta or they\'ll scramble!'
      },
      {
        id: 5,
        title: 'Combine & Serve',
        description: 'Toss hot pasta with bacon, then remove from heat. Add egg mixture, stirring quickly. Add pasta water to achieve creamy consistency.',
        time: 3,
        tip: 'Serve immediately with extra Parmesan and black pepper on top.'
      },
    ],
    nutrition: {
      calories: 650,
      protein: 32,
      carbs: 68,
      fat: 28
    }
  };

  const servingRatio = servings / recipe.servings;

  const toggleIngredient = (id: number) => {
    const newSelected = new Set(selectedIngredients);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIngredients(newSelected);
  };

  const selectAllIngredients = () => {
    if (selectedIngredients.size === recipe.ingredients.length) {
      setSelectedIngredients(new Set());
    } else {
      setSelectedIngredients(new Set(recipe.ingredients.map(i => i.id)));
    }
  };

  const addToCart = () => {
    const selectedItems = recipe.ingredients.filter(ing => selectedIngredients.has(ing.id));

    if (selectedItems.length === 0) {
      toast.error('Please select at least one ingredient');
      return;
    }

    selectedItems.forEach(ingredient => {
      addItem({
        id: `${recipe.id}-${ingredient.id}`,
        name: `${ingredient.name} (${recipe.name})`,
        price: ingredient.price,
        quantity: Math.ceil(ingredient.amount * servingRatio),
        unit: ingredient.unit,
        image: recipe.image
      });
    });

    toast.success(`${selectedItems.length} ingredients added to cart!`);

    fpixel.event('AddToCart', {
      content_name: recipe.name,
      content_ids: [`recipe-${recipe.id}`],
      content_type: 'product',
      value: totalCost,
      currency: 'USD'
    });

    router.push('/cart');
  };

  const totalCost = recipe.ingredients
    .filter(ing => selectedIngredients.has(ing.id))
    .reduce((sum, ing) => sum + ing.price, 0);

  return (
    <Layout>
      <Head>
        <title>{recipe.name} - BlueCrateFoods</title>
        <meta name="description" content={recipe.description} />
      </Head>

      {/* Hero Section */}
      <section className="relative h-[500px] bg-gray-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 pb-12">
          <div className="container-custom">
            <div className="flex items-center space-x-2 mb-4">
              <Link href="/recipes" className="text-white/80 hover:text-white">Recipes</Link>
              <FiChevronRight className="text-white/60" />
              <span className="text-white font-medium">{recipe.name}</span>
            </div>
            <h1 className="text-5xl font-display font-bold text-white mb-4">
              {recipe.name}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white">
              <div className="flex items-center space-x-2">
                <FiStar className="text-yellow-400 fill-current" />
                <span className="font-semibold">{recipe.rating}</span>
                <span className="text-white/70">({recipe.reviews} reviews)</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiClock />
                <span>{recipe.time}</span>
              </div>
              <div className="flex items-center space-x-2">
                <GiMeal />
                <span>{recipe.servings} servings</span>
              </div>
              <span className={`badge ${recipe.difficulty === 'Easy' ? 'bg-green-500' :
                recipe.difficulty === 'Medium' ? 'bg-yellow-500' :
                  'bg-red-500'
                } text-white`}>
                {recipe.difficulty}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="card p-8">
                <h2 className="text-3xl font-display font-bold mb-4">About This Recipe</h2>
                <p className="text-gray-700 text-lg leading-relaxed">{recipe.description}</p>
              </div>

              {/* Ingredients */}
              <div className="card p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-display font-bold">Ingredients</h2>
                  <button
                    onClick={selectAllIngredients}
                    className="text-primary-600 font-semibold hover:text-primary-700"
                  >
                    {selectedIngredients.size === recipe.ingredients.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>

                {/* Servings Adjuster */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <label className="text-sm font-medium text-gray-700 mb-3 block">
                    Number of Servings
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setServings(Math.max(1, servings - 1))}
                      className="w-10 h-10 rounded-full bg-white border-2 border-primary-500 text-primary-600 hover:bg-primary-50 transition-colors flex items-center justify-center"
                    >
                      <FiMinus />
                    </button>
                    <span className="text-2xl font-bold text-gray-900 min-w-[60px] text-center">
                      {servings}
                    </span>
                    <button
                      onClick={() => setServings(servings + 1)}
                      className="w-10 h-10 rounded-full bg-white border-2 border-primary-500 text-primary-600 hover:bg-primary-50 transition-colors flex items-center justify-center"
                    >
                      <FiPlus />
                    </button>
                    <span className="text-gray-600">people</span>
                  </div>
                </div>

                {/* Ingredients List */}
                <div className="space-y-3">
                  {recipe.ingredients.map((ingredient) => {
                    const isSelected = selectedIngredients.has(ingredient.id);
                    const adjustedAmount = Math.ceil(ingredient.amount * servingRatio);

                    return (
                      <div
                        key={ingredient.id}
                        onClick={() => toggleIngredient(ingredient.id)}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 bg-white hover:border-primary-300'
                          }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${isSelected
                            ? 'bg-primary-500 border-primary-500'
                            : 'border-gray-300'
                            }`}>
                            {isSelected && <FiCheck className="text-white" size={16} />}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{ingredient.name}</div>
                            <div className="text-sm text-gray-500">{ingredient.category}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            {adjustedAmount} {ingredient.unit}
                          </div>
                          <div className="text-sm text-primary-600 font-medium">
                            ${ingredient.price.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cooking Steps */}
              <div className="card p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <GiCookingPot className="w-8 h-8 text-primary-600" />
                  <h2 className="text-3xl font-display font-bold">Cooking Steps</h2>
                </div>

                <div className="space-y-4">
                  {recipe.steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${activeStep === step.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                        }`}
                      onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-green-600 text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold">{step.title}</h3>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <FiClock size={16} />
                              <span className="text-sm">{step.time} min</span>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-3">{step.description}</p>
                          {activeStep === step.id && (
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                              <p className="text-sm text-gray-700">
                                <span className="font-semibold">💡 Pro Tip:</span> {step.tip}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Cart Summary */}
                <div className="card p-6">
                  <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Selected Items:</span>
                      <span className="font-semibold text-gray-900">{selectedIngredients.size}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Servings:</span>
                      <span className="font-semibold text-gray-900">{servings}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between">
                      <span className="font-semibold text-lg">Total:</span>
                      <span className="font-bold text-2xl text-primary-600">
                        ${totalCost.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={addToCart}
                    disabled={selectedIngredients.size === 0}
                    className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiShoppingCart />
                    <span>Add to Cart</span>
                  </button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    Free delivery on orders over $50
                  </p>
                </div>

                {/* Nutrition Info */}
                <div className="card p-6">
                  <h3 className="text-xl font-bold mb-4">Nutrition (per serving)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-primary-600">{recipe.nutrition.calories}</div>
                      <div className="text-sm text-gray-600">Calories</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-primary-600">{recipe.nutrition.protein}g</div>
                      <div className="text-sm text-gray-600">Protein</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-primary-600">{recipe.nutrition.carbs}g</div>
                      <div className="text-sm text-gray-600">Carbs</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-primary-600">{recipe.nutrition.fat}g</div>
                      <div className="text-sm text-gray-600">Fat</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
