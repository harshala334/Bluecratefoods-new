
import Head from 'next/head';
import Layout from '@/components/Layout';

export default function Cookies() {
    return (
        <Layout>
            <Head>
                <title>Cookie Policy - BlueCrateFoods</title>
                <meta name="description" content="Learn about how BlueCrateFoods uses cookies." />
            </Head>

            <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-display font-bold text-gray-900 mb-8 border-b pb-4">
                        Cookie Policy
                    </h1>
                    <p className="text-sm text-gray-500 mb-8">
                        <strong>Last Updated:</strong> December 26, 2025
                    </p>

                    <div className="prose prose-primary max-w-none text-gray-700 space-y-8">
                        <p>
                            BlueCrateFoods uses cookies to improve your experience on our website. This Cookie Policy explains what cookies are, how we use them, and your choices regarding cookies.
                        </p>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">What are cookies?</h2>
                            <p>
                                Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">How we use cookies</h2>
                            <p className="mb-4">We use different types of cookies for various purposes:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Essential Cookies:</strong> These are necessary for the website to function properly (e.g., remembering your login details or items in your cart).</li>
                                <li><strong>Performance Cookies:</strong> These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.</li>
                                <li><strong>Functional Cookies:</strong> These allow the website to remember choices you make (such as your user name, language or the region you are in) and provide enhanced, more personal features.</li>
                                <li><strong>Marketing Cookies:</strong> These are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Choices</h2>
                            <p>
                                You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. This may prevent you from taking full advantage of the website.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

