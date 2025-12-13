import { FiShield, FiLock, FiMail, FiPhone } from 'react-icons/fi';

const PrivacyPolicy = () => {
  const sections = [
    {
      title: '1. Information We Collect',
      content: [
        {
          subtitle: 'Personal Information',
          text: 'When you create an account or place an order, we collect personal information such as your name, email address, phone number, delivery address, and payment information.',
        },
        {
          subtitle: 'Order Information',
          text: 'We collect details about the products you purchase, order history, and preferences to improve your shopping experience.',
        },
        {
          subtitle: 'Technical Information',
          text: 'We automatically collect certain information about your device, including IP address, browser type, operating system, and browsing behavior on our website.',
        },
      ],
    },
    {
      title: '2. How We Use Your Information',
      content: [
        {
          text: '• Process and fulfill your orders, including shipping and delivery',
        },
        {
          text: '• Communicate with you about your orders, account, and customer service inquiries',
        },
        {
          text: '• Send you promotional offers, new product announcements, and newsletters (with your consent)',
        },
        {
          text: '• Improve our website, products, and services based on your feedback and usage patterns',
        },
        {
          text: '• Prevent fraud and enhance the security of our platform',
        },
        {
          text: '• Comply with legal obligations and resolve disputes',
        },
      ],
    },
    {
      title: '3. Information Sharing and Disclosure',
      content: [
        {
          subtitle: 'We do not sell your personal information.',
          text: 'We may share your information with:',
        },
        {
          text: '• Delivery partners to fulfill your orders',
        },
        {
          text: '• Payment processors to handle transactions securely',
        },
        {
          text: '• Service providers who assist with website operations, email delivery, and analytics',
        },
        {
          text: '• Law enforcement or regulatory authorities when required by law',
        },
      ],
    },
    {
      title: '4. Data Security',
      content: [
        {
          text: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:',
        },
        {
          text: '• SSL encryption for secure data transmission',
        },
        {
          text: '• Secure servers and databases with restricted access',
        },
        {
          text: '• Regular security assessments and updates',
        },
        {
          text: '• Employee training on data protection',
        },
      ],
    },
    {
      title: '5. Cookies and Tracking Technologies',
      content: [
        {
          text: 'Our website uses cookies and similar technologies to enhance your browsing experience, remember your preferences, and analyze website traffic. You can control cookie settings through your browser preferences.',
        },
      ],
    },
    {
      title: '6. Your Rights',
      content: [
        {
          text: 'You have the right to:',
        },
        {
          text: '• Access the personal information we hold about you',
        },
        {
          text: '• Request correction of inaccurate or incomplete information',
        },
        {
          text: '• Request deletion of your personal information',
        },
        {
          text: '• Opt-out of marketing communications at any time',
        },
        {
          text: '• Withdraw consent for data processing where applicable',
        },
        {
          text: '• Lodge a complaint with relevant data protection authorities',
        },
      ],
    },
    {
      title: '7. Data Retention',
      content: [
        {
          text: 'We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. Order history and transaction records are kept for accounting and legal purposes.',
        },
      ],
    },
    {
      title: '8. Third-Party Links',
      content: [
        {
          text: 'Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review their privacy policies before providing any personal information.',
        },
      ],
    },
    {
      title: '9. Children\'s Privacy',
      content: [
        {
          text: 'Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a minor, please contact us immediately.',
        },
      ],
    },
    {
      title: '10. International Data Transfers',
      content: [
        {
          text: 'Your information may be transferred to and processed in countries outside Malawi. We ensure appropriate safeguards are in place to protect your data in accordance with applicable data protection laws.',
        },
      ],
    },
    {
      title: '11. Changes to This Privacy Policy',
      content: [
        {
          text: 'We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on our website and updating the "Last Updated" date.',
        },
      ],
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-pink-600 via-purple-600 to-pink-700 text-white py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float-slow top-10 -left-20"></div>
          <div className="absolute w-80 h-80 bg-pink-300/20 rounded-full blur-3xl animate-float-medium top-40 right-20"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-md rounded-full mb-6">
              <FiShield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-gray-100">
              Last Updated: December 13, 2025
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg mb-12">
              <p className="text-gray-700 leading-relaxed">
                At Loita Shop, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our 
                website and use our services. By using Loita Shop, you agree to the collection and use of information in 
                accordance with this policy.
              </p>
            </div>

            {/* Policy Sections */}
            <div className="space-y-12">
              {sections.map((section, index) => (
                <div key={index}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{section.title}</h2>
                  <div className="space-y-4">
                    {section.content.map((item, idx) => (
                      <div key={idx}>
                        {item.subtitle && (
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.subtitle}</h3>
                        )}
                        <p className="text-gray-600 leading-relaxed">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Section */}
            <div className="mt-12 bg-linear-to-br from-pink-50 to-purple-50 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us About Privacy</h2>
              <p className="text-gray-600 mb-6">
                If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your 
                personal information, please contact us:
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                    <FiMail className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <a href="mailto:privacy@loitashop.mw" className="text-pink-600 hover:text-pink-700">
                      privacy@loitashop.mw
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                    <FiPhone className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Phone</p>
                    <p className="text-gray-600">+265 xxx xxx xxx</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                    <FiLock className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Data Protection Officer</p>
                    <p className="text-gray-600">Available upon request</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
