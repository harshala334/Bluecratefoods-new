import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FaRocket, FaArrowLeft } from 'react-icons/fa';

const ComingSoon = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <Head>
                <title>Coming Soon | BlueCrate Foods</title>
                <meta name="description" content="This feature is coming soon." />
            </Head>

            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center transform transition-all hover:scale-105 duration-300">
                <div className="flex justify-center mb-6">
                    <div className="bg-teal-100 p-4 rounded-full">
                        <FaRocket className="text-4xl text-teal-600 animate-bounce" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Coming Soon!
                </h1>

                <p className="text-gray-600 mb-8 leading-relaxed">
                    We&apos;re working hard to bring you this amazing feature.
                    Stay tuned for updates!
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 transition-colors duration-200 w-full"
                >
                    <FaArrowLeft className="mr-2" />
                    Back to Home
                </Link>
            </div>

            <div className="mt-8 text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} BlueCrate Foods. All rights reserved.
            </div>
        </div>
    );
};

export default ComingSoon;
