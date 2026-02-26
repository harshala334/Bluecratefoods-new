import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { FiClock, FiBookOpen, FiTruck, FiShoppingBag, FiStar, FiArrowRight, FiCheck, FiX, FiDownload, FiSmartphone, FiDollarSign, FiTarget, FiUsers, FiMail, FiChevronDown } from 'react-icons/fi';
import { GiCookingPot, GiMeal } from 'react-icons/gi';
import { HiSparkles } from 'react-icons/hi2';
import Image from 'next/image';
import * as fpixel from '@/utils/fpixel';

export default function D2C() {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [downloadForm, setDownloadForm] = useState({
    name: '',
    phone: '',
    email: '',
    preferredApp: 'both' // 'user', 'partner', 'both'
  });
  const [showFloatingScroll, setShowFloatingScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const footerHeight = 400;

      // Show after scrolling past the hero section (at least 50% of viewport)
      const shouldShow = scrollY > windowHeight * 0.5;

      // Hide when near footer or no more content below
      const scrollBottom = scrollY + windowHeight;
      const remainingContent = documentHeight - scrollBottom;
      const isNearFooter = remainingContent < footerHeight;
      const hasMoreContent = remainingContent > 200; // At least 200px more content

      setShowFloatingScroll(shouldShow && !isNearFooter && hasMoreContent);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDownloadFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    console.log('Download form submitted:', downloadForm);
    // You can add API call here to send SMS/email with download links
    fpixel.event('Lead', { content_name: 'App Download Interest' });
    alert('Download links will be sent to your phone and email!');
    setIsDownloadModalOpen(false);
    setDownloadForm({ name: '', phone: '', email: '', preferredApp: 'both' });
  };

  const categories = [
    {
      id: '1min',
      title: '< 1 Minute',
      description: 'Quick bites & instant recipes',
      time: '< 1 min',
      icon: '⚡',
      color: 'from-white to-gray-50 border-2 border-gray-200',
      textColor: 'text-gray-900',
      dishes: 45
    },
    {
      id: '10min',
      title: '< 10 Minutes',
      description: 'Fast & easy meals',
      time: '< 10 min',
      icon: '🔥',
      color: 'from-white to-gray-50 border-2 border-gray-200',
      textColor: 'text-gray-900',
      dishes: 120
    },
    {
      id: '1hour',
      title: '< 1 Hour',
      description: 'Gourmet experiences',
      time: '< 1 hr',
      icon: '👨‍🍳',
      color: 'from-white to-gray-50 border-2 border-gray-200',
      textColor: 'text-gray-900',
      dishes: 89
    }
  ];

  const features = [
    {
      icon: <FiShoppingBag className="w-8 h-8" />,
      title: 'Browse Dishes',
      description: 'Explore hundreds of delicious recipes by cooking time',
      color: 'bg-primary-50 text-primary-600'
    },
    {
      icon: <FiCheck className="w-8 h-8" />,
      title: 'Select Ingredients',
      description: 'Choose exactly what you need with smart checkboxes',
      color: 'bg-primary-50 text-primary-600'
    },
    {
      icon: <FiTruck className="w-8 h-8" />,
      title: 'Get Delivered',
      description: 'Fresh ingredients delivered right to your door',
      color: 'bg-primary-50 text-primary-600'
    },
    {
      icon: <GiCookingPot className="w-8 h-8" />,
      title: 'Cook with Guidance',
      description: 'Step-by-step instructions with built-in timers',
      color: 'bg-purple-50 text-purple-600'
    }
  ];

  const popularDishes = [
    {
      id: 1,
      name: 'Avocado Toast Supreme',
      image: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=500',
      time: '5 min',
      difficulty: 'Easy',
      servings: 2,
      rating: 4.8,
      ingredients: 6
    },
    {
      id: 2,
      name: 'Creamy Pasta Carbonara',
      image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500',
      time: '25 min',
      difficulty: 'Medium',
      servings: 4,
      rating: 4.9,
      ingredients: 8
    },
    {
      id: 3,
      name: 'Thai Green Curry',
      image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=500',
      time: '35 min',
      difficulty: 'Medium',
      servings: 4,
      rating: 4.7,
      ingredients: 12
    },
    {
      id: 4,
      name: 'Margherita Pizza',
      image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500',
      time: '45 min',
      difficulty: 'Hard',
      servings: 4,
      rating: 4.9,
      ingredients: 10
    }
  ];

  return (
    <Layout>
      <Head>
        <title>D2C - BlueCrateFoods - Ready-to-Cook. Ready-to-Love.</title>
        <meta name="description" content="Get fresh ingredients and cook amazing meals at home" />
      </Head>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-green-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container-custom py-12 lg:py-16 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-7xl font-display font-bold text-gray-900 leading-tight">
                Direct-to-Customer Service
              </h1>

              <p className="text-2xl lg:text-3xl text-primary-600 font-semibold">
                Delicious meals, Ready in Minutes
              </p>

              <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                Browse delicious recipes, select fresh ingredients, and get everything delivered.
                We&apos;ll guide you through every step with timers and cooking tips.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/recipes" className="btn-primary inline-flex items-center space-x-2">
                  <span>Explore Recipes</span>
                  <FiArrowRight />
                </Link>
                {/* <button
                  onClick={() => setIsDownloadModalOpen(true)}
                  className="btn-secondary inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
                >
                  <FiDownload />
                  <span>Download App</span>
                </button> */}
                <button className="btn-secondary inline-flex items-center space-x-2">
                  <FiBookOpen />
                  <span>How It Works</span>
                </button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-gray-900">250+</div>
                  <div className="text-sm text-gray-600">Recipes</div>
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">50K+</div>
                  <div className="text-sm text-gray-600">Happy Cooks</div>
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                <div className="flex items-center space-x-1">
                  <FiStar className="text-yellow-400 fill-current" />
                  <span className="text-3xl font-bold text-gray-900">4.9</span>
                  <div className="text-sm text-gray-600 ml-1">/5.0</div>
                </div>
              </div>
            </div>

            <div className="relative h-[500px] lg:h-[600px]">
              <div className="grid grid-cols-2 gap-4 h-full">
                <div className="space-y-4 flex flex-col">
                  <div className="relative flex-[3] overflow-hidden rounded-2xl shadow-hard">
                    <Image
                      src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=500&fit=crop"
                      alt="Delicious food"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative flex-[2] overflow-hidden rounded-2xl shadow-hard">
                    <Image
                      src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop"
                      alt="Pizza"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8 flex flex-col">
                  <div className="relative flex-[2] overflow-hidden rounded-2xl shadow-hard">
                    <Image
                      src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop"
                      alt="Cooking"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative flex-[3] overflow-hidden rounded-2xl shadow-hard">
                    <Image
                      src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=500&fit=crop"
                      alt="Ingredients"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Benefit Points */}
      <section id="benefits-section" className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">
              Why Choose BlueCrateFoods?
            </h2>
            <p className="text-lg text-gray-600">Transform your cooking experience with these amazing benefits</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl border-2 border-primary-100 hover:border-primary-300 transition-all group hover:shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FiUsers className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 leading-tight">
                Now anyone can cook
              </h3>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl border-2 border-primary-100 hover:border-primary-300 transition-all group hover:shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FiDollarSign className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 leading-tight">
                At less than 50% the cost
              </h3>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl border-2 border-purple-100 hover:border-purple-300 transition-all group hover:shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <HiSparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 leading-tight">
                Cook without the usual hassles
              </h3>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border-2 border-orange-100 hover:border-orange-300 transition-all group hover:shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FiTarget className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 leading-tight">
                Complete control on taste and quality
              </h3>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl border-2 border-rose-100 hover:border-rose-300 transition-all group hover:shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FiClock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 leading-tight">
                Make your food exactly as you want and when you want
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-4">
              Browse by Cooking Time
            </h2>
            <p className="text-xl text-gray-600">Choose recipes that fit your schedule</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/recipes?time=${category.id}`}
                className="group relative"
              >
                <div className={`card p-8 h-full bg-gradient-to-br ${category.color} ${category.textColor} group-hover:shadow-hard group-hover:border-primary-300 transition-all duration-300`}>
                  <div className="text-6xl mb-4">{category.icon}</div>
                  <h3 className="text-3xl font-display font-bold mb-2">{category.title}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-sm font-semibold text-primary-600">{category.dishes} recipes</span>
                    <FiArrowRight className="w-5 h-5 text-primary-600 transform group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-4">
              How BlueCrateFoods Works
            </h2>
            <p className="text-xl text-gray-600">Four simple steps to delicious homemade meals</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className={`${feature.color} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-md`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Dishes */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl lg:text-5xl font-display font-bold mb-4">
                Popular This Week
              </h2>
              <p className="text-xl text-gray-600">Trending recipes our community loves</p>
            </div>
            <Link href="/recipes" className="btn-secondary hidden md:inline-flex items-center space-x-2">
              <span>View All</span>
              <FiArrowRight />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {popularDishes.map((dish) => (
              <Link key={dish.id} href={`/recipes/${dish.id}`} className="card group">
                <div className="relative overflow-hidden">
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                    width={500}
                    height={224}
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md flex items-center space-x-1">
                    <FiStar className="text-yellow-400 fill-current w-4 h-4" />
                    <span className="text-sm font-semibold">{dish.rating}</span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className={`badge ${dish.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                      dish.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                      {dish.difficulty}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary-600 transition-colors">
                    {dish.name}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <FiClock className="w-4 h-4" />
                      <span>{dish.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <GiMeal className="w-4 h-4" />
                      <span>{dish.servings} servings</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">{dish.ingredients} ingredients needed</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-500 to-green-600 text-white">
        <div className="container-custom text-center">
          <GiCookingPot className="w-20 h-20 mx-auto mb-8 opacity-90" />
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
            Ready to Start Cooking?
          </h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            Join thousands of home cooks who are creating restaurant-quality meals with BlueCrateFoods
          </p>
          <Link href="/recipes" className="inline-flex items-center space-x-2 px-10 py-5 bg-white text-primary-600 rounded-xl font-bold text-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
            <span>Browse Recipes</span>
            <FiArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Download App Modal */}
      {isDownloadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-green-600 rounded-xl flex items-center justify-center">
                    <FiSmartphone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Download Our Apps</h3>
                    <p className="text-sm text-gray-600">Get the best cooking experience</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDownloadModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <FiX className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* App Options */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Choose your app:</h4>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setDownloadForm({ ...downloadForm, preferredApp: 'user' })}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${downloadForm.preferredApp === 'user'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="text-2xl mb-1">🍽️</div>
                    <div className="text-xs font-medium">User App</div>
                  </button>
                  <button
                    onClick={() => setDownloadForm({ ...downloadForm, preferredApp: 'partner' })}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${downloadForm.preferredApp === 'partner'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="text-2xl mb-1">🚚</div>
                    <div className="text-xs font-medium">Partner App</div>
                  </button>
                  <button
                    onClick={() => setDownloadForm({ ...downloadForm, preferredApp: 'both' })}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${downloadForm.preferredApp === 'both'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="text-2xl mb-1">📱</div>
                    <div className="text-xs font-medium">Both Apps</div>
                  </button>
                </div>
              </div>

              {/* Download Form */}
              <form onSubmit={handleDownloadFormSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={downloadForm.name}
                    onChange={(e) => setDownloadForm({ ...downloadForm, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={downloadForm.phone}
                    onChange={(e) => setDownloadForm({ ...downloadForm, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="+91 9591890828"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={downloadForm.email}
                    onChange={(e) => setDownloadForm({ ...downloadForm, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="your@email.com"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary-500 to-green-600 text-white py-4 rounded-xl font-bold text-lg hover:from-primary-600 hover:to-green-700 transition-all transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center space-x-2"
                  >
                    <FiDownload className="w-5 h-5" />
                    <span>Send Download Links</span>
                  </button>
                </div>
              </form>

              <p className="text-xs text-gray-500 mt-4 text-center">
                We&apos;ll send you download links via SMS and email. No spam, we promise! 📱
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Enquiry Button */}
      <Link
        href="/coming-soon"
        className="fixed right-0 top-1/2 -translate-y-1/2 bg-primary-600 text-white px-4 py-8 rounded-l-xl font-bold shadow-lg hover:bg-primary-700 transition-all hover:px-6 z-40 flex items-center space-x-2"
        style={{ writingMode: 'vertical-rl' }}
      >
        <span className="text-lg">DOWNLOAD APP</span>
      </Link>

    </Layout>
  );
}
