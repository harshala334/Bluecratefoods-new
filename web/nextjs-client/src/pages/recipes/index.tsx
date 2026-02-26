import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { FiClock, FiStar, FiFilter, FiSearch } from 'react-icons/fi';
import { GiMeal } from 'react-icons/gi';

export default function RecipesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  const timeFilters = [
    { id: 'all', label: 'All Recipes', value: null },
    { id: '1min', label: '< 1 min', value: '1min' },
    { id: '10min', label: '< 10 min', value: '10min' },
    { id: '1hour', label: '< 1 hour', value: '1hour' },
  ];

  const difficultyFilters = ['All', 'Easy', 'Medium', 'Hard'];

  const recipes = [
    {
      id: 1,
      name: 'Avocado Toast Supreme',
      image: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=500',
      time: '5 min',
      difficulty: 'Easy',
      servings: 2,
      rating: 4.8,
      ingredients: 6,
      category: '10min',
    },
    {
      id: 2,
      name: 'Classic Smoothie Bowl',
      image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500',
      time: '3 min',
      difficulty: 'Easy',
      servings: 1,
      rating: 4.6,
      ingredients: 5,
      category: '10min',
    },
    {
      id: 3,
      name: 'Creamy Pasta Carbonara',
      image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500',
      time: '25 min',
      difficulty: 'Medium',
      servings: 4,
      rating: 4.9,
      ingredients: 8,
      category: '1hour',
    },
    {
      id: 4,
      name: 'Thai Green Curry',
      image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=500',
      time: '35 min',
      difficulty: 'Medium',
      servings: 4,
      rating: 4.7,
      ingredients: 12,
      category: '1hour',
    },
    {
      id: 5,
      name: 'Margherita Pizza',
      image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500',
      time: '45 min',
      difficulty: 'Hard',
      servings: 4,
      rating: 4.9,
      ingredients: 10,
      category: '1hour',
    },
    {
      id: 6,
      name: 'Grilled Chicken Salad',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500',
      time: '15 min',
      difficulty: 'Easy',
      servings: 2,
      rating: 4.5,
      ingredients: 9,
      category: '10min',
    },
    {
      id: 7,
      name: 'Beef Tacos',
      image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500',
      time: '20 min',
      difficulty: 'Easy',
      servings: 4,
      rating: 4.8,
      ingredients: 11,
      category: '1hour',
    },
    {
      id: 8,
      name: 'Vegetable Stir Fry',
      image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500',
      time: '12 min',
      difficulty: 'Easy',
      servings: 3,
      rating: 4.4,
      ingredients: 8,
      category: '10min',
    },
  ];

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTime = !selectedTime || recipe.category === selectedTime;
    const matchesDifficulty = !selectedDifficulty || selectedDifficulty === 'All' || recipe.difficulty === selectedDifficulty;
    return matchesSearch && matchesTime && matchesDifficulty;
  });

  return (
    <Layout>
      <Head>
        <title>Browse Recipes - BlueCrateFoods</title>
        <meta name="description" content="Explore delicious recipes and get fresh ingredients delivered" />
      </Head>

      {/* Header */}
      <section className="bg-gradient-to-br from-primary-500 to-green-600 text-white py-16">
        <div className="container-custom">
          <h1 className="text-5xl font-display font-bold mb-4">
            Explore Recipes
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Choose a dish, select your ingredients, and start cooking
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl bg-white rounded-xl p-2 flex items-center shadow-lg">
            <FiSearch className="text-gray-400 ml-3" size={24} />
            <input
              type="text"
              placeholder="Search for recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-3 text-gray-900 outline-none"
            />
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container-custom py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2 text-gray-700 font-medium">
              <FiFilter />
              <span>Filters:</span>
            </div>

            {/* Time Filters */}
            <div className="flex items-center space-x-2">
              {timeFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedTime(filter.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedTime === filter.value
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="w-px h-8 bg-gray-200"></div>

            {/* Difficulty Filters */}
            <div className="flex items-center space-x-2">
              {difficultyFilters.map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty === 'All' ? null : difficulty)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${(difficulty === 'All' && !selectedDifficulty) || selectedDifficulty === difficulty
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recipe Grid */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="mb-6">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredRecipes.length}</span> recipes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredRecipes.map((recipe) => (
              <Link key={recipe.id} href={`/recipes/${recipe.id}`} className="card group">
                <div className="relative overflow-hidden">
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md flex items-center space-x-1">
                    <FiStar className="text-yellow-400 fill-current w-4 h-4" />
                    <span className="text-sm font-semibold">{recipe.rating}</span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span
                      className={`badge ${recipe.difficulty === 'Easy'
                          ? 'bg-green-100 text-green-700'
                          : recipe.difficulty === 'Medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                    >
                      {recipe.difficulty}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary-600 transition-colors">
                    {recipe.name}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <FiClock className="w-4 h-4" />
                      <span>{recipe.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <GiMeal className="w-4 h-4" />
                      <span>{recipe.servings} servings</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">{recipe.ingredients} ingredients needed</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredRecipes.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No recipes found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters or search term</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTime(null);
                  setSelectedDifficulty(null);
                }}
                className="btn-primary"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
