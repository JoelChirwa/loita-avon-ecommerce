import { FiFileText, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const TermsAndConditions = () => {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: [
        {
          text: 'By accessing and using Loita Shop, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website or services. We reserve the right to modify these terms at any time, and continued use of the website after changes constitutes acceptance of the modified terms.',
        },
      ],
    },
    {
      title: '2. Use of the Website',
      content: [
        {
          subtitle: 'Eligibility',
          text: 'You must be at least 18 years old to make purchases on our website. By placing an order, you confirm that you are of legal age and have the legal capacity to enter into binding contracts.',
        },
        {
          subtitle: 'Account Responsibilities',
          text: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.',
        },
        {
          subtitle: 'Prohibited Uses',
          text: 'You agree not to use the website for any unlawful purpose, to violate any laws, to transmit harmful code, to collect user information without consent, or to interfere with the proper functioning of the website.',
        },
      ],
    },
    {
      title: '3. Product Information and Pricing',
      content: [
        {
          text: '• All products are authentic Avon products sourced from authorized distributors',
        },
        {
          text: '• We strive to display accurate product information, but we do not guarantee that descriptions, images, or other content is error-free',
        },
        {
          text: '• Prices are listed in Malawian Kwacha (MWK) and are subject to change without notice',
        },
        {
          text: '• We reserve the right to correct pricing errors and cancel orders affected by such errors',
        },
        {
          text: '• Product availability is subject to change, and we reserve the right to limit quantities or discontinue products',
        },
      ],
    },
    {
      title: '4. Orders and Payment',
      content: [
        {
          subtitle: 'Order Process',
          text: 'When you place an order, you are making an offer to purchase products. We reserve the right to accept or reject your order for any reason. Order confirmation does not guarantee acceptance.',
        },
        {
          subtitle: 'Payment',
          text: 'We accept mobile money payments, bank transfers, and cash on delivery. Payment must be received before order processing begins. All payments are processed securely through our payment partners.',
        },
        {
          subtitle: 'Order Cancellation',
          text: 'You may cancel your order within 24 hours of placement if it has not been processed. Once an order is shipped, cancellation is not possible, but returns are accepted according to our return policy.',
        },
      ],
    },
    {
      title: '5. Shipping and Delivery',
      content: [
        {
          text: '• We deliver to all regions within Malawi',
        },
        {
          text: '• Delivery times are estimates and may vary based on location and circumstances beyond our control',
        },
        {
          text: '• Shipping costs are calculated at checkout based on delivery location',
        },
        {
          text: '• Risk of loss and title for products pass to you upon delivery',
        },
        {
          text: '• You must provide accurate delivery information; we are not responsible for delays or non-delivery due to incorrect addresses',
        },
      ],
    },
    {
      title: '6. Returns and Refunds',
      content: [
        {
          subtitle: 'Return Policy',
          text: 'We accept returns within 7 days of delivery for unopened products in their original packaging. Products must be in resalable condition with all tags and seals intact.',
        },
        {
          subtitle: 'Non-Returnable Items',
          text: 'For hygiene and safety reasons, opened cosmetics, fragrances, and personal care products cannot be returned unless defective.',
        },
        {
          subtitle: 'Refund Process',
          text: 'Approved returns will be refunded to the original payment method within 7-14 business days. Shipping costs are non-refundable unless the return is due to our error or a defective product.',
        },
        {
          subtitle: 'Damaged or Defective Products',
          text: 'If you receive damaged or defective products, contact us within 48 hours of delivery with photos. We will arrange a replacement or full refund, including shipping costs.',
        },
      ],
    },
    {
      title: '7. Intellectual Property',
      content: [
        {
          text: 'All content on this website, including text, graphics, logos, images, and software, is the property of Loita Shop or its content suppliers and is protected by intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our express written permission.',
        },
        {
          text: 'Avon® and related trademarks are the property of Avon Products, Inc. We are an authorized distributor and do not claim ownership of these trademarks.',
        },
      ],
    },
    {
      title: '8. User Content',
      content: [
        {
          text: 'By submitting reviews, comments, or other content to our website, you grant us a non-exclusive, royalty-free, perpetual, and worldwide license to use, reproduce, modify, and display such content. You represent that you own or have the necessary rights to the content you submit.',
        },
        {
          text: 'We reserve the right to remove any user content that violates these terms or is deemed inappropriate.',
        },
      ],
    },
    {
      title: '9. Limitation of Liability',
      content: [
        {
          text: 'To the fullest extent permitted by law, Loita Shop shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the website or products purchased through the website.',
        },
        {
          text: 'Our total liability for any claim arising from your use of the website shall not exceed the amount you paid for the specific product or service giving rise to the claim.',
        },
        {
          text: 'We do not warrant that the website will be uninterrupted, error-free, or free from viruses or other harmful components.',
        },
      ],
    },
    {
      title: '10. Indemnification',
      content: [
        {
          text: 'You agree to indemnify, defend, and hold harmless Loita Shop, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of the website, violation of these terms, or violation of any third-party rights.',
        },
      ],
    },
    {
      title: '11. Privacy and Data Protection',
      content: [
        {
          text: 'Your use of the website is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal information. By using the website, you consent to our data practices as described in the Privacy Policy.',
        },
      ],
    },
    {
      title: '12. Third-Party Links',
      content: [
        {
          text: 'Our website may contain links to third-party websites for your convenience. We are not responsible for the content, privacy practices, or terms of these external sites. Your interactions with third-party sites are solely between you and the third party.',
        },
      ],
    },
    {
      title: '13. Dispute Resolution',
      content: [
        {
          subtitle: 'Governing Law',
          text: 'These Terms and Conditions are governed by and construed in accordance with the laws of Malawi.',
        },
        {
          subtitle: 'Dispute Resolution',
          text: 'Any disputes arising from these terms or your use of the website shall be resolved through good faith negotiation. If negotiation fails, disputes shall be resolved through arbitration in Malawi in accordance with applicable arbitration rules.',
        },
      ],
    },
    {
      title: '14. Force Majeure',
      content: [
        {
          text: 'We shall not be liable for any failure or delay in performance due to circumstances beyond our reasonable control, including but not limited to acts of God, war, terrorism, civil unrest, labor disputes, government actions, or technical failures.',
        },
      ],
    },
    {
      title: '15. Severability',
      content: [
        {
          text: 'If any provision of these Terms and Conditions is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable.',
        },
      ],
    },
    {
      title: '16. Entire Agreement',
      content: [
        {
          text: 'These Terms and Conditions, together with our Privacy Policy and any other legal notices published on the website, constitute the entire agreement between you and Loita Shop regarding your use of the website.',
        },
      ],
    },
    {
      title: '17. Contact Information',
      content: [
        {
          text: 'For questions about these Terms and Conditions, please contact us at legal@loitashop.mw or +265 xxx xxx xxx.',
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
              <FiFileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms &amp; Conditions</h1>
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
            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-r-lg mb-12">
              <div className="flex items-start space-x-3">
                <FiAlertCircle className="w-6 h-6 text-yellow-600 shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Please Read Carefully</h3>
                  <p className="text-gray-700 leading-relaxed">
                    These Terms and Conditions govern your use of the Loita Shop website and the purchase of products. 
                    By accessing our website and placing orders, you agree to be bound by these terms. If you do not agree 
                    with any part of these terms, you should not use our website.
                  </p>
                </div>
              </div>
            </div>

            {/* Terms Sections */}
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

            {/* Acceptance Notice */}
            <div className="mt-12 bg-linear-to-br from-green-50 to-blue-50 rounded-xl p-8">
              <div className="flex items-start space-x-4">
                <div className="shrink-0">
                  <FiCheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Acknowledgment</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    By using Loita Shop and making purchases, you acknowledge that you have read, understood, and agree 
                    to be bound by these Terms and Conditions. You also acknowledge that you have read and understood our 
                    Privacy Policy.
                  </p>
                  <p className="text-gray-600 text-sm">
                    For any questions or concerns regarding these terms, please contact us at{' '}
                    <a href="mailto:legal@loitashop.mw" className="text-pink-600 hover:text-pink-700 font-semibold">
                      legal@loitashop.mw
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsAndConditions;
