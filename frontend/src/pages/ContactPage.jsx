import { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiClock, FiFacebook, FiInstagram, FiTwitter, FiSend } from 'react-icons/fi';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const contactInfo = [
    {
      icon: FiPhone,
      title: 'Phone',
      details: ['+265 xxx xxx xxx', '+265 xxx xxx xxx'],
      description: 'Mon-Sat, 8AM-6PM',
    },
    {
      icon: FiMail,
      title: 'Email',
      details: ['info@loitashop.mw', 'support@loitashop.mw'],
      description: 'We reply within 24 hours',
    },
    {
      icon: FiMapPin,
      title: 'Location',
      details: ['Blantyre, Malawi'],
      description: 'Serving nationwide',
    },
    {
      icon: FiClock,
      title: 'Business Hours',
      details: ['Mon - Sat: 8AM - 6PM', 'Sunday: Closed'],
      description: 'Online orders 24/7',
    },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitting(false);
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });

        // Clear success message after 5 seconds
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        setIsSubmitting(false);
        setSubmitStatus('error');
        setTimeout(() => setSubmitStatus(null), 5000);
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setIsSubmitting(false);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

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
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Get in Touch</h1>
            <p className="text-xl md:text-2xl text-gray-100">
              We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 bg-linear-to-b from-white to-pink-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 -mt-32 relative z-10">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-pink-500 to-purple-500 rounded-full mb-6">
                  <info.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{info.title}</h3>
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-gray-700 font-medium mb-1">
                    {detail}
                  </p>
                ))}
                <p className="text-gray-500 text-sm mt-2">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div>
              <div className="mb-8">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Send us a Message</h2>
                <div className="w-24 h-1 bg-linear-to-r from-pink-600 to-purple-600 mb-4"></div>
                <p className="text-gray-600 text-lg">
                  Fill out the form below and we&apos;ll get back to you as soon as possible.
                </p>
              </div>

              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                  <p className="font-semibold">✓ Message sent successfully!</p>
                  <p className="text-sm">We&apos;ll get back to you within 24 hours.</p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  <p className="font-semibold">✗ Failed to send message</p>
                  <p className="text-sm">Please try again or contact us directly via email.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-gray-700 font-semibold mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                      placeholder="+265 xxx xxx xxx"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-gray-700 font-semibold mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                    >
                      <option value="">Select a subject</option>
                      <option value="product">Product Inquiry</option>
                      <option value="order">Order Status</option>
                      <option value="partnership">Business Partnership</option>
                      <option value="complaint">Complaint</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition resize-none"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-linear-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all hover:scale-105 transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <FiSend className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Additional Info */}
            <div className="space-y-8">
              {/* FAQ Section */}
              <div className="bg-linear-to-br from-pink-50 to-purple-50 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">How long does delivery take?</h4>
                    <p className="text-gray-600">Delivery typically takes 2-5 business days within Malawi, depending on your location.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Do you offer returns?</h4>
                    <p className="text-gray-600">Yes, we accept returns within 7 days of delivery for unopened products in original packaging.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Are all products authentic?</h4>
                    <p className="text-gray-600">100% authentic Avon products sourced directly from authorized distributors.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h4>
                    <p className="text-gray-600">We accept mobile money, bank transfers, and cash on delivery.</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white border-2 border-gray-100 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Follow Us</h3>
                <p className="text-gray-600 mb-6">Stay connected and get the latest updates on new products and special offers.</p>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="inline-flex items-center justify-center w-12 h-12 bg-linear-to-br from-pink-500 to-purple-500 text-white rounded-full hover:scale-110 transition-transform"
                  >
                    <FiFacebook className="w-6 h-6" />
                  </a>
                  <a
                    href="#"
                    className="inline-flex items-center justify-center w-12 h-12 bg-linear-to-br from-pink-500 to-purple-500 text-white rounded-full hover:scale-110 transition-transform"
                  >
                    <FiInstagram className="w-6 h-6" />
                  </a>
                  <a
                    href="#"
                    className="inline-flex items-center justify-center w-12 h-12 bg-linear-to-br from-pink-500 to-purple-500 text-white rounded-full hover:scale-110 transition-transform"
                  >
                    <FiTwitter className="w-6 h-6" />
                  </a>
                </div>
              </div>

              {/* Map */}
              <div className="bg-gray-100 rounded-xl overflow-hidden h-96 shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3232.3103538678265!2d33.753627775093186!3d-13.915593086493576!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTPCsDU0JzU2LjEiUyAzM8KwNDUnMjIuMyJF!5e1!3m2!1sen!2smw!4v1765625075176!5m2!1sen!2smw"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Loita Shop Location - Lilongwe, Area 49"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-br from-pink-600 via-purple-600 to-pink-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Have Questions About Our Products?</h2>
          <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
            Browse our product catalog or reach out to our team for personalized recommendations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/products"
              className="inline-block bg-white text-pink-600 px-10 py-4 rounded-lg font-semibold hover:bg-pink-50 transition-all shadow-2xl hover:shadow-pink-300/50 hover:scale-105 transform duration-300"
            >
              Browse Products
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-block bg-white/10 backdrop-blur-md border-2 border-white/50 text-white px-10 py-4 rounded-lg font-semibold hover:bg-white hover:text-pink-600 transition-all hover:scale-105 transform duration-300 shadow-xl"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
