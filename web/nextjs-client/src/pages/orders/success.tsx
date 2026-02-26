import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { FiCheckCircle, FiClock, FiTruck } from 'react-icons/fi'

export default function OrderSuccess() {
  const orderId = 'BC' + Math.floor(Math.random() * 1000000)

  return (
    <Layout>
      <Head>
        <title>Order Confirmed - BlueCrateFoods</title>
      </Head>

      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-6">
                <FiCheckCircle size={40} />
              </div>

              <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
              <p className="text-gray-600 mb-6">
                Thank you for your order. We&apos;re preparing your food.
              </p>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <p className="text-sm text-gray-600 mb-1">Order ID</p>
                <p className="text-2xl font-bold text-primary-600">#{orderId}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full mb-3">
                    <FiCheckCircle size={24} />
                  </div>
                  <h3 className="font-semibold mb-1">Order Placed</h3>
                  <p className="text-sm text-gray-600">Just now</p>
                </div>

                <div className="text-center opacity-50">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-200 text-gray-500 rounded-full mb-3">
                    <FiClock size={24} />
                  </div>
                  <h3 className="font-semibold mb-1">Preparing</h3>
                  <p className="text-sm text-gray-600">15-20 min</p>
                </div>

                <div className="text-center opacity-50">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-200 text-gray-500 rounded-full mb-3">
                    <FiTruck size={24} />
                  </div>
                  <h3 className="font-semibold mb-1">On the Way</h3>
                  <p className="text-sm text-gray-600">25-35 min</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={`/orders/${orderId}`} className="btn-primary">
                  Track Order
                </Link>
                <Link href="/restaurants" className="btn-secondary">
                  Order Again
                </Link>
              </div>

              <p className="text-sm text-gray-500 mt-6">
                We&apos;ve sent a confirmation email with order details
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
