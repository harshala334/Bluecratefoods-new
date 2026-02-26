
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/Layout';
import { FiCheck, FiTruck, FiBox, FiSmile, FiArrowRight } from 'react-icons/fi';
import { GiCookingPot } from 'react-icons/gi';

export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: 'Choose Your Meals',
      description: 'Browse our weekly menu of 20+ chef-curated recipes. From quick 15-minute meals to gourmet dinners, pick what suits your schedule and taste.',
      icon: <FiCheck className="w-8 h-8" />,
      color: 'bg-primary-50 text-primary-600',
      image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 2,
      title: 'We Pack & Deliver',
      description: 'We source fresh, high-quality ingredients and pre-measure them for you. Everything is packed in an insulated box and delivered to your doorstep.',
      icon: <FiTruck className="w-8 h-8" />,
      color: 'bg-blue-50 text-blue-600',
      image: 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 3,
      title: 'Cook with Ease',
      description: 'Follow our simple, step-by-step recipe cards with photos. Our precise portions mean zero food waste and less cleanup.',
      icon: <GiCookingPot className="w-8 h-8" />,
      color: 'bg-purple-50 text-purple-600',
      image: 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 4,
      title: 'Enjoy!',
      description: 'Serve up a delicious, home-cooked meal that you can be proud of. Share it with family, friends, or enjoy it all to yourself.',
      icon: <FiSmile className="w-8 h-8" />,
      color: 'bg-green-50 text-green-600',
      image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=600'
    }
  ];

  return (
    <Layout>
      <Head>
        <title>How It Works - BlueCrateFoods</title>
        <meta name="description" content="See how BlueCrateFoods makes cooking easy and fun." />
      </Head>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-5xl font-display font-bold text-gray-900 mb-6">Simple. Fresh. Delicious.</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Experience the joy of cooking without the stress. We handle the planning and shopping, so you can focus on the fun part.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="space-y-24">
            {steps.map((step, index) => (
              <div key={step.id} className={`flex flex - col gap - 12 items - center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} `}>
                <div className="flex-1 space-y-6">
                  <div className={`w - 16 h - 16 rounded - 2xl flex items - center justify - center ${step.color} shadow - sm`}>
                    {step.icon}
                  </div>
                  <h2 className="text-4xl font-display font-bold text-gray-900">
                    {step.id}. {step.title}
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                <div className="flex-1">
                  <div className="relative h-[400px] w-full rounded-3xl overflow-hidden shadow-hard rotate-1 hover:rotate-0 transition-transform duration-500">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white text-center">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Ready to get cooking?</h2>
          <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">
            Join thousands of happy home cooks today. No commitment, skip or cancel anytime.
          </p>
          <Link href="/recipes" className="inline-flex items-center space-x-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all hover:scale-105">
            <span>Explore Our Menu</span>
            <FiArrowRight />
          </Link>
        </div>
      </section>
    </Layout>
  );
}

