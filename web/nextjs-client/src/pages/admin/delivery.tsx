import { useState, useEffect } from 'react'
import Head from 'next/head'
import AdminLayout from '@/components/admin/AdminLayout'
import ProtectedRoute from '@/components/admin/ProtectedRoute'
import { FiCheck, FiX, FiClock, FiTruck, FiUser, FiPhone, FiMail } from 'react-icons/fi'
import toast from 'react-hot-toast'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-441546178642.us-central1.run.app'

interface DriverApplication {
    id: number
    name: string
    email: string
    phone: string
    vehicleType: string
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
    createdAt: string
}

export default function AdminDelivery() {
    const [applications, setApplications] = useState<DriverApplication[]>([])
    const [loading, setLoading] = useState(true)

    const fetchApplications = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`${API_URL}/api/delivery/applications`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.ok ? await res.json() : []
                setApplications(data)
            }
        } catch (error) {
            console.error('Failed to fetch applications:', error)
            toast.error('Failed to load applications')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchApplications()
    }, [])

    const handleAction = async (id: number, action: 'approve' | 'reject') => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`${API_URL}/api/delivery/applications/${id}/${action}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            })

            if (res.ok) {
                toast.success(`Application ${action}ed successfully`)
                fetchApplications()
            } else {
                const err = await res.json()
                toast.error(err.message || `Failed to ${action} application`)
            }
        } catch (error) {
            toast.error(`Error during ${action}`)
        }
    }

    return (
        <ProtectedRoute>
            <AdminLayout>
                <Head>
                    <title>Delivery Partners | BlueCrate Admin</title>
                </Head>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Delivery Partners</h1>
                    <p className="mt-2 text-gray-600">Review and approve new driver applications for Shipday network.</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Driver Details</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Vehicle</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Applied Date</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-500">Loading applications...</td></tr>
                                ) : applications.length === 0 ? (
                                    <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-500">No applications found</td></tr>
                                ) : (
                                    applications.map((app) => (
                                        <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-gray-900 flex items-center gap-2">
                                                        <FiUser className="text-gray-400" /> {app.name}
                                                    </span>
                                                    <span className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                                        <FiMail className="text-gray-400" /> {app.email}
                                                    </span>
                                                    <span className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                                        <FiPhone className="text-gray-400" /> {app.phone}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    <FiTruck className="mr-1" /> {app.vehicleType || 'Not specified'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(app.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${app.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                    app.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {app.status === 'PENDING' && (
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleAction(app.id, 'approve')}
                                                            className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                                            title="Approve"
                                                        >
                                                            <FiCheck className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction(app.id, 'reject')}
                                                            className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                            title="Reject"
                                                        >
                                                            <FiX className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    )
}
