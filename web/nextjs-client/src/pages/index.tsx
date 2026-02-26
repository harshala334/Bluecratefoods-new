import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/Layout';
import { FiClock, FiBookOpen, FiTruck, FiShoppingBag, FiStar, FiArrowRight, FiCheck, FiChevronDown } from 'react-icons/fi';
import { GiCookingPot, GiMeal } from 'react-icons/gi';

import EnquiryModal from '@/components/EnquiryModal';

// Cloudinary Integration
// TODO: [CLOUDINARY] Add helper function to optimize Cloudinary URLs (resize/crop)
// export const getOptimizedImageUrl = (url: string, width: number, height?: number) => { ... }

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentAboutSlide, setCurrentAboutSlide] = useState(0);
  const [currentB2BSlide, setCurrentB2BSlide] = useState(0);
  const [currentD2CSlide, setCurrentD2CSlide] = useState(0);

  const [showEnquiryModal, setShowEnquiryModal] = useState(false);

  const carouselSlides = [
    {
      image: '/Hero_Banner_2.jpg',
      title: '',
      subtitle: '',
      hasButton: false
    },
    {
      image: '/Hero_Banner_3.jpg',
      title: '',
      subtitle: '',
      hasButton: false
    },
    {
      image: '/Hero_Banner_4.jpg',
      title: '',
      subtitle: '',
      hasButton: false
    },
    // {
    //   image: '/Cover.jpg',
    //   title: '',
    //   subtitle: '',
    //   hasButton: false
    // },
    {
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=600&fit=crop',
      title: 'Cook Like a Chef',
      subtitle: 'Restaurant-quality meals at home',
      hasButton: false
    },
    {
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1200&h=600&fit=crop',
      title: 'Fresh & Convenient',
      subtitle: 'Delivered to your doorstep',
      hasButton: false
    },
    // {
    //   image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&h=600&fit=crop',
    //   title: 'Global Flavors',
    //   subtitle: 'Explore cuisines from around the world',
    //   hasButton: false
    // },
    {
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=600&fit=crop',
      title: 'About Our Business',
      subtitle: 'Discover our story and mission to revolutionize home cooking',
      hasButton: true,
      buttonText: 'Learn More',
      buttonLink: '/#about-us',
      buttonColor: 'bg-primary-600 hover:bg-primary-700'
    },
    {
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop',
      title: 'Business-to-Business Solutions',
      subtitle: 'Partner with us and unlock new revenue streams for your business',
      hasButton: true,
      buttonText: 'Explore B2B',
      buttonLink: '/b2b',
      buttonColor: 'bg-primary-600 hover:bg-primary-700',
      hasSecondButton: true,
      secondButtonText: 'Enquiry',
      secondButtonLink: '#',
      secondButtonAction: 'openEnquiryModal',
      secondButtonColor: 'bg-white text-primary-600 border-2 border-white hover:bg-gray-100'
    },
    {
      image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1200&h=600&fit=crop',
      title: 'D2C Direct Delivery',
      subtitle: 'Fresh ingredients and recipes delivered right to your door',
      hasButton: true,
      buttonText: 'Order Now',
      buttonLink: '/d2c',
      buttonColor: 'bg-primary-600 hover:bg-primary-700'
    }
  ];

  const aboutImages = [
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=600&fit=crop'
  ];

  const b2bImages = [
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop'
  ];

  const d2cImages = [
    // TODO: [CLOUDINARY] Replace with optimized Cloudinary URLs
    'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1200&h=600&fit=crop'
  ];

  const aboutContent = [
    {
      title: 'Our Mission',
      description: 'BlueCrateFoods is transforming the way people cook at home. We believe that anyone can create restaurant-quality meals in their own kitchen when they have the right ingredients and guidance.'
    },
    {
      title: 'Our Values',
      description: 'Our mission is to make cooking accessible, convenient, and enjoyable for everyone. We deliver fresh, carefully selected ingredients along with step-by-step recipes and cooking guidance to help you create delicious meals.'
    },
    {
      title: 'Our Vision',
      description: 'Whether you\'re a busy professional looking for quick meals or a passionate home cook wanting to expand your culinary skills, BlueCrateFoods has something for everyone.'
    }
  ];

  const b2bContent = [
    {
      title: 'Enterprise Solutions',
      description: 'Looking to expand your business offerings? BlueCrateFoods provides comprehensive B2B solutions tailored to your needs. Partner with us to offer premium meal kits to your customers.'
    },
    {
      title: 'Custom Integration',
      description: 'Our enterprise platform offers white-label solutions, bulk ordering capabilities, dedicated support, and custom integration options. Scale your business with our proven infrastructure.'
    },
    {
      title: 'Grow Your Business',
      description: 'Whether you\'re a restaurant, corporate office, or retail partner, we have the right solution for your business. Start growing with us today.'
    }
  ];

  const d2cContent = [
    {
      title: 'Fresh & Convenient',
      description: 'Join thousands of home cooks enjoying fresh, delicious meals delivered to their doorstep. Our D2C service makes cooking easier and more enjoyable than ever.'
    },
    {
      title: 'Flexible & Personalized',
      description: 'With over 250+ recipes, flexible subscription plans, nutritionist-approved meals, and expert cooking guidance, we have something for everyone.'
    },
    {
      title: 'Start Your Journey',
      description: 'Start your culinary journey today with ingredients and recipes that fit your lifestyle. Create restaurant-quality meals at home.'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselSlides.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAboutSlide((prev) => (prev + 1) % aboutImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [aboutImages.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentB2BSlide((prev) => (prev + 1) % b2bImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [b2bImages.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentD2CSlide((prev) => (prev + 1) % d2cImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [d2cImages.length]);



  const categories = [
    {
      id: '1min',
      title: '< 1 Minute',
      description: 'Quick bites & instant recipes',
      time: '< 1 min',
      icon: '⚡',
      color: 'from-white to-gray-50 border-2 border-gray-200',
      textColor: 'text-gray-900',
      dishes: 45
    },
    {
      id: '10min',
      title: '< 10 Minutes',
      description: 'Fast & easy meals',
      time: '< 10 min',
      icon: '🔥',
      color: 'from-white to-gray-50 border-2 border-gray-200',
      textColor: 'text-gray-900',
      dishes: 120
    },
    {
      id: '1hour',
      title: '< 1 Hour',
      description: 'Gourmet experiences',
      time: '< 1 hr',
      icon: '👨‍🍳',
      color: 'from-white to-gray-50 border-2 border-gray-200',
      textColor: 'text-gray-900',
      dishes: 89
    }
  ];

  const features = [
    {
      icon: <FiShoppingBag className="w-8 h-8" />,
      title: 'Browse Dishes',
      description: 'Explore hundreds of delicious recipes by cooking time',
      color: 'bg-primary-50 text-primary-600'
    },
    {
      icon: <FiCheck className="w-8 h-8" />,
      title: 'Select Ingredients',
      description: 'Choose exactly what you need with smart checkboxes',
      color: 'bg-primary-50 text-primary-600'
    },
    {
      icon: <FiTruck className="w-8 h-8" />,
      title: 'Get Delivered',
      description: 'Fresh ingredients delivered right to your door',
      color: 'bg-primary-50 text-primary-600'
    },
    {
      icon: <GiCookingPot className="w-8 h-8" />,
      title: 'Cook with Guidance',
      description: 'Step-by-step instructions with built-in timers',
      color: 'bg-purple-50 text-purple-600'
    }
  ];

  const popularDishes = [
    {
      id: 1,
      name: 'Avocado Toast Supreme',
      image: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=500',
      time: '5 min',
      difficulty: 'Easy',
      servings: 2,
      rating: 4.8,
      ingredients: 6
    },
    {
      id: 2,
      name: 'Creamy Pasta',
      image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500',
      time: '25 min',
      difficulty: 'Medium',
      servings: 4,
      rating: 4.9,
      ingredients: 8
    },
    {
      id: 3,
      name: 'Thai Green Curry',
      image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=500',
      time: '35 min',
      difficulty: 'Medium',
      servings: 4,
      rating: 4.7,
      ingredients: 12
    },
    {
      id: 4,
      name: 'Margherita Pizza',
      image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500',
      time: '45 min',
      difficulty: 'Hard',
      servings: 4,
      rating: 4.9,
      ingredients: 10
    }
  ];

  return (
    <Layout>
      <Head>
        <title>BlueCrateFoods - Ready-to-Cook. Ready-to-Love.</title>
        <meta name="description" content="Get fresh ingredients and cook amazing meals at home" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bluecratefoods.com/" />
        <meta property="og:title" content="BlueCrateFoods - Ready-to-Cook. Ready-to-Love." />
        <meta property="og:description" content="Get fresh ingredients and cook amazing meals at home" />
        <meta property="og:image" content="https://bluecratefoods.com/BCF_logo.png" />

        {/* Structured Data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "BlueCrateFoods",
              "url": "https://bluecratefoods.com",
              "logo": "https://bluecratefoods.com/BCF_logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91 9591890828",
                "contactType": "customer service",
                "email": "connect@bluecratefoods.com"
              },
              "sameAs": [
                "https://www.facebook.com/share/1AR6h9ynfS/",
                "https://www.instagram.com/blue.crate.foods?igsh=d3U2MHVlOGprNDcz"
              ]
            })
          }}
        />
      </Head>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-green-50 overflow-hidden pt-6">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container-custom relative z-10">
          {/* Image Carousel */}
          <div className="relative w-full flex items-center justify-center">
            {/* Aspect ratio container - maintains 16:9 ratio, adapts to width on mobile */}
            <div className="relative w-full rounded-2xl overflow-hidden shadow-hard" style={{ aspectRatio: '16/9', maxHeight: 'min(calc(100vh - 104px), 800px)', maxWidth: 'calc(min(calc(100vh - 104px), 800px) * 16 / 9)' }}>
              <div className="relative w-full h-full">
                <div className="relative w-full h-full">
                  {carouselSlides.map((slide, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                        }`}
                    >
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        className="object-fill"
                        style={{ objectFit: 'fill' }}
                        priority={index === currentSlide}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1420px"
                      />


                      {/* Overlay with gradient for better text visibility */}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

                      {/* Content overlay */}
                      <div className="absolute inset-0 flex flex-col justify-center px-8 lg:px-16">
                        <div className="max-w-2xl">
                          <h1 className="text-4xl lg:text-6xl font-display font-bold text-white mb-4 drop-shadow-lg">
                            {slide.title}
                          </h1>
                          <p className="text-xl lg:text-2xl text-white/90 mb-8 drop-shadow-md">
                            {slide.subtitle}
                          </p>

                          {/* Button in corner for specific slides */}
                          {slide.hasButton && slide.buttonLink && (
                            <div className="flex flex-wrap gap-4">
                              <Link
                                href={slide.buttonLink}
                                className={`inline-flex items-center space-x-2 px-8 py-4 ${slide.buttonColor} text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}
                              >
                                <span>{slide.buttonText}</span>
                                <FiArrowRight className="w-5 h-5" />
                              </Link>

                              {/* @ts-ignore */}
                              {slide.hasSecondButton && (
                                <button
                                  onClick={() => {
                                    /* @ts-ignore */
                                    if (slide.secondButtonAction === 'openEnquiryModal') {
                                      setShowEnquiryModal(true);
                                    }
                                  }}
                                  /* @ts-ignore */
                                  className={`inline-flex items-center space-x-2 px-8 py-4 ${slide.secondButtonColor} rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}
                                >
                                  {/* @ts-ignore */}
                                  <span>{slide.secondButtonText}</span>
                                  <FiArrowRight className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Carousel Dots */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                  {carouselSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all ${index === currentSlide
                        ? 'bg-white w-8'
                        : 'bg-white/50 hover:bg-white/75'
                        }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>


        </div>
      </section>


      {/* B2B Carousel Section */}
      <section id="b2b-section" className="py-20 bg-gradient-to-b from-amber-50/80 to-yellow-50/80">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-4">
              Business-to-Business Solutions
            </h2>
            <p className="text-xl text-gray-600">Quality & consistency minus the business hassles</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image Carousel */}
            <div className="relative h-80 lg:h-96 order-last md:order-first">
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-hard">
                <div className="relative w-full h-full">
                  {b2bImages.map((image, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-1000 ${index === currentB2BSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                      <Image
                        src={image}
                        alt={`B2B slide ${index + 1}`}
                        fill
                        className="w-full h-full object-cover"
                        priority={index === currentB2BSlide}
                      />
                    </div>
                  ))}
                </div>

                {/* Carousel Dots for Images */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                  {b2bImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentB2BSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all ${index === currentB2BSlide
                        ? 'bg-white w-8'
                        : 'bg-white/50 hover:bg-white/75'
                        }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Text Carousel */}
            <div className="relative min-h-[20rem] lg:min-h-[24rem] bg-gradient-to-br from-amber-50 to-yellow-100 p-4 sm:p-6 lg:p-8 rounded-2xl border-2 border-amber-200 flex flex-col justify-center overflow-hidden">
              <div className="relative flex-1 overflow-hidden">
                {b2bContent.map((item, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 flex flex-col justify-center overflow-hidden p-2 ${index === currentB2BSlide ? 'opacity-100' : 'opacity-0'
                      }`}
                  >
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-display font-bold mb-2 sm:mb-3 text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Carousel Dots for Text */}
              <div className="flex gap-2 justify-center mt-8">
                {b2bContent.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentB2BSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${index === currentB2BSlide
                      ? 'bg-amber-600 w-8'
                      : 'bg-amber-200 hover:bg-amber-300'
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Button */}
              <div className="mt-4 flex flex-wrap justify-center z-10 gap-3 sm:gap-4">
                <Link href="/b2b" className="inline-flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-xl text-sm sm:text-base font-semibold hover:from-amber-600 hover:to-yellow-700 shadow-lg hover:shadow-amber-200 transition-all transform hover:-translate-y-1">
                  <span>Explore B2B</span>
                  <FiArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
                <button
                  onClick={() => setShowEnquiryModal(true)}
                  className="inline-flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-white text-amber-600 border-2 border-amber-100 rounded-xl text-sm sm:text-base font-semibold hover:bg-amber-50 hover:border-amber-200 shadow-lg hover:shadow-amber-100 transition-all transform hover:-translate-y-1"
                >
                  <span>Enquiry</span>
                  <FiArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* D2C Carousel Section */}
      <section className="py-20 bg-gradient-to-b from-rose-50/80 to-red-50/80">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-4">
              Direct-to-Customer Products store
            </h2>
            <p className="text-xl text-gray-600">Delicious meals, Ready in Minutes</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Carousel */}
            <div className="relative min-h-[20rem] lg:min-h-[24rem] bg-gradient-to-br from-rose-50 to-red-100 p-4 sm:p-6 lg:p-8 rounded-2xl border-2 border-rose-200 flex flex-col justify-center overflow-hidden">
              <div className="relative flex-1 overflow-hidden">
                {d2cContent.map((item, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 flex flex-col justify-center overflow-hidden p-2 ${index === currentD2CSlide ? 'opacity-100' : 'opacity-0'
                      }`}
                  >
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-display font-bold mb-2 sm:mb-3 text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Carousel Dots for Text */}
              <div className="flex gap-2 justify-center mt-8">
                {d2cContent.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentD2CSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${index === currentD2CSlide
                      ? 'bg-rose-600 w-8'
                      : 'bg-rose-200 hover:bg-rose-300'
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Button */}
              <div className="mt-4 flex justify-center z-10">
                <Link href="/d2c" className="inline-flex items-center space-x-2 px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-xl text-sm sm:text-base font-semibold hover:from-rose-600 hover:to-red-700 shadow-lg hover:shadow-rose-200 transition-all transform hover:-translate-y-1">
                  <span>Explore D2C</span>
                  <FiArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              </div>
            </div>

            {/* Image Carousel */}
            <div className="relative h-80 lg:h-96">
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-hard">
                <div className="relative w-full h-full">
                  {d2cImages.map((image, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-1000 ${index === currentD2CSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                      <Image
                        src={image}
                        alt={`D2C slide ${index + 1}`}
                        fill
                        className="w-full h-full object-cover"
                        priority={index === currentD2CSlide}
                      />
                    </div>
                  ))}
                </div>

                {/* Carousel Dots for Images */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                  {d2cImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentD2CSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all ${index === currentD2CSlide
                        ? 'bg-white w-8'
                        : 'bg-white/50 hover:bg-white/75'
                        }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* About Us Carousel Section */}
      <section id="about-us" className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-4">
              About BlueCrateFoods
            </h2>
            <p className="text-xl text-gray-600">Learn more about our mission and values</p>
          </div>

          <div className="relative">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Text Carousel */}
              <div className="relative min-h-[20rem] lg:min-h-[24rem] bg-gradient-to-br from-primary-50 to-green-50 p-4 sm:p-6 lg:p-8 rounded-2xl flex flex-col justify-center order-last md:order-last overflow-hidden">
                <div className="relative flex-1 overflow-hidden">
                  {aboutContent.map((item, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-1000 flex flex-col justify-center overflow-hidden p-2 ${index === currentAboutSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-display font-bold mb-2 sm:mb-3 text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Carousel Dots for Text */}
                <div className="flex gap-2 justify-center mt-4 z-10">
                  {aboutContent.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentAboutSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all ${index === currentAboutSlide
                        ? 'bg-primary-600 w-8'
                        : 'bg-primary-300 hover:bg-primary-400'
                        }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Image Carousel */}
              <div className="relative h-80 lg:h-96">
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-hard">
                  <div className="relative w-full h-full">
                    {aboutImages.map((image, index) => (
                      <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ${index === currentAboutSlide ? 'opacity-100' : 'opacity-0'
                          }`}
                      >
                        <Image
                          src={image}
                          alt={`About slide ${index + 1}`}
                          fill
                          className="w-full h-full object-cover"
                          style={{ objectFit: 'cover' }}
                          priority={index === currentAboutSlide}

                        />
                      </div>
                    ))}
                  </div>

                  {/* Carousel Dots for Images */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                    {aboutImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentAboutSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all ${index === currentAboutSlide
                          ? 'bg-white w-8'
                          : 'bg-white/50 hover:bg-white/75'
                          }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contacts Section */}
      <section id="contacts" className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-4">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-600">We&apos;d love to hear from you</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Email</h3>
              <p className="text-gray-600">
                <a href="mailto:connect@bluecratefoods.com" className="hover:text-primary-600 transition">
                  connect@bluecratefoods.com
                </a>
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Phone</h3>
              <p className="text-gray-600">
                <a href="tel:+91 9591890828" className="hover:text-primary-600 transition">
                  +91 9591890828
                </a>
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Address</h3>
              <p className="text-gray-600">
                181, Becharam Chatterjee Road,<br />Behala, Kolkata-700061
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* Fixed Enquiry Button */}
      <button
        onClick={() => setShowEnquiryModal(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 bg-primary-600 text-white px-4 py-8 rounded-l-xl font-bold shadow-lg hover:bg-primary-700 transition-all hover:px-6 z-40 flex items-center space-x-2"
        style={{ writingMode: 'vertical-rl' }}
      >
        <span className="text-lg">ENQUIRY</span>
      </button>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={showEnquiryModal}
        onClose={() => setShowEnquiryModal(false)}
      />
    </Layout>
  );
}

