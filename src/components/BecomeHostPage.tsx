import React from 'react';
import { Link } from 'react-router-dom';

export const BecomeHostPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-screen">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/hero-dogs.jpg"
            alt="Person with dog in private park"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
        </div>

        {/* Content Overlay */}
        <div className="relative h-full flex items-center justify-end">
          <div className="container mx-auto px-4">
            <div className="max-w-lg bg-white/95 backdrop-blur-sm rounded-2xl p-8 mr-8 shadow-xl">
              {/* Logo */}
              <div className="flex items-center mb-6">
                <img
                  src="/pawspace-logo.svg"
                  alt="PawSpace"
                  className="h-8"
                />
              </div>

              {/* Main Content */}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Host a private dog park on your land
              </h1>

              <p className="text-xl text-gray-700 mb-6">
                Start earning up to <span className="text-green-500 font-semibold">$3,000</span> per month
              </p>

              {/* CTA Button */}
              <Link
                to="/host/list-property"
                className="block w-full bg-green-500 hover:bg-green-600 text-white text-center font-semibold py-4 px-6 rounded-lg transition duration-150 shadow-md hover:shadow-lg"
              >
                Complete your spot
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why host with PawSpace?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Earn Extra Income</h3>
              <p className="text-gray-600">Turn your unused space into a profitable dog park</p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
              <p className="text-gray-600">We verify all users and provide insurance coverage</p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy to Start</h3>
              <p className="text-gray-600">List your space in minutes and start hosting</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: "What kind of space do I need?",
                answer: "Any secure outdoor space can work - from small urban yards to large rural properties. The key requirements are proper fencing and a safe environment for dogs."
              },
              {
                question: "How much can I earn?",
                answer: "Earnings vary based on your location, space size, and amenities. Hosts typically earn between $500-$3,000 per month."
              },
              {
                question: "Is my property protected?",
                answer: "Yes! We provide insurance coverage for all verified hosts and have a comprehensive verification process for guests."
              },
              {
                question: "How do I get started?",
                answer: "Simply click 'Get Started' above, create your account, and follow our step-by-step guide to list your space. We'll help you every step of the way!"
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-500 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to become a PawSpace host?
          </h2>
          <Link
            to="/host/list-property"
            className="inline-block bg-white text-green-500 font-semibold py-4 px-8 rounded-lg hover:bg-gray-100 transition duration-150 shadow-md hover:shadow-lg"
          >
            Get Started Today
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BecomeHostPage;
