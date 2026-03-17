import Link from 'next/link'
import { useRouter } from 'next/router'
import { FiBox, FiHome, FiBarChart2, FiUsers, FiLogOut, FiMenu, FiX, FiTruck } from 'react-icons/fi'
import { useState } from 'react'

interface AdminLayoutProps {
    children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const router = useRouter()
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    const menuItems = [
        { name: 'Dashboard', icon: FiHome, href: '/admin/dashboard' },
        { name: 'Orders', icon: FiBox, href: '/admin/orders' },
        { name: 'Products', icon: FiBox, href: '/admin/products' },
        { name: 'Analytics', icon: FiBarChart2, href: '/admin/analytics' },
        { name: 'Users', icon: FiUsers, href: '/admin/users' },
        { name: 'Delivery Partners', icon: FiTruck, href: '/admin/delivery' },
    ]

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/login')
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-xl transition-all duration-300 flex flex-col`}>
                <div className="p-6 border-b flex items-center justify-between">
                    <Link href="/" className="flex items-center">
                        <span className={`font-bold text-2xl text-primary-600 ${!isSidebarOpen && 'hidden'}`}>BlueCrate Admin</span>
                        {!isSidebarOpen && <span className="font-bold text-2xl text-primary-600">B</span>}
                    </Link>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden">
                        <FiMenu className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex-grow p-4 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = router.pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <item.icon className="w-6 h-6" />
                                <span className={`ml-4 font-medium ${!isSidebarOpen && 'hidden'}`}>{item.name}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <FiLogOut className="w-6 h-6" />
                        <span className={`ml-4 font-medium ${!isSidebarOpen && 'hidden'}`}>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow overflow-auto p-8">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
