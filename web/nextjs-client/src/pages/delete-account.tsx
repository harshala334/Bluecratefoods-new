import Head from 'next/head'
import Layout from '@/components/Layout'
import { useState } from 'react'
import { FiTrash2, FiAlertCircle, FiCheckCircle } from 'react-icons/fi'

export default function DeleteAccount() {
  const [email, setEmail] = useState('')
  const [reason, setReason] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call for account deletion request
    // In production, this would send an email or log a request in the database
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 1500)
  }

  return (
    <Layout>
      <Head>
        <title>Delete Account | BlueCrateFoods</title>
        <meta name="description" content="Request deletion of your BlueCrateFoods account and associated data." />
      </Head>

      <div className="min-h-screen bg-gray-50 pt-32 pb-20">
        <div className="container-custom max-w-2xl">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-red-600 px-8 py-6 text-white">
              <div className="flex items-center space-x-3">
                <FiTrash2 size={28} />
                <h1 className="text-2xl font-bold">Delete Account Request</h1>
              </div>
              <p className="text-red-100 mt-2">
                We&apos;re sorry to see you go. This action will permanently remove your data.
              </p>
            </div>

            <div className="p-8">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
                    <div className="flex items-start">
                      <FiAlertCircle className="text-amber-500 mt-0.5 mr-3" size={20} />
                      <div>
                        <h3 className="text-amber-800 font-bold">Important Notice</h3>
                        <p className="text-amber-700 text-sm mt-1">
                          Deletion is permanent. You will lose all order history, saved addresses,
                          and active subscriptions. This process may take up to 30 days to complete.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                      Account Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      placeholder="Enter the email used for your account"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="reason" className="block text-sm font-semibold text-gray-700 mb-1">
                      Reason for leaving (Optional)
                    </label>
                    <textarea
                      id="reason"
                      rows={4}
                      placeholder="Help us improve by sharing why you're deleting your account"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-1 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 active:scale-95'
                        }`}
                    >
                      {isLoading ? 'Processing Request...' : 'Submit Deletion Request'}
                    </button>
                  </div>

                  <p className="text-center text-xs text-gray-400 mt-6">
                    By submitting this request, you confirm that you want to delete your BlueCrateFoods account
                    and all associated personal data in accordance with our Privacy Policy.
                  </p>
                </form>
              ) : (
                <div className="text-center py-10">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiCheckCircle className="text-green-600" size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Request Received</h2>
                  <p className="text-gray-600 mb-8">
                    We&apos;ve received your request to delete the account associated with <strong>{email}</strong>.
                    Our team will process this and send a final confirmation email once complete.
                  </p>
                  <button
                    onClick={() => window.location.href = '/'}
                    className="px-8 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all"
                  >
                    Return to Home
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
