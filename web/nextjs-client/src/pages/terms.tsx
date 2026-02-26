
import Head from 'next/head';
import Layout from '@/components/Layout';

export default function Terms() {
    return (
        <Layout>
            <Head>
                <title>Terms of Service - BlueCrateFoods</title>
                <meta name="description" content="Terms of Service for BlueCrateFoods." />
            </Head>

            <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-display font-bold text-gray-900 mb-8 border-b pb-4">
                        Terms of Service
                    </h1>
                    <p className="text-sm text-gray-500 mb-8">
                        <strong>Last Updated:</strong> December 26, 2025
                    </p>

                    <div className="prose prose-primary max-w-none text-gray-700 space-y-8">
                        <p>
                            Please read these Terms of Service carefully before using our website and services operated by BlueCrateFoods.
                        </p>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Conditions of Use</h2>
                            <p>
                                By using this website, you certify that you have read and reviewed this Agreement and that you agree to comply with its terms.
                                If you do not want to be bound by the terms of this Agreement, you are advised to stop using the website accordingly.
                                BlueCrateFoods only grants use and access of this website, its products, and its services to those who have accepted its terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Privacy Policy</h2>
                            <p>
                                Before you continue using our website, we advise you to read our privacy policy regarding our user data collection.
                                It will help you better understand our practices.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Age Restriction</h2>
                            <p>
                                You must be at least 18 (eighteen) years of age before you can use this website. By using this website, you warrant that you are at least 18 years of age and you may legally adhere to this Agreement.
                                BlueCrateFoods assumes no responsibility for liabilities related to age misrepresentation.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Intellectual Property</h2>
                            <p>
                                You agree that all materials, products, and services provided on this website are the property of BlueCrateFoods,
                                its affiliates, directors, officers, employees, agents, suppliers, or licensors including all copyrights, trade secrets,
                                trademarks, patents, and other intellectual property. You also agree that you will not reproduce or redistribute the BlueCrateFoods&apos;s intellectual property in any way, including electronic, digital, or new trademark registrations.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. User Accounts</h2>
                            <p>
                                As a user of this website, you may be asked to register with us and provide private information. You are responsible for ensuring the accuracy of this information, and you are responsible for maintaining the safety and security of your identifying information.
                                You are also responsible for all activities that occur under your account or password.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Indemnification</h2>
                            <p>
                                You agree to indemnify BlueCrateFoods and its affiliates and hold BlueCrateFoods harmless against legal claims and demands that may arise from your use or misuse of our services.
                                We reserve the right to select our own legal counsel.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

