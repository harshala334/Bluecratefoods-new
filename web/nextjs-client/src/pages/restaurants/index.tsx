import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { FiStar, FiClock, FiSearch, FiFilter } from 'react-icons/fi'

export default function Restaurants() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'Italian', 'Chinese', 'Indian', 'Mexican', 'Japanese', 'American']

  const restaurants = [
    {
      id: '1',
      name: 'Pizza Paradise',
      cuisine: 'Italian',
      rating: 4.8,
      reviews: 250,
      deliveryTime: '25-35 min',
      deliveryFee: 2.99,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
      featured: true,
    },
    {
      id: '2',
      name: 'Burger House',
      cuisine: 'American',
      rating: 4.6,
      reviews: 180,
      deliveryTime: '20-30 min',
      deliveryFee: 1.99,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
      featured: true,
    },
    {
      id: '3',
      name: 'Sushi Master',
      cuisine: 'Japanese',
      rating: 4.9,
      reviews: 320,
      deliveryTime: '30-40 min',
      deliveryFee: 3.99,
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
      featured: false,
    },
    {
      id: '4',
      name: 'Taco Fiesta',
      cuisine: 'Mexican',
      rating: 4.7,
      reviews: 200,
      deliveryTime: '15-25 min',
      deliveryFee: 2.49,
      image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
      featured: true,
    },
    {
      id: '5',
      name: 'Noodle House',
      cuisine: 'Chinese',
      rating: 4.5,
      reviews: 150,
      deliveryTime: '20-30 min',
      deliveryFee: 1.99,
      image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400',
      featured: false,
    },
    {
      id: '6',
      name: 'Curry Palace',
      cuisine: 'Indian',
      rating: 4.8,
      reviews: 280,
      deliveryTime: '25-35 min',
      deliveryFee: 2.99,
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
      featured: false,
    },
  ]

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || restaurant.cuisine === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <Layout>
      <Head>
        <title>Restaurants - BlueCrateFoods</title>
        <meta name="description" content="Browse restaurants and order food" />
      </Head>

      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="container-custom py-8">
            <h1 className="text-4xl font-bold mb-6">All Restaurants</h1>
            
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search restaurants or cuisines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <button className="btn-secondary flex items-center justify-center">
                <FiFilter className="mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>

        <div className="container-custom py-8">
          {/* Category Tabs */}
          <div className="mb-8">
            <div className="flex overflow-x-auto space-x-4 pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition ${
                    selectedCategory === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <p className="text-gray-600 mb-6">
            {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? 's' : ''} found
          </p>

          {/* Restaurant Grid */}
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <Link href={`/restaurants/${restaurant.id}`} key={restaurant.id}>
                <div className="card cursor-pointer">
                  <div className="relative h-48">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                    {restaurant.featured && (
                      <div className="absolute top-3 left-3 bg-accent-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Featured
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full flex items-center space-x-1">
                      <FiStar className="text-yellow-400 fill-current" size={16} />
                      <span className="font-semibold text-sm">{restaurant.rating}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-1">{restaurant.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{restaurant.cuisine} • {restaurant.reviews} reviews</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <FiClock className="mr-1" size={14} />
                        <span>{restaurant.deliveryTime}</span>
                      </div>
                      <span className="font-medium">${restaurant.deliveryFee} delivery</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredRestaurants.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No restaurants found. Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
