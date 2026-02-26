import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Layout from '@/components/Layout'
import { FiStar, FiClock, FiMapPin, FiPlus, FiMinus } from 'react-icons/fi'
import { useCartStore } from '@/stores/cartStore'
import toast from 'react-hot-toast'
import * as fpixel from '@/utils/fpixel'

export default function RestaurantDetail() {
  const router = useRouter()
  const { id } = router.query
  const addItem = useCartStore((state) => state.addItem)

  // Mock data - will be replaced with API call
  const restaurant = {
    id: id as string,
    name: 'Pizza Paradise',
    cuisine: 'Italian',
    rating: 4.8,
    reviews: 250,
    deliveryTime: '25-35 min',
    deliveryFee: 2.99,
    address: '123 Main St, City, State',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
    description: 'Authentic Italian pizza made with fresh ingredients and traditional recipes.',
  }

  const menuItems = [
    {
      id: '1',
      name: 'Margherita Pizza',
      description: 'Classic tomato sauce, mozzarella, and fresh basil',
      price: 12.99,
      image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=300',
      category: 'Pizza',
    },
    {
      id: '2',
      name: 'Pepperoni Pizza',
      description: 'Loaded with pepperoni and extra cheese',
      price: 14.99,
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300',
      category: 'Pizza',
    },
    {
      id: '3',
      name: 'Caesar Salad',
      description: 'Crisp romaine lettuce with Caesar dressing',
      price: 8.99,
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300',
      category: 'Salads',
    },
    {
      id: '4',
      name: 'Garlic Bread',
      description: 'Toasted bread with garlic butter and herbs',
      price: 5.99,
      image: 'https://images.unsplash.com/photo-1573140401552-3fab0b24306f?w=300',
      category: 'Sides',
    },
    {
      id: '5',
      name: 'Tiramisu',
      description: 'Classic Italian dessert with coffee and mascarpone',
      price: 6.99,
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300',
      category: 'Desserts',
    },
    {
      id: '6',
      name: 'Veggie Supreme',
      description: 'Loaded with fresh vegetables and cheese',
      price: 13.99,
      image: 'https://images.unsplash.com/photo-1511689660979-10d2b1aada49?w=300',
      category: 'Pizza',
    },
  ]

  const categories = Array.from(new Set(menuItems.map((item) => item.category)))
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredItems = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter((item) => item.category === selectedCategory)

  const handleAddToCart = (item: typeof menuItems[0]) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
    })
    toast.success(`${item.name} added to cart!`)

    fpixel.event('AddToCart', {
      content_name: item.name,
      content_ids: [item.id],
      content_type: 'product',
      value: item.price,
      currency: 'USD'
    })
  }

  return (
    <Layout>
      <Head>
        <title>{restaurant.name} - BlueCrateFoods</title>
        <meta name="description" content={restaurant.description} />
      </Head>

      <div className="bg-gray-50 min-h-screen">
        {/* Restaurant Header */}
        <div className="relative h-64 md:h-80">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="container-custom -mt-20 relative z-10">
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="mb-4 md:mb-0">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{restaurant.name}</h1>
                <p className="text-gray-600 mb-3">{restaurant.cuisine}</p>
                <p className="text-gray-700 mb-4">{restaurant.description}</p>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center">
                    <FiStar className="text-yellow-400 fill-current mr-1" />
                    <span className="font-semibold">{restaurant.rating}</span>
                    <span className="text-gray-600 ml-1">({restaurant.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiClock className="mr-1" />
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiMapPin className="mr-1" />
                    <span>{restaurant.address}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-600">Delivery Fee</p>
                <p className="text-2xl font-bold text-primary-600">${restaurant.deliveryFee}</p>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="mb-8">
            <div className="flex overflow-x-auto space-x-4 pb-2">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition ${selectedCategory === 'All'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition ${selectedCategory === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Items */}
          <div className="grid md:grid-cols-2 gap-6 pb-12">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-32 h-32 object-cover"
                  />
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      <p className="text-lg font-bold text-primary-600">${item.price}</p>
                    </div>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="mt-2 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition flex items-center justify-center"
                    >
                      <FiPlus className="mr-1" size={18} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
