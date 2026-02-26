import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Image from 'next/image';
import {
  FiArrowRight,
  FiCheck,
  FiDownload,
  FiClock,
  FiDollarSign,
  FiStar,
  FiTrendingUp,
  FiUsers,
  FiShoppingBag,
  FiX,
  FiMail,
  FiPhone,
  FiMapPin,
  FiChevronDown
} from 'react-icons/fi';
import EnquiryModal from '@/components/EnquiryModal';
import * as fpixel from '@/utils/fpixel';

export default function B2B() {
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showSampleModal, setShowSampleModal] = useState(false);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [showFloatingScroll, setShowFloatingScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const footerHeight = 400;

      // Show after scrolling past the hero section (at least 50% of viewport)
      const shouldShow = scrollY > windowHeight * 0.5;

      // Hide when near footer or no more content below
      const scrollBottom = scrollY + windowHeight;
      const remainingContent = documentHeight - scrollBottom;
      const isNearFooter = remainingContent < footerHeight;
      const hasMoreContent = remainingContent > 200; // At least 200px more content

      setShowFloatingScroll(shouldShow && !isNearFooter && hasMoreContent);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Product categories with download functionality
  const productCategories = [
    {
      id: 'frozen',
      title: 'Frozen Products',
      description: 'Ready-to-cook frozen meals with extended shelf life and consistent quality',
      image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&h=300&fit=crop',
      status: 'available',
      pdfUrl: '/catalogues/BLUECRATEFOODS_Frozen_B2B_Catalogue.pdf'
    },
    {
      id: 'ready-to-serve',
      title: 'Ready-to-Serve Products',
      description: 'Instantly ready meals perfect for quick service and delivery',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=300&fit=crop',
      status: 'coming-soon',
      pdfUrl: null
    },
    {
      id: 'chilled',
      title: 'Chilled Products',
      description: 'Fresh chilled products with optimal taste and nutrition',
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&h=300&fit=crop',
      status: 'coming-soon',
      pdfUrl: null
    },
    {
      id: 'sauces',
      title: 'Sauces, Gravies & Marinades',
      description: 'Authentic flavors and seasonings to enhance your dishes',
      image: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&h=300&fit=crop',
      status: 'coming-soon',
      pdfUrl: null
    }
  ];

  // Benefit points with icons
  const benefitPoints = [
    {
      icon: <FiStar className="w-6 h-6" />,
      title: 'Quality & Consistency, every time',
      color: 'bg-primary-50 text-primary-600'
    },
    {
      icon: <FiDollarSign className="w-6 h-6" />,
      title: 'High Profit Margins & Bulk Discounts',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      icon: <FiClock className="w-6 h-6" />,
      title: 'No Employee Dependency & Low Preparation Time',
      color: 'bg-primary-50 text-primary-600'
    },
    {
      icon: <FiTrendingUp className="w-6 h-6" />,
      title: 'Revenue Growth without the typical Business Hssles',
      color: 'bg-primary-50 text-primary-600'
    }
  ];

  // Handle PDF download
  const handleDownload = (pdfUrl: string, productName: string) => {
    // In a real implementation, you would serve actual PDF files
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${productName.toLowerCase().replace(/\s+/g, '-')}-catalogue.pdf`;
    link.click();
  };

  return (
    <Layout>
      <Head>
        <title>Business-to-Business Products - BlueCrateFoods</title>
        <meta name="description" content="Quality & consistency minus the business hassles. Professional food solutions for businesses." />
      </Head>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-blue-50 overflow-hidden pt-20">
        <div className="container-custom py-12 lg:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl lg:text-7xl font-display font-bold text-gray-900 leading-tight mb-6">
              Business-to-Business Products
            </h1>

            <p className="text-2xl lg:text-3xl text-primary-600 font-semibold mb-10">
              Quality & consistency minus the business hassles
            </p>

            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-12">
              Professional-grade food solutions designed for restaurants, hotels, cafés, and food service businesses.
              Get consistent quality, save preparation time, and increase your profit margins.
            </p>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section id="product-categories" className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-4">
              Download Catalogue
            </h2>
            <p className="text-xl text-gray-600">Explore our complete product range</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {productCategories.map((product, index) => (
              <div
                key={product.id}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group w-full max-w-sm ${index === 3 ? 'lg:col-start-2 lg:col-end-3' : ''
                  }`}
              >
                <div className="relative h-48">
                  <Image
                    src={product.image}
                    alt={product.title}
                    width={500}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.status === 'coming-soon' && (
                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Coming Soon
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">{product.title}</h3>
                  <p className="text-gray-600 mb-6">{product.description}</p>

                  {product.status === 'available' ? (
                    <button
                      onClick={() => handleDownload(product.pdfUrl!, product.title)}
                      className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
                    >
                      <FiDownload className="w-5 h-5" />
                      <span>Download PDF</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3 bg-gray-300 text-gray-500 rounded-xl font-semibold cursor-not-allowed"
                    >
                      <span>Coming Soon</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Buttons Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-12">
              Get Started Today
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <button
                onClick={() => setShowQuoteModal(true)}
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary-200"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <FiDollarSign className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Request for Quotation</h3>
                <p className="text-gray-600 mb-6">Get customized pricing based on your business needs</p>
                <div className="inline-flex items-center space-x-2 text-primary-600 font-semibold">
                  <span>Get Quote</span>
                  <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button
                onClick={() => setShowSampleModal(true)}
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary-200"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <FiUsers className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Request Sample & Visit</h3>
                <p className="text-gray-600 mb-6">Schedule a tasting session and sales representative visit</p>
                <div className="inline-flex items-center space-x-2 text-primary-600 font-semibold">
                  <span>Book Now</span>
                  <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefit Bar */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <FiClock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Ready in Minutes</h3>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <FiTrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">High Profit Margin</h3>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <FiStar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Consistent Quality</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefit Points */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-gray-600">Benefits that drive your business forward</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefitPoints.map((benefit, index) => (
              <div key={index} className="group">
                <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 text-center hover:shadow-lg hover:border-gray-200 transition-all duration-300">
                  <div className={`${benefit.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold leading-tight">{benefit.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-500 to-blue-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            Join hundreds of restaurants and food businesses already using BlueCrateFoods B2B solutions
          </p>
          <Link href="#" className="inline-flex items-center space-x-2 px-10 py-5 bg-white text-primary-600 rounded-xl font-bold text-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
            <span>View More About B2B</span>
            <FiArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Quote Request Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-2xl font-bold">Request for Quotation</h3>
              <button
                onClick={() => setShowQuoteModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <form className="p-6 space-y-6" onSubmit={(e) => {
              e.preventDefault();
              fpixel.event('Lead', { content_name: 'B2B Quote' });
              setShowQuoteModal(false);
              // Add actual form submission logic here
            }}>
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Phone Number - Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Business Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your business name"
                />
              </div>

              {/* Type of Business */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type of Business</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option value="">Select business type</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="cafe">Café</option>
                  <option value="cloud-kitchen">Cloud Kitchen</option>
                  <option value="catering-service">Catering Service</option>
                  <option value="hotel">Hotel</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Location (City / Area)</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your city or area"
                />
              </div>

              {/* What Are You Interested In - Multi-select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">What Are You Interested In?</label>
                <div className="space-y-3 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-4">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                    <span className="text-gray-700">Veg Frozen Items</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                    <span className="text-gray-700">Chicken Products</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                    <span className="text-gray-700">Seafood (Fish & Prawns)</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                    <span className="text-gray-700">Momos</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                    <span className="text-gray-700">Other products we can add</span>
                  </label>
                </div>
              </div>

              {/* Daily/Weekly Requirement */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Daily/Weekly Requirement</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option value="">Select requirement range</option>
                  <option value="1-5kg">1–5 kg</option>
                  <option value="5-15kg">5–15 kg</option>
                  <option value="15-30kg">15–30 kg</option>
                  <option value="30kg+">30+ kg</option>
                </select>
              </div>

              {/* Terms & Conditions Checkbox */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="accept-terms"
                  className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="accept-terms" className="text-sm text-gray-700">
                  I accept the <a href="#" className="text-primary-600 hover:text-primary-700 underline">Terms & Conditions</a>
                </label>
              </div>

              {/* Submit Button */}
              <button type="submit" className="w-full bg-primary-600 text-white py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors text-lg">
                Get Wholesale Pricing
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Sample Request Modal */}
      {showSampleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-2xl font-bold">Request Sample & Sales Visit</h3>
              <button
                onClick={() => setShowSampleModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <form className="p-6 space-y-6" onSubmit={(e) => {
              e.preventDefault();
              fpixel.event('Lead', { content_name: 'B2B Sample' });
              setShowSampleModal(false);
              // Add actual form submission logic here
            }}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Name *</label>
                  <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person *</label>
                  <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input type="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                  <input type="tel" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Address *</label>
                <textarea rows={2} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="Full business address"></textarea>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Visit Date</label>
                  <input type="date" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
                  <input type="time" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sample Products Interested In</label>
                <div className="space-y-2">
                  {productCategories.map((product) => (
                    <label key={product.id} className="flex items-center">
                      <input type="checkbox" className="mr-3" />
                      <span>{product.title}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Requirements</label>
                <textarea rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="Any specific requirements for the visit or samples..."></textarea>
              </div>

              <button type="submit" className="w-full bg-primary-600 text-white py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors">
                Schedule Visit & Request Samples
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Simple Enquiry Modal */}
      <EnquiryModal
        isOpen={showEnquiryModal}
        onClose={() => setShowEnquiryModal(false)}
      />

      {/* Fixed Enquiry Button */}
      <button
        onClick={() => setShowEnquiryModal(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 bg-primary-600 text-white px-4 py-8 rounded-l-xl font-bold shadow-lg hover:bg-primary-700 transition-all hover:px-6 z-40 flex items-center space-x-2"
        style={{ writingMode: 'vertical-rl' }}
      >
        <span className="text-lg">ENQUIRY</span>
      </button>

    </Layout>
  );
}
