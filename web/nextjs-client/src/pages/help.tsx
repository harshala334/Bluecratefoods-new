import Head from 'next/head';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { FiMail, FiMessageCircle, FiPhone } from 'react-icons/fi';

export default function Help() {
    return (
        <Layout>
            <Head>
                <title>Help Center - BlueCrateFoods</title>
                <meta name="description" content="Get help and support for your BlueCrateFoods account and orders." />
            </Head>

            <div className="bg-gray-900 py-20 text-center text-white">
                <div className="container-custom">
                    <h1 className="text-4xl font-display font-bold mb-4">How can we help you?</h1>
                    <p className="text-gray-400 text-lg mb-8">Search for answers or contact our team</p>

                    <div className="max-w-2xl mx-auto relative">
                        <input
                            type="text"
                            placeholder="Search for articles (e.g. 'cancel order', 'payment')"
                            className="w-full px-6 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-primary-500/50 shadow-lg"
                        />
                        <button className="absolute right-3 top-3 bg-primary-600 text-white px-6 py-1.5 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                            Search
                        </button>
                    </div>
                </div>
            </div>

            <div className="container-custom py-16">
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-hard transition-all duration-300">
                        <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 mb-6">
                            <FiMail className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Email Support</h3>
                        <p className="text-gray-600 mb-6">
                            Got a question about your order? Send us an email and we&apos;ll get back to you within 24 hours.
                        </p>
                        <a href="mailto:support@bluecratefoods.com" className="text-primary-600 font-bold hover:underline flex items-center gap-2">
                            support@bluecratefoods.com
                        </a>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-hard transition-all duration-300">
                        <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6">
                            <FiMessageCircle className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">WhatsApp Us</h3>
                        <p className="text-gray-600 mb-6">
                            Need quick help? Chat with our support team on WhatsApp for instant assistance (9 AM - 9 PM).
                        </p>
                        <a href="#" className="text-green-600 font-bold hover:underline flex items-center gap-2">
                            +91 9591890828
                        </a>
                    </div>
                </div>

                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Other ways to get help</h2>
                    <div className="flex justify-center gap-4 flex-wrap">
                        <Link href="/faq" className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                            Browse FAQ
                        </Link>
                        <Link href="/terms" className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
