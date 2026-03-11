import { useState, useEffect } from 'react'
import Head from 'next/head'
import AdminLayout from '@/components/admin/AdminLayout'
import ProtectedRoute from '@/components/admin/ProtectedRoute'
import { FiPlus, FiDownload, FiUpload, FiSearch, FiEdit2, FiTrash2, FiClock, FiCheckCircle, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'
import Image from 'next/image'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-441546178642.us-central1.run.app'

export default function AdminProducts() {
    const [products, setProducts] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [isUploading, setIsUploading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [currentProduct, setCurrentProduct] = useState<any>(null)
    const [formData, setFormData] = useState({
        name: '',
        category: 'frozen',
        basePrice: '',
        description: '',
        image: 'https://storage.googleapis.com/bluecrate-assets/placeholders/coming-soon.jpg'
    })

    const fetchProducts = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`${API_URL}/api/products`)
            const data = await response.json()
            setProducts(data)
        } catch (error) {
            console.error('Fetch error:', error)
            toast.error('Failed to load products')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const handleDownloadTemplate = async () => {
        try {
            window.open(`${API_URL}/api/products/template/download`, '_blank')
        } catch (error) {
            toast.error('Failed to download template')
        }
    }

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        const formData = new FormData()
        // We'll parse CSV on client side or send to a new endpoint. 
        // For simplicity and speed, let's parse on client side and send JSON to bulk-upload.
        const reader = new FileReader()
        reader.onload = async (e) => {
            const text = e.target?.result as string
            const lines = text.split('\n')
            const headers = lines[0].split(',')
            const jsonData = lines.slice(1).filter(l => l.trim()).map(line => {
                const values = line.split(',')
                const obj: any = {}
                headers.forEach((header, i) => {
                    obj[header.trim()] = values[i]?.trim()
                })
                return obj
            })

            // Map CSV to Product Entity structure
            const formattedProducts = jsonData.map(item => ({
                name: item.Size && item.Size !== '-' ? `${item.Name} - ${item.Size}` : item.Name,
                description: `${item.Category} | ${item['Sub-Category']} | Weight: ${item.Weight} | Pack Size: ${item['UnitPack']}`,
                image: 'https://storage.googleapis.com/bluecrate-assets/placeholders/coming-soon.jpg',
                category: (item.Tags || '').toLowerCase().includes('fresh meat') ? 'meat' :
                    (item.Tags || '').toLowerCase().includes('5 min') ? '5min' :
                        (item.Tags || '').toLowerCase().includes('10 min') ? '10min' : 'frozen',
                basePrice: parseFloat(item.PackPricing) || 0,
                unit: item.UnitPack,
                tags: [item.Storage, item.Category, item['Sub-Category']],
                isApproved: true,
                status: 'approved'
            }))

            try {
                const token = localStorage.getItem('token')
                const response = await fetch(`${API_URL}/api/products/bulk-upload`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(formattedProducts)
                })

                if (response.ok) {
                    toast.success(`Successfully uploaded ${formattedProducts.length} products`)
                    fetchProducts()
                } else {
                    toast.error('Bulk upload failed')
                }
            } catch (error) {
                toast.error('Error during upload')
            } finally {
                setIsUploading(false)
            }
        }
        reader.readAsText(file)
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this product?')) return

        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`${API_URL}/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.ok) {
                toast.success('Product deleted')
                setProducts(products.filter(p => p.id !== id))
            } else {
                toast.error('Delete failed')
            }
        } catch (error) {
            toast.error('Error deleting product')
        }
    }

    const handleOpenModal = (product: any = null) => {
        if (product) {
            setIsEditing(true)
            setCurrentProduct(product)
            setFormData({
                name: product.name,
                category: product.category,
                basePrice: product.basePrice.toString(),
                description: product.description || '',
                image: product.image
            })
        } else {
            setIsEditing(false)
            setCurrentProduct(null)
            setFormData({
                name: '',
                category: 'frozen',
                basePrice: '',
                description: '',
                image: 'https://storage.googleapis.com/bluecrate-assets/placeholders/coming-soon.jpg'
            })
        }
        setIsModalOpen(true)
    }

    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault()
        const token = localStorage.getItem('token')
        const method = isEditing ? 'PUT' : 'POST'
        const url = isEditing ? `${API_URL}/api/products/${currentProduct.id}` : `${API_URL}/api/products`

        const payload = {
            ...formData,
            basePrice: parseFloat(formData.basePrice) || 0,
            isApproved: true,
            status: 'approved'
        }

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            })

            if (response.ok) {
                toast.success(isEditing ? 'Product updated' : 'Product created')
                setIsModalOpen(false)
                fetchProducts()
            } else {
                toast.error(isEditing ? 'Update failed' : 'Creation failed')
            }
        } catch (error) {
            toast.error('Error saving product')
        }
    }

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <ProtectedRoute>
            <AdminLayout>
                <Head>
                    <title>Manage Products - BlueCrate Admin</title>
                </Head>

                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 text-left">Product Inventory</h1>
                        <p className="text-gray-600 mt-1 text-left">View and manage all {products.length} items in your catalog.</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={handleDownloadTemplate}
                            className="btn-secondary flex items-center space-x-2 px-4"
                        >
                            <FiDownload />
                            <span>Template</span>
                        </button>
                        <label className="btn-secondary flex items-center space-x-2 px-4 cursor-pointer">
                            <FiUpload />
                            <span>{isUploading ? 'Uploading...' : 'Bulk Upload'}</span>
                            <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload} disabled={isUploading} />
                        </label>
                        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center space-x-2">
                            <FiPlus />
                            <span>Add Product</span>
                        </button>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center">
                    <div className="relative flex-grow">
                        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, category, or ID..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-primary-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {isLoading ? (
                        <div className="p-20 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
                            <p className="mt-4 text-gray-500">Loading inventory...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Product</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Category</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Price</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Stock/Status</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="h-12 w-12 rounded-lg bg-gray-100 flex-shrink-0 relative overflow-hidden">
                                                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-bold text-gray-900">{product.name}</div>
                                                        <div className="text-xs text-gray-500">ID: BCF-{product.id.toString().padStart(3, '0')}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-md text-xs font-medium ${product.category === 'meat' ? 'bg-red-100 text-red-700' :
                                                    product.category === 'frozen' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-green-100 text-green-700'
                                                    }`}>
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-gray-900">
                                                ₹{product.basePrice}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center text-sm text-green-600 font-medium">
                                                    <FiCheckCircle className="mr-2" />
                                                    <span>Active</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleOpenModal(product)}
                                                    className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                                                >
                                                    <FiEdit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                                >
                                                    <FiTrash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredProducts.length === 0 && (
                                <div className="p-20 text-center text-gray-500">
                                    No products found matching your search.
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {/* Product Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {isEditing ? 'Edit Product' : 'Add New Product'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <FiX className="w-6 h-6" />
                                </button>
                            </div>
                            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Product Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder="Enter product name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Category</label>
                                        <select
                                            className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-primary-500"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option value="frozen">Frozen</option>
                                            <option value="5min">5 Mins</option>
                                            <option value="10min">10 Mins</option>
                                            <option value="meat">Meat</option>
                                            <option value="dessert">Dessert</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Price (₹)</label>
                                        <input
                                            type="number"
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-primary-500"
                                            placeholder="0.00"
                                            value={formData.basePrice}
                                            onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Description</label>
                                    <textarea
                                        rows={3}
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder="Optional product description..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Image URL</label>
                                    <input
                                        type="url"
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder="https://..."
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    />
                                </div>
                                <div className="pt-4 flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-bold"
                                    >
                                        {isEditing ? 'Save Changes' : 'Create Product'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </AdminLayout>
        </ProtectedRoute>
    )
}
