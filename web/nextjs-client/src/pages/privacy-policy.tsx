import Head from 'next/head';
import Layout from '@/components/Layout';

export default function PrivacyPolicy() {
    return (
        <Layout>
            <Head>
                <title>Privacy Policy - BlueCrateFoods</title>
                <meta name="description" content="Privacy Policy of BlueCrateFoods - How we collect, use, and protect your data." />
            </Head>

            <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-display font-bold text-gray-900 mb-8 border-b pb-4">
                        Privacy Policy
                    </h1>

                    <p className="text-sm text-gray-500 mb-8">
                        <strong>Last Updated:</strong> December 26, 2025
                    </p>

                    <div className="prose prose-primary max-w-none text-gray-700 space-y-8">
                        <p>
                            Welcome to <strong>BlueCrateFoods</strong>. We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <a href="https://bluecratefoods.com/" className="text-primary-600 hover:underline">https://bluecratefoods.com/</a> (&quot;Site&quot;) and use our services, including our D2C meal delivery and B2B solutions.
                        </p>

                        <p>
                            By accessing or using our Site, you consent to the data practices described in this policy.
                        </p>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
                            <p className="mb-4">
                                We collect information that you provide directly to us, as well as information automatically collected when you use our Site.
                            </p>

                            <h3 className="text-xl font-semibold text-gray-900 mb-2">A. Personal Information</h3>
                            <p className="mb-2">
                                We may collect personally identifiable information (&quot;Personal Data&quot;) when you register for an account, place an order, fill out a form, or contact us. This includes:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Identity Data:</strong> Name, username, or similar identifiers.</li>
                                <li><strong>Contact Data:</strong> Billing address, delivery address, email address, and telephone numbers.</li>
                                <li><strong>Financial Data:</strong> Payment card details (processed securely by our third-party payment processors; we do not store full credit card details).</li>
                                <li><strong>Account Data:</strong> Profile information, purchase history, and preferences.</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">B. Usage Data & Cookies</h3>
                            <p className="mb-2">
                                When you access the Site, we may automatically collect certain information about your device and usage, including:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>IP address</li>
                                <li>Browser type and version</li>
                                <li>Operating system</li>
                                <li>Referring website URLs</li>
                                <li>Pages viewed and time spent on the Site</li>
                            </ul>
                            <p className="mt-4">
                                We use <strong>Cookies</strong> and similar tracking technologies (like pixels) to track the activity on our Service and store certain information. This helps us improve your experience and allows for targeted advertising (including Meta/Facebook ads).
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
                            <p className="mb-4">We use the information we collect for the following purposes:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Service Delivery:</strong> To process and deliver your orders, manage your account, and provide customer support.</li>
                                <li><strong>B2B Services:</strong> To communicate with business partners regarding white-label solutions and bulk ordering.</li>
                                <li><strong>Marketing & Advertising:</strong> To send you newsletters, promotional materials, and run advertising campaigns on platforms like Facebook and Instagram.</li>
                                <li><strong>Improvement:</strong> To analyze usage patterns and improve our website functionality and product offerings.</li>
                                <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Sharing Your Information</h2>
                            <p className="mb-4">We do not sell your personal data. We may share your information with:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Service Providers:</strong> Third-party vendors who perform services on our behalf, such as payment processing, order fulfillment/delivery, and data analysis.</li>
                                <li><strong>Advertising Partners:</strong> We use third-party advertising platforms, such as <strong>Meta (Facebook & Instagram)</strong> and Google, to serve advertisements. These platforms may use cookies and pixels to collect data about your activities on our Site to provide targeted ads.</li>
                                <li><strong>Legal Requirements:</strong> If required to do so by law or in response to valid requests by public authorities.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Third-Party Links and Services</h2>
                            <p>
                                Our Site may contain links to other websites. We are not responsible for the privacy practices of other sites. We encourage you to read their privacy statements.
                            </p>
                            <p className="mt-4">
                                <strong>Meta (Facebook) Data:</strong> We may use Meta Business Tools (such as the Facebook Pixel). This allows us to track visitor actions and serve relevant ads. You can manage your Facebook privacy settings directly within your Facebook account.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
                            <p>
                                We implement appropriate technical and organizational security measures to protect your personal data from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Data Rights</h2>
                            <p className="mb-4">Depending on your location, you may have the right to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Access the personal data we hold about you.</li>
                                <li>Request correction of inaccurate data.</li>
                                <li>Request deletion of your personal data.</li>
                                <li>Opt-out of marketing communications.</li>
                            </ul>
                            <p className="mt-4">
                                To exercise these rights, please contact us using the information below.
                            </p>
                        </section>

                        <section className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Contact Us</h2>
                            <p className="mb-4">If you have questions or comments about this Privacy Policy, please contact us at:</p>
                            <address className="not-italic space-y-1 text-gray-700">
                                <p><strong>Business Name:</strong> BlueCrateFoods</p>
                                <p><strong>Email:</strong> <a href="mailto:connect@bluecratefoods.com" className="text-primary-600 hover:underline">connect@bluecratefoods.com</a></p>
                                <p><strong>Phone:</strong> +91 9591890828</p>
                                <p><strong>Address:</strong> 181, Becharam Chatterjee Road, Behala, Kolkata-700061, India</p>
                            </address>
                        </section>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
