import { useState } from 'react'
import Head from 'next/head'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { FiTruck, FiClock, FiCheckCircle, FiDollarSign, FiArrowRight } from 'react-icons/fi'
import toast from 'react-hot-toast'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-920625255147.us-central1.run.app'

export default function PartnerSignup() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        vehicleType: 'Two Wheeler',
    })
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            const res = await fetch(`${API_URL}/api/delivery/apply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            if (res.ok) {
                setSubmitted(true)
                toast.success('Application submitted successfully!')
            } else {
                toast.error('Failed to submit application. Please try again.')
            }
        } catch (error) {
            toast.error('An error occurred. Please try again later.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Head>
                <title>Become a Delivery Partner | BlueCrateFoods</title>
                <meta name="description" content="Join BlueCrateFoods as a delivery partner and earn while you deliver fresh ingredients." />
            </Head>

            <Navbar />

            <main className="flex-grow pt-24 pb-16">
                <div className="container-custom">
                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        {/* Left Side: Info */}
                        <div>
                            <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-600 text-xs font-bold uppercase tracking-wider mb-4">
                                Join our network
                            </span>
                            <h1 className="text-4xl lg:text-5xl font-display font-bold text-gray-900 leading-tight mb-6">
                                Deliver Love, <span className="text-primary-600">Earn with Pride.</span>
                            </h1>
                            <p className="text-gray-600 text-lg mb-8">
                                Connect with BlueCrateFoods and help us deliver fresh ingredients to homes across the city. Be your own boss.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                                        <FiClock className="text-green-600 text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Flexible Hours</h3>
                                        <p className="text-sm text-gray-600">Choose when you want to work. Morning, evening, or weekends.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                                        <FiDollarSign className="text-blue-600 text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Competitive Earnings</h3>
                                        <p className="text-sm text-gray-600">Get paid per delivery with additional performance incentives.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                                        <FiCheckCircle className="text-orange-600 text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Easy Setup</h3>
                                        <p className="text-sm text-gray-600">Simple registration and quick approval process.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Form */}
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 relative overflow-hidden">
                            {submitted ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <FiCheckCircle className="text-green-600 text-4xl" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Received!</h2>
                                    <p className="text-gray-600 mb-8">Thank you for your interest. Our team will review your application and get back to you within 48 hours.</p>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="text-primary-600 font-bold hover:underline"
                                    >
                                        Submit another application
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Partner Application</h2>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                            <input
                                                required
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                                                placeholder="Enter your name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                            <input
                                                required
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                                                placeholder="Enter your email"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                            <input
                                                required
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                                                placeholder="Enter your phone number"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                                            <select
                                                value={formData.vehicleType}
                                                onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                                            >
                                                <option>Two Wheeler</option>
                                                <option>Bicycle</option>
                                                <option>Three Wheeler</option>
                                                <option>Four Wheeler</option>
                                            </select>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-200 transition-all flex items-center justify-center group"
                                        >
                                            {submitting ? 'Submitting...' : 'Submit Application'}
                                            <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
