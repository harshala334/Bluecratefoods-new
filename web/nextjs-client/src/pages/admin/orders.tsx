import { useState, useEffect } from 'react'
import Head from 'next/head'
import AdminLayout from '@/components/admin/AdminLayout'
import ProtectedRoute from '@/components/admin/ProtectedRoute'
import { FiShoppingBag, FiClock, FiCheck, FiX, FiTruck, FiUser, FiPhone } from 'react-icons/fi'
import toast from 'react-hot-toast'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-920625255147.us-central1.run.app'

interface OrderItem {
    id: string
    name: string
    quantity: number
    price: number
}

interface Order {
    id: string
    userId: string
    totalAmount: number
    status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY_FOR_PICKUP' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED'
    createdAt: string
    items: OrderItem[]
    customerName?: string
    customerPhone?: string
    customerAddress?: string
}

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token')
            // Using store-1 as default for now
            const res = await fetch(`${API_URL}/api/orders/store/store-1`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setOrders(data)
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error)
            toast.error('Failed to load orders')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    const handleUpdateStatus = async (orderId: string, status: string) => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            })

            if (res.ok) {
                toast.success(`Order marked as ${status}`)
                fetchOrders()
            } else {
                toast.error('Failed to update order status')
            }
        } catch (error) {
            toast.error('Error updating order')
        }
    }

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            PENDING: 'bg-yellow-100 text-yellow-700',
            CONFIRMED: 'bg-blue-100 text-blue-700',
            PREPARING: 'bg-orange-100 text-orange-700',
            READY_FOR_PICKUP: 'bg-purple-100 text-purple-700',
            OUT_FOR_DELIVERY: 'bg-indigo-100 text-indigo-700',
            DELIVERED: 'bg-green-100 text-green-700',
            CANCELLED: 'bg-red-100 text-red-700',
        }
        return `px-3 py-1 rounded-full text-xs font-bold ${styles[status] || 'bg-gray-100 text-gray-700'}`
    }

    return (
        <ProtectedRoute>
            <AdminLayout>
                <Head>
                    <title>Orders Management | BlueCrate Admin</title>
                </Head>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
                    <p className="mt-2 text-gray-600">Review and manage customer orders across the platform.</p>
                </div>

                <div className="space-y-6">
                    {loading ? (
                        <div className="text-center py-12 text-gray-500">Loading orders...</div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                            No orders found.
                        </div>
                    ) : (
                        orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-sm font-mono font-bold text-gray-400">#{order.id.slice(-6).toUpperCase()}</span>
                                            <span className={getStatusBadge(order.status)}>{order.status}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500 gap-4">
                                            <span className="flex items-center gap-1"><FiClock /> {new Date(order.createdAt).toLocaleString()}</span>
                                            <span className="font-bold text-gray-900">₹{order.totalAmount}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {order.status === 'PENDING' && (
                                            <button
                                                onClick={() => handleUpdateStatus(order.id, 'CONFIRMED')}
                                                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-bold text-sm"
                                            >
                                                <FiCheck /> Confirm Order
                                            </button>
                                        )}
                                        {['CONFIRMED', 'PREPARING'].includes(order.status) && (
                                            <button
                                                onClick={() => handleUpdateStatus(order.id, order.status === 'CONFIRMED' ? 'PREPARING' : 'READY_FOR_PICKUP')}
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold text-sm"
                                            >
                                                Next Stage
                                            </button>
                                        )}
                                        {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                                            <button
                                                onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                                                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-bold text-sm"
                                            >
                                                <FiX /> Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Items */}
                                    <div className="lg:col-span-2">
                                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Order Items</h3>
                                        <div className="space-y-2">
                                            {order.items?.map((item, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-8 h-8 rounded bg-white flex items-center justify-center text-xs font-bold text-gray-400 border">{item.quantity}x</span>
                                                        <span className="font-medium text-gray-900">{item.name}</span>
                                                    </div>
                                                    <span className="font-bold text-gray-600">₹{item.price * item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Customer Info */}
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <FiUser /> Customer Details
                                        </h3>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-xs text-gray-400 font-bold uppercase tracking-tight">Name</p>
                                                <p className="text-gray-900 font-medium">{order.customerName || 'Test User'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 font-bold uppercase tracking-tight">Contact</p>
                                                <p className="text-gray-900 font-medium flex items-center gap-2"><FiPhone className="text-gray-400" /> {order.customerPhone || '9876543210'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 font-bold uppercase tracking-tight">Delivery Address</p>
                                                <p className="text-gray-600 text-sm">{order.customerAddress || '123, Green Street, Blue Crate Apartments'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </AdminLayout>
        </ProtectedRoute>
    )
}
