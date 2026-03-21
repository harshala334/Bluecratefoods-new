import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import ProtectedRoute from '@/components/admin/ProtectedRoute'
import { FiBox, FiUsers, FiDollarSign, FiArrowUpRight } from 'react-icons/fi'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function AdminDashboard() {
    const [productsCount, setProductsCount] = useState<number | string>('...')
    const [isLoading, setIsLoading] = useState(true)

    // Get user from localStorage
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    const user = userStr ? JSON.parse(userStr) : null;
    const userType = user?.userType || 'admin';
    const userName = user?.name || 'Admin';

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true)
            try {
                const token = localStorage.getItem('token')
                const response = await fetch(`${API_URL}/api/products?admin=true`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                const data = await response.json()
                if (Array.isArray(data)) {
                    setProductsCount(data.length)
                }
            } catch (error) {
                console.error('Dashboard fetch error:', error)
                setProductsCount(0)
            } finally {
                setIsLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

    const stats = [
        { name: 'Total Products', value: productsCount.toString(), icon: FiBox, color: 'bg-blue-500' },
        { name: 'Active Orders', value: '0', icon: FiArrowUpRight, color: 'bg-green-500' },
        { name: 'Total Revenue', value: '₹0', icon: FiDollarSign, color: 'bg-purple-500' },
        { name: 'Active Users', value: '9', icon: FiUsers, color: 'bg-orange-500' },
    ]

    return (
        <ProtectedRoute>
            <AdminLayout>
                <Head>
                    <title>Admin Dashboard - BlueCrateFoods</title>
                </Head>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 text-left">Dashboard Overview</h1>
                    <p className="text-gray-600 mt-1 text-left">Welcome back, {userName}. Here&apos;s what&apos;s happening across the platform.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat) => (
                        <Link
                            href={stat.name === 'Total Products' ? '/admin/products' : '#'}
                            key={stat.name}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center hover:shadow-md transition-shadow cursor-pointer"
                        >
                            <div className={`${stat.color} p-4 rounded-lg text-white`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className="ml-5 text-left">
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.name}</p>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-xl font-bold mb-4 text-left">Quick Actions</h2>
                    <div className="flex space-x-4">
                        <Link href="/admin/products" className="btn-primary">Manage Products</Link>
                        <button className="btn-secondary px-6">Review Orders</button>
                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors">Generate Report</button>
                    </div>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    )
}
