/**
 * AI Email Marketing System
 * Copyright (c) 2024 Muhammad Ismail
 * Email: quaid@live.com
 * Founder: AimNovo.com | AimNexus.ai
 *
 * Licensed under the MIT License.
 * See LICENSE file in the project root for full license information.
 *
 * For commercial use, please maintain proper attribution.
 */

export default function HomePage() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 py-12'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-gray-900 mb-6'>
            AI Email Marketing System
          </h1>
          <p className='text-xl text-gray-600 mb-8'>
            Automate your email campaigns with AI-powered personalization
          </p>
          <div className='space-x-4'>
            <button className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg'>
              Get Started
            </button>
            <button className='bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg'>
              Learn More
            </button>
          </div>
        </div>

        <div className='mt-16 grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h3 className='text-lg font-semibold mb-3'>AI-Powered Emails</h3>
            <p className='text-gray-600'>
              Generate personalized email content using advanced AI algorithms
            </p>
          </div>

          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h3 className='text-lg font-semibold mb-3'>Automated Pipelines</h3>
            <p className='text-gray-600'>
              Create sophisticated email sequences with conditional logic
            </p>
          </div>

          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h3 className='text-lg font-semibold mb-3'>Advanced Analytics</h3>
            <p className='text-gray-600'>
              Track performance and optimize your campaigns with detailed
              metrics
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
