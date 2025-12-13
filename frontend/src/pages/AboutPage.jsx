import { FiHeart, FiShoppingBag, FiTruck, FiAward, FiUsers, FiStar } from 'react-icons/fi';

const AboutPage = () => {
  const stats = [
    { icon: FiUsers, label: 'Happy Customers', value: '5,000+' },
    { icon: FiShoppingBag, label: 'Products Sold', value: '15,000+' },
    { icon: FiStar, label: 'Customer Rating', value: '4.8/5' },
    { icon: FiTruck, label: 'Orders Delivered', value: '12,000+' },
  ];

  const values = [
    {
      icon: FiHeart,
      title: 'Quality First',
      description: 'We provide only authentic Avon products, ensuring the highest quality for our customers.',
    },
    {
      icon: FiTruck,
      title: 'Fast Delivery',
      description: 'Reliable delivery across Malawi, bringing beauty products right to your doorstep.',
    },
    {
      icon: FiAward,
      title: 'Trusted Brand',
      description: 'Partnering with Avon, a globally recognized beauty brand with over 135 years of excellence.',
    },
    {
      icon: FiUsers,
      title: 'Customer Care',
      description: 'Dedicated support team ready to assist you with any questions or concerns.',
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-pink-600 via-purple-600 to-pink-700 text-white py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float-slow top-10 -left-20"></div>
          <div className="absolute w-80 h-80 bg-pink-300/20 rounded-full blur-3xl animate-float-medium top-40 right-20"></div>
          <div className="absolute w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-float-fast bottom-20 left-1/3"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">About Loita Shop</h1>
            <p className="text-xl md:text-2xl text-gray-100">
              Your trusted destination for authentic Avon beauty and wellness products in Malawi
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="w-24 h-1 bg-linear-to-r from-pink-600 to-purple-600 mx-auto mb-8"></div>
            </div>
            
            <div className="prose prose-lg max-w-none text-gray-600 space-y-6">
              <p className="text-lg leading-relaxed">
                Loita Shop was founded with a simple yet powerful vision: to make high-quality Avon beauty 
                and wellness products accessible to everyone across Malawi. We recognized that many people 
                in our community were seeking authentic, reliable beauty products but faced challenges in 
                accessing them.
              </p>
              
              <p className="text-lg leading-relaxed">
                As an authorized Avon distributor, we take pride in offering only genuine products backed 
                by Avon&apos;s 135+ years of beauty expertise and innovation. Our partnership with this globally 
                trusted brand ensures that every product you receive meets the highest standards of quality 
                and authenticity.
              </p>
              
              <p className="text-lg leading-relaxed">
                From skincare to makeup, fragrances to wellness products, we&apos;ve carefully curated our 
                collection to meet the diverse needs of Malawian customers. Our commitment goes beyond 
                just selling products – we&apos;re here to help you discover beauty solutions that work for you, 
                delivered with care and convenience.
              </p>
              
              <p className="text-lg leading-relaxed">
                Today, we&apos;re proud to serve thousands of satisfied customers across Malawi, building trust 
                one delivery at a time. Thank you for being part of our journey and allowing us to be part 
                of your beauty and wellness story.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-linear-to-br from-pink-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Impact</h2>
            <p className="text-gray-600 text-lg">Numbers that speak for themselves</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-pink-500 to-purple-500 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Values</h2>
            <div className="w-24 h-1 bg-linear-to-r from-pink-600 to-purple-600 mx-auto mb-6"></div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="group bg-white border-2 border-gray-100 rounded-xl p-8 hover:border-pink-500 transition-all hover:shadow-xl"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-pink-100 to-purple-100 rounded-full mb-6 group-hover:scale-110 transition-transform">
                  <value.icon className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-linear-to-b from-white to-pink-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Why Choose Loita Shop?</h2>
              <div className="w-24 h-1 bg-linear-to-r from-pink-600 to-purple-600 mx-auto mb-8"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex space-x-4">
                <div className="shrink-0">
                  <div className="w-12 h-12 bg-linear-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold">✓</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">100% Authentic Products</h3>
                  <p className="text-gray-600">Every item is sourced directly from Avon, guaranteed genuine.</p>
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="shrink-0">
                  <div className="w-12 h-12 bg-linear-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold">✓</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Nationwide Delivery</h3>
                  <p className="text-gray-600">We deliver to all regions across Malawi, reliably and on time.</p>
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="shrink-0">
                  <div className="w-12 h-12 bg-linear-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold">✓</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Payment</h3>
                  <p className="text-gray-600">Safe and secure payment options for your peace of mind.</p>
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="shrink-0">
                  <div className="w-12 h-12 bg-linear-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold">✓</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Support</h3>
                  <p className="text-gray-600">Our team is always ready to help with product recommendations.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-br from-pink-600 via-purple-600 to-pink-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Experience Quality Beauty?</h2>
          <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and discover authentic Avon products today
          </p>
          <a
            href="/products"
            className="inline-block bg-white text-pink-600 px-10 py-4 rounded-lg font-semibold hover:bg-pink-50 transition-all shadow-2xl hover:shadow-pink-300/50 hover:scale-105 transform duration-300"
          >
            Start Shopping Now
          </a>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
