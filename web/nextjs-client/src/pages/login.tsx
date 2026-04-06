import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { FiMail, FiLock, FiUser, FiBriefcase, FiUserPlus } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function Login() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('login') // 'login' or 'signup'
  const [userType, setUserType] = useState('individual') // 'individual' or 'business'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (activeTab === 'signup' && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!')
      setIsLoading(false)
      return
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-e7zjf3b6pq-uc.a.run.app'
      const endpoint = activeTab === 'login' ? '/api/auth/login' : '/api/auth/signup'
      const payload = activeTab === 'login'
        ? {
          email: formData.email,
          password: formData.password,
          userType: userType,
        }
        : {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          userType: userType,
        }

      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success(activeTab === 'login' ? 'Login successful!' : 'Account created successfully!')
        localStorage.setItem('token', data.token)
        const serverUserType = data.user.userType || userType
        localStorage.setItem('userType', serverUserType)
        localStorage.setItem('user', JSON.stringify(data.user))

        // Use a more robust check for roles
        const isStaff = serverUserType === 'admin' || serverUserType === 'vendor' || data.user.email === 'admin@gmail.com';
        
        if (isStaff) {
          router.push('/admin/dashboard')
        } else if (serverUserType === 'business') {
          router.push('/b2b')
        } else {
          router.push('/d2c')
        }
      } else {
        toast.error(data.message || 'Authentication failed')
      }
    } catch (error) {
      console.error('Auth error:', error)
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout>
      <Head>
        <title>Sign In - BlueCrateFoods</title>
      </Head>

      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container-custom">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">
                  {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
                </h1>
                <p className="text-gray-600">
                  {activeTab === 'login' ? 'Sign in to your account' : 'Join BlueCrateFoods today'}
                </p>
              </div>

              {/* Tab Navigation */}
              <div className="flex mb-8 bg-gray-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'login'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('signup')}
                  className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'signup'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Sign Up
                </button>
              </div>

              {/* User Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Account Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUserType('individual')}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${userType === 'individual'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <FiUser className={`w-6 h-6 mb-2 ${userType === 'individual' ? 'text-primary-600' : 'text-gray-400'}`} />
                    <div className="font-medium text-sm">Individual</div>
                    <div className="text-xs text-gray-500">Personal cooking</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('business')}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${userType === 'business'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <FiBriefcase className={`w-6 h-6 mb-2 ${userType === 'business' ? 'text-primary-600' : 'text-gray-400'}`} />
                    <div className="font-medium text-sm">Business</div>
                    <div className="text-xs text-gray-500">Restaurant/Cafe</div>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {activeTab === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {userType === 'business' ? 'Business Name' : 'Full Name'}
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder={userType === 'business' ? 'Enter business name' : 'Enter your full name'}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      minLength={6}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your password (min 6 chars)"
                    />
                  </div>
                </div>

                {activeTab === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Confirm Password</label>
                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                        minLength={6}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Confirm your password"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'login' && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-600">Remember me</span>
                    </label>
                    <Link href="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">
                      Forgot password?
                    </Link>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {activeTab === 'signup' && <FiUserPlus className="w-5 h-5" />}
                  <span>
                    {isLoading
                      ? (activeTab === 'login' ? 'Signing in...' : 'Creating account...')
                      : (activeTab === 'login'
                        ? `Log in as ${userType === 'individual' ? 'Individual' : 'Business'}`
                        : `Sign up as ${userType === 'individual' ? 'Individual' : 'Business'}`
                      )
                    }
                  </span>
                </button>
              </form>

              {/* Account Navigation Links */}
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  {activeTab === 'login' ? (
                    <>
                      Don&apos;t have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setActiveTab('signup')}
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setActiveTab('login')}
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Log in
                      </button>
                    </>
                  )}
                </p>
              </div>

              {/* Redirect Information */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 text-center">
                  {userType === 'individual' ? (
                    <span>You&apos;ll be redirected to our <strong>D2C platform</strong> for home cooking</span>
                  ) : (
                    <span>You&apos;ll be redirected to our <strong>B2B platform</strong> for business solutions</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
