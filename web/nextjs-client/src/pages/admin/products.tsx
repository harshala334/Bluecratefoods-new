import { useState, useEffect } from 'react'
import Head from 'next/head'
import AdminLayout from '@/components/admin/AdminLayout'
import ProtectedRoute from '@/components/admin/ProtectedRoute'
import { FiPlus, FiDownload, FiUpload, FiSearch, FiEdit2, FiTrash2, FiClock, FiCheckCircle, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-e7zjf3b6pq-uc.a.run.app/api'
export default function AdminProducts() {
    const [products, setProducts] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Subcategory mapping matching mobile app logic exactly
    const TAG_MAPPING: Record<string, { id: string, name: string }[]> = {
        frozen: [
            { id: 'all', name: 'All Items' },
            { id: 'chicken-momo', name: 'Chicken Momo' },
            { id: 'seafood-momo', name: 'Seafood Momo' },
            { id: 'veg-momo', name: 'Veg Momo' },
            { id: 'sha-phaley-momo', name: 'Sha-Phaley Momo' },
            { id: 'fried-fish', name: 'Fried Fish' },
            { id: 'fried-chicken', name: 'Fried Chicken' },
            { id: 'fried-veg', name: 'Fried Veg' },
            { id: 'multi-use-meat', name: 'Multi-use Meat' },
            { id: 'sauce-marinades', name: 'Sauce/Marinades' },
        ],
        '5min': [
            { id: 'all', name: 'All Items' },
            { id: 'chicken-momo', name: 'Chicken Momo' },
            { id: 'seafood-momo', name: 'Seafood Momo' },
            { id: 'veg-momo', name: 'Veg Momo' },
            { id: 'sha-phaley-momo', name: 'Sha-Phaley Momo' },
            { id: 'fried-fish', name: 'Fried Fish' },
            { id: 'fried-chicken', name: 'Fried Chicken' },
            { id: 'fried-veg', name: 'Fried Veg' },
        ],
        '10min': [
            { id: 'all', name: 'All Items' },
            { id: 'kebab-grills', name: 'Kebab/Grills' },
            { id: 'pulled-chicken', name: 'Pulled Chicken' },
            { id: 'bengali-main', name: 'Bengali Main Course' },
            { id: 'general-main', name: 'General Main Course' },
        ],
        veg: [
            { id: 'all', name: 'All Items' },
            { id: 'leafy', name: 'Leafy Greens' },
            { id: 'roots', name: 'Root Veggies' },
            { id: 'exotic', name: 'Exotics' },
            { id: 'daily', name: 'Daily Needs' },
            { id: 'organic', name: 'Organic' },
            { id: 'salads', name: 'Salad Mixes' },
        ],
        meat: [
            { id: 'all', name: 'All Items' },
            { id: 'fresh-meat', name: 'Fresh Meat' },
            { id: 'frozen-meat', name: 'Frozen Meat' },
            { id: 'cold-cuts', name: 'Cold Cuts' },
            { id: 'chicken', name: 'Chicken' },
            { id: 'mutton', name: 'Mutton Chops' },
            { id: 'fish', name: 'Seafood' },
            { id: 'eggs', name: 'Organic Eggs' },
        ],
        kitchen: [
            { id: 'all', name: 'All Items' },
            { id: 'tools', name: 'Tools' },
            { id: 'cookware', name: 'Cookware' },
        ],
        packaging: [
            { id: 'all', name: 'All Items' },
            { id: 'boxes', name: 'Boxes' },
            { id: 'bags', name: 'Bags' },
        ],
    }

    const APP_CATEGORIES = [
        { id: 'frozen', name: 'Ready to cook: Frozen' },
        { id: '5min', name: '5 Min Meals' },
        { id: '10min', name: '10 Min Meals' },
        { id: 'veg', name: 'Fresh Vegetables' },
        { id: 'meat', name: 'Fresh & Frozen Meat' },
        { id: 'kitchen', name: 'Kitchen Essentials' },
        { id: 'packaging', name: 'Packaging Materials' },
    ]

    // Create a flat map for all tag names
    const TAG_NAME_MAP: Record<string, string> = {};
    Object.values(TAG_MAPPING).forEach(tags => {
        tags.forEach(tag => {
            TAG_NAME_MAP[tag.id] = tag.name;
        });
    });

    const [searchTerm, setSearchTerm] = useState('')
    const [filterCategory, setFilterCategory] = useState('')
    const [filterStock, setFilterStock] = useState('')
    const [isUploading, setIsUploading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [currentProduct, setCurrentProduct] = useState<any>(null)
    const [formData, setFormData] = useState({
        name: '',
        category: 'frozen',
        basePrice: '',
        mrp: '',
        unit: '',
        weight: '',
        description: '',
        image: 'https://storage.googleapis.com/bluecrate-assets/placeholders/coming-soon.jpg',
        badge: '',
        isActive: true,
        inStock: true,
        stockQuantity: '',
        secondaryCategories: [] as string[],
        tags: [] as string[],
        searchKeywords: '',
        bulkTiers: [
            { quantity: '', price: '' },
            { quantity: '', price: '' },
            { quantity: '', price: '' }
        ]
    })

    const fetchProducts = async () => {
        setIsLoading(true)
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/products?admin=true&_cb=${Date.now()}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            })
            const data = await response.json()
            setProducts(data)
        } catch (error) {
            console.error('Fetch error:', error)
            toast.error('Failed to load products')
        } finally {
            setIsLoading(false)
        }
    }

    // Get user from localStorage
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    const user = userStr ? JSON.parse(userStr) : null;
    const userType = user?.userType || 'admin';
    const vendorCategory = user?.vendorCategory || null;

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
                description: `${item.Category} | ${item['Sub-Category']}`,
                image: 'https://storage.googleapis.com/bluecrate-assets/placeholders/coming-soon.jpg',
                category: (item.Tags || '').toLowerCase().includes('fresh meat') ? 'meat' :
                    (item.Tags || '').toLowerCase().includes('5 min') ? '5min' :
                        (item.Tags || '').toLowerCase().includes('10 min') ? '10min' :
                            (item.Tags || '').toLowerCase().includes('vegetables') ? 'veg' :
                                (item.Tags || '').toLowerCase().includes('kitchen') ? 'kitchen' :
                                    (item.Tags || '').toLowerCase().includes('packaging') ? 'packaging' : 'frozen',
                basePrice: parseFloat(item.PackPricing) || 0,
                unit: item.UnitPack,
                weight: item.Weight,
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
            console.log('[AdminProducts] Token found in localStorage:', token ? (token.substring(0, 20) + '...') : 'NULL');
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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        const uploadData = new FormData()
        uploadData.append('file', file)

        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`${API_URL}/api/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: uploadData,
            })
            const data = await response.json()
            if (data.success && data.url) {
                setFormData({ ...formData, image: data.url })
                toast.success('Image uploaded securely!')
            } else {
                toast.error('Upload failed: ' + (data.error || 'Unknown error'))
            }
        } catch (error) {
            console.error('Upload error', error)
            toast.error('An error occurred during upload.')
        } finally {
            setIsUploading(false)
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
                mrp: product.mrp?.toString() || '',
                unit: product.unit || '',
                weight: product.weight || '',
                description: product.description || '',
                image: product.image,
                badge: product.badge || '',
                isActive: product.isActive !== false, // default true
                inStock: product.inStock !== false,   // default true
                stockQuantity: product.stockQuantity?.toString() || '0',
                secondaryCategories: product.secondaryCategories || [],
                tags: product.tags || [],
                searchKeywords: (product.searchKeywords || []).join(', '),
                bulkTiers: [
                    product.bulkTiers?.[0] || { quantity: '', price: '' },
                    product.bulkTiers?.[1] || { quantity: '', price: '' },
                    product.bulkTiers?.[2] || { quantity: '', price: '' }
                ]
            })
        } else {
            setIsEditing(true) // Actually isEditing: false but for new products we used FALSE below. Wait...
            setIsEditing(false)
            setCurrentProduct(null)
            setFormData({
                name: '',
                category: vendorCategory || 'frozen',
                basePrice: '',
                mrp: '',
                unit: '',
                weight: '',
                description: '',
                image: 'https://storage.googleapis.com/bluecrate-assets/placeholders/coming-soon.jpg',
                badge: '',
                isActive: true,
                inStock: true,
                stockQuantity: '0',
                secondaryCategories: vendorCategory ? [vendorCategory] : ['frozen'],
                tags: [],
                searchKeywords: '',
                bulkTiers: [
                    { quantity: '', price: '' },
                    { quantity: '', price: '' },
                    { quantity: '', price: '' }
                ]
            })
        }
        setIsModalOpen(true)
    }

    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault()
        const token = localStorage.getItem('token')
        const method = isEditing ? 'PUT' : 'POST'
        const url = isEditing ? `${API_URL}/api/products/${currentProduct.id}` : `${API_URL}/api/products`

        // Filter out empty bulk tiers
        const formattedBulkTiers = formData.bulkTiers
            .filter(t => t.quantity && t.price)
            .map(t => ({ quantity: t.quantity, price: parseFloat(t.price) || 0 }));

        // Logic to sync category and secondaryCategories
        const primaryCat = formData.secondaryCategories.length > 0 ? formData.secondaryCategories[0] : formData.category;

        const payload = {
            ...formData,
            category: primaryCat,
            basePrice: parseFloat(formData.basePrice) || 0,
            mrp: parseFloat(formData.mrp) || null,
            stockQuantity: parseFloat(formData.stockQuantity) || 0,
            secondaryCategories: formData.secondaryCategories,
            tags: formData.tags,
            searchKeywords: formData.searchKeywords.split(',').map(k => k.trim()).filter(k => k !== ''),
            bulkTiers: formattedBulkTiers.length > 0 ? formattedBulkTiers : null,
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

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.id.toString().includes(searchTerm) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = filterCategory === '' || p.category === filterCategory;

        let matchesStock = true;
        if (filterStock === 'in_stock') matchesStock = p.inStock === true;
        if (filterStock === 'out_of_stock') matchesStock = p.inStock === false;
        if (filterStock === 'active') matchesStock = p.isActive === true;
        if (filterStock === 'inactive') matchesStock = p.isActive === false;

        return matchesSearch && matchesCategory && matchesStock;
    })

    // Categories are now fetched from API

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
                        {userType === 'admin' && (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleDownloadTemplate}
                                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <FiDownload className="mr-2" /> Template
                                </button>
                                <label className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 cursor-pointer transition-colors">
                                    <FiUpload className="mr-2" /> Bulk Upload
                                    <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                                </label>
                            </div>
                        )}
                        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center space-x-2">
                            <FiPlus />
                            <span>Add Product</span>
                        </button>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-grow w-full">
                        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, category, or ID..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-primary-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <select
                            className="px-4 py-3 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-700 min-w-[150px]"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {APP_CATEGORIES.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        <select
                            className="px-4 py-3 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-700 min-w-[150px]"
                            value={filterStock}
                            onChange={(e) => setFilterStock(e.target.value)}
                        >
                            <option value="">All Status</option>
                            <option value="active">Active Only</option>
                            <option value="inactive">Inactive Only</option>
                            <option value="in_stock">In Stock Only</option>
                            <option value="out_of_stock">Out of Stock Only</option>
                        </select>
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-240px)]">
                    {isLoading ? (
                        <div className="p-20 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
                            <p className="mt-4 text-gray-500">Loading inventory...</p>
                        </div>
                    ) : (
                        <div className="overflow-auto flex-1 relative border border-gray-200 rounded-b-xl border-t-0">
                            <table className="w-full text-left border-collapse whitespace-nowrap min-w-max">
                                <thead className="bg-gray-50 sticky top-0 z-30 shadow-sm border-b border-gray-200">
                                    <tr className="divide-x divide-gray-200">
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600 sticky left-0 bg-gray-50 z-40 shadow-[1px_0_0_0_#e5e7eb] border-r border-gray-200">Product</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Categories</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Subcategories</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Search Keywords</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Base Price</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">MRP</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Wgt/Vol</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Pack Qty</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Bulk Tier 1</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Bulk Tier 2</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Bulk Tier 3</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Badge</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Stock Qty</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Stock/Status</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right sticky right-0 bg-gray-50 z-40 shadow-[-1px_0_0_0_#e5e7eb] border-l border-gray-200">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 border-b border-gray-200">
                                    {filteredProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50 transition-colors group bg-white divide-x divide-gray-200">
                                            <td className="px-6 py-4 sticky left-0 bg-white group-hover:bg-gray-50 z-20 shadow-[1px_0_0_0_#e5e7eb] border-r border-gray-200">
                                                <div className="flex items-center min-w-[200px]">
                                                    <div className="h-12 w-12 rounded-lg bg-gray-100 flex-shrink-0 relative overflow-hidden">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-bold text-gray-900" title={product.name}>{product.name}</div>
                                                        <div className="text-xs text-gray-500">ID: BCF-{product.id.toString().padStart(3, '0')}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1 min-w-[120px]">
                                                    {product.secondaryCategories?.map((catId: string) => {
                                                        const cat = APP_CATEGORIES.find(c => c.id === catId);
                                                        return (
                                                            <span key={catId} className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${catId === 'meat' ? 'bg-red-100 text-red-700' :
                                                                catId === 'frozen' ? 'bg-blue-100 text-blue-700' :
                                                                    'bg-green-100 text-green-700'
                                                                }`}>
                                                                {cat?.name || catId}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {product.tags?.length
                                                    ? product.tags.map((tagId: string) => TAG_NAME_MAP[tagId] || tagId).join(', ')
                                                    : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 italic">
                                                {product.searchKeywords?.length ? product.searchKeywords.join(', ') : '-'}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-gray-900">
                                                ₹{product.basePrice}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 line-through">
                                                {product.mrp ? `₹${product.mrp}` : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-700">
                                                {product.weight || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-700">
                                                {product.unit || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-xs text-gray-600">
                                                {product.bulkTiers?.[0]?.quantity ? `${product.bulkTiers[0].quantity} @ ₹${product.bulkTiers[0].price}` : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-xs text-gray-600">
                                                {product.bulkTiers?.[1]?.quantity ? `${product.bulkTiers[1].quantity} @ ₹${product.bulkTiers[1].price}` : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-xs text-gray-600">
                                                {product.bulkTiers?.[2]?.quantity ? `${product.bulkTiers[2].quantity} @ ₹${product.bulkTiers[2].price}` : '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {product.badge ? (
                                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-xs font-bold">{product.badge}</span>
                                                ) : '-'}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-gray-900">
                                                {product.stockQuantity || 0}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1.5">
                                                    <div className={`flex items-center text-xs font-bold ${product.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                                                        {product.isActive ? <FiCheckCircle className="mr-1.5" /> : <FiX className="mr-1.5" />}
                                                        <span>{product.isActive ? 'Active' : 'Inactive'}</span>
                                                    </div>
                                                    <div className={`flex items-center text-xs font-bold ${product.inStock ? 'text-blue-600' : 'text-red-500'}`}>
                                                        <span>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap sticky right-0 bg-white group-hover:bg-gray-50 z-20 shadow-[-1px_0_0_0_#e5e7eb] border-l border-gray-200">
                                                <button
                                                    onClick={() => handleOpenModal(product)}
                                                    className="p-2 text-gray-400 hover:text-primary-600 bg-white hover:bg-primary-50 rounded-lg transition-colors border border-transparent hover:border-primary-100"
                                                >
                                                    <FiEdit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 bg-white hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
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
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {isEditing ? 'Edit Product' : 'Add New Product'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <FiX className="w-6 h-6" />
                                </button>
                            </div>
                            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 overflow-y-auto flex-1">
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
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-primary-700 mb-2 text-left underline">Assigned Categories</label>
                                        <div className="w-full px-4 py-3 bg-primary-50 border border-primary-100 rounded-xl max-h-40 overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-2">
                                            {APP_CATEGORIES.map(cat => (
                                                <label key={cat.id} className="flex items-center space-x-2 text-sm text-gray-700 p-1 hover:bg-white rounded transition-colors cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        disabled={userType === 'vendor' && vendorCategory !== cat.id}
                                                        className="rounded text-primary-600 focus:ring-primary-500 w-4 h-4"
                                                        checked={formData.secondaryCategories.includes(cat.id)}
                                                        onChange={(e) => {
                                                            const newCats = e.target.checked
                                                                ? [...formData.secondaryCategories, cat.id]
                                                                : formData.secondaryCategories.filter(c => c !== cat.id);
                                                            setFormData({ ...formData, secondaryCategories: newCats });
                                                        }}
                                                    />
                                                    <span className={formData.secondaryCategories.includes(cat.id) ? 'font-bold text-primary-700' : ''}>{cat.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                        <p className="text-[10px] text-primary-500 mt-1 italic">* Select all categories where this product should appear.</p>
                                    </div>
                                </div>

                                {/* Dynamic Subcategory Tags */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 text-left underline">Subcategory Tags (App Sidebar)</label>
                                    <div className={`w-full px-4 py-3 border rounded-xl min-h-[60px] max-h-48 overflow-y-auto ${formData.secondaryCategories.length === 0 ? 'bg-gray-100 text-gray-400' : 'bg-white border-gray-200 shadow-inner'}`}>
                                        {formData.secondaryCategories.length === 0 ? (
                                            <div className="flex items-center justify-center h-full italic text-xs">
                                                Select a category above to load relevant tags...
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                {Array.from(new Set(formData.secondaryCategories.flatMap(catId => TAG_MAPPING[catId] || []))).map(tag => (
                                                    <label key={tag.id} className="flex items-center space-x-2 text-sm text-gray-700 p-1 hover:bg-gray-50 rounded transition-colors cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                                                            checked={formData.tags.includes(tag.id)}
                                                            onChange={(e) => {
                                                                const newTags = e.target.checked
                                                                    ? [...formData.tags, tag.id]
                                                                    : formData.tags.filter(t => t !== tag.id);
                                                                setFormData({ ...formData, tags: newTags });
                                                            }}
                                                        />
                                                        <span className={formData.tags.includes(tag.id) ? 'font-bold text-blue-700' : ''}>{tag.name}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1 italic">* Used for the sub-navigation sidebar in the mobile app.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 text-left underline">Internal Search Keywords (Comma separated)</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                                        placeholder="e.g. synonym1, synonym2, local_language_name"
                                        value={formData.searchKeywords}
                                        onChange={(e) => {
                                            setFormData({ ...formData, searchKeywords: e.target.value });
                                        }}
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1 italic">* These keywords are hidden from the UI but used to improve search results.</p>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Base Price (₹)</label>
                                        <input
                                            type="number"
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-primary-500"
                                            placeholder="0.00"
                                            value={formData.basePrice}
                                            onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1 text-left">MRP (Strikethrough)</label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-primary-500"
                                            placeholder="0.00"
                                            value={formData.mrp}
                                            onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Badge (e.g. New)</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-primary-500"
                                            placeholder="Badge Text"
                                            value={formData.badge}
                                            onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Units per Pack(e.g. 50 units per pack)</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-primary-500"
                                            placeholder="Unit"
                                            value={formData.unit}
                                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Weight or Volume (e.g. 500g, 1L)</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-primary-500"
                                            placeholder="Weight"
                                            value={formData.weight}
                                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1 text-left font-bold text-primary-600">Stock Quantity/Weight (Current)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="w-full px-4 py-3 bg-primary-50 border-primary-100 rounded-lg focus:ring-2 focus:ring-primary-500 font-bold"
                                            placeholder="0.00"
                                            value={formData.stockQuantity}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const qty = parseFloat(val) || 0;
                                                setFormData({
                                                    ...formData,
                                                    stockQuantity: val,
                                                    inStock: qty > 0 ? true : formData.inStock
                                                });
                                            }}
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
                                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex flex-col items-center">
                                    <label className="block text-sm font-bold text-gray-900 mb-2 underline decoration-gray-300">Product Image Upload</label>
                                    {formData.image && formData.image !== 'https://storage.googleapis.com/bluecrate-assets/placeholders/coming-soon.jpg' && (
                                        <div className="mb-4 relative w-32 h-32">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover rounded-md shadow-sm border border-gray-200 bg-white" />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={isUploading}
                                        className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 disabled:opacity-50"
                                    />
                                    {isUploading && <span className="text-xs text-primary-600 mt-2 font-bold animate-pulse">Uploading image to secure storage...</span>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 text-left">Status Toggles</label>
                                    <div className="flex gap-6">
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                                                checked={formData.isActive}
                                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                            />
                                            <span className="text-sm font-medium text-gray-700">Active (Visible)</span>
                                        </label>
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                                                checked={formData.inStock}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    setFormData({
                                                        ...formData,
                                                        inStock: checked,
                                                        stockQuantity: checked ? formData.stockQuantity : '0'
                                                    });
                                                }}
                                            />
                                            <span className="text-sm font-medium text-gray-700">In Stock</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <label className="block text-sm font-bold text-gray-900 mb-3 text-left">3-Tier Bulk Pricing (Optional)</label>
                                    <div className="space-y-3">
                                        {[0, 1, 2].map((tierIndex) => (
                                            <div key={tierIndex} className="flex gap-3 items-center">
                                                <span className="text-xs font-bold text-gray-400 w-12">TIER {tierIndex + 1}</span>
                                                <input
                                                    type="text"
                                                    placeholder="Qty (e.g. '5 kg')"
                                                    className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                                                    value={formData.bulkTiers[tierIndex].quantity}
                                                    onChange={(e) => {
                                                        const newTiers = [...formData.bulkTiers];
                                                        newTiers[tierIndex].quantity = e.target.value;
                                                        setFormData({ ...formData, bulkTiers: newTiers });
                                                    }}
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Price (₹)"
                                                    className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                                                    value={formData.bulkTiers[tierIndex].price}
                                                    onChange={(e) => {
                                                        const newTiers = [...formData.bulkTiers];
                                                        newTiers[tierIndex].price = e.target.value;
                                                        setFormData({ ...formData, bulkTiers: newTiers });
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
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
