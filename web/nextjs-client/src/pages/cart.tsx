import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { useCartStore } from '@/stores/cartStore'
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi'
import * as fpixel from '@/utils/fpixel'

export default function Cart() {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore()

  const subtotal = getTotalPrice()
  const deliveryFee = items.length > 0 ? 2.99 : 0
  const tax = subtotal * 0.1
  const total = subtotal + deliveryFee + tax

  if (items.length === 0) {
    return (
      <Layout>
        <Head>
          <title>Cart - BlueCrateFoods</title>
        </Head>

        <div className="container-custom py-20">
          <div className="text-center">
            <FiShoppingBag className="mx-auto text-gray-300" size={100} />
            <h1 className="text-3xl font-bold mt-6 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Add some delicious items to get started!</p>
            <Link href="/restaurants" className="btn-primary inline-block">
              Browse Restaurants
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <Head>
        <title>Cart - BlueCrateFoods</title>
      </Head>

      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-8">Your Cart</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">
                    {items.length} Item{items.length !== 1 ? 's' : ''}
                  </h2>
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Clear Cart
                  </button>
                </div>

                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{item.restaurantName}</p>
                        <p className="text-primary-600 font-bold">${item.price.toFixed(2)}</p>
                      </div>

                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <FiTrash2 size={20} />
                        </button>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            <FiMinus size={16} />
                          </button>
                          <span className="font-semibold min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            <FiPlus size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Link href="/restaurants" className="inline-block mt-6 text-primary-600 hover:text-primary-700 font-medium">
                ← Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary-600">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="btn-primary w-full text-center block"
                  onClick={() => {
                    fpixel.event('InitiateCheckout', {
                      value: total,
                      currency: 'USD',
                      num_items: items.length
                    })
                  }}
                >
                  Proceed to Checkout
                </Link>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  Taxes and shipping calculated at checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
