import Head from 'next/head';
import Layout from '@/components/Layout';
import { FiHelpCircle, FiChevronDown } from 'react-icons/fi';
import { useState } from 'react';

export default function FAQ() {
    const categories = [
        {
            title: 'Orders & Payments',
            questions: [
                {
                    q: 'How do I place an order?',
                    a: 'You can place an order directly through our website by browsing our recipes and adding them to your cart. Once you are done, proceed to checkout creating an account.'
                },
                {
                    q: 'What payment methods do you accept?',
                    a: 'We accept all major credit/debit cards, UPI, and net banking. We valid payment is required to confirm your order.'
                },
                {
                    q: 'Can I cancel my order?',
                    a: 'Yes, you can cancel your order up to 24 hours before the scheduled delivery slot. Refunds are processed within 5-7 business days.'
                }
            ]
        },
        {
            title: 'Delivery',
            questions: [
                {
                    q: 'What is your delivery area?',
                    a: 'We currently serve major metro cities. You can check if we deliver to your area by entering your pincode on the homepage or at checkout.'
                },
                {
                    q: 'How is the food packaged?',
                    a: 'Our ingredients are packed in insulated boxes with ice packs to ensure freshness up to 8 hours after delivery.'
                }
            ]
        },
        {
            title: 'Recipes & Ingredients',
            questions: [
                {
                    q: 'Do you offer vegetarian options?',
                    a: 'Yes! We have a wide variety of vegetarian and vegan recipes available. Look for the "Veg" tag on our recipe cards.'
                },
                {
                    q: 'Are the ingredients fresh?',
                    a: 'Absolutely. We source our produce directly from local farms and trusted partners daily. We guarantee freshness upon delivery.'
                }
            ]
        }
    ];

    return (
        <Layout>
            <Head>
                <title>FAQ - BlueCrateFoods</title>
                <meta name="description" content="Frequently Asked Questions about BlueCrateFoods." />
            </Head>

            <div className="bg-primary-600 py-16 text-center text-white">
                <div className="container-custom">
                    <h1 className="text-4xl font-display font-bold mb-4">Frequently Asked Questions</h1>
                    <p className="text-primary-100 text-lg">Everything you need to know about BlueCrateFoods</p>
                </div>
            </div>

            <div className="container-custom py-16">
                <div className="max-w-3xl mx-auto space-y-12">
                    {categories.map((category, idx) => (
                        <div key={idx} className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">{category.title}</h2>
                            <div className="space-y-4">
                                {category.questions.map((item, qIdx) => (
                                    <div key={qIdx} className="bg-white border boundary-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-start gap-3">
                                            <FiHelpCircle className="w-6 h-6 text-primary-500 flex-shrink-0 mt-1" />
                                            {item.q}
                                        </h3>
                                        <p className="text-gray-600 pl-9 leading-relaxed">
                                            {item.a}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
