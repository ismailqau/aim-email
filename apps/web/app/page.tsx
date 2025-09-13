/**
 * AI Email Marketing System
 * Copyright (c) 2024 Muhammad Ismail
 * Email: ismail@aimnovo.com
 * Founder: AimNovo.com | AimNexus.ai
 *
 * Licensed under the MIT License.
 * See LICENSE file in the project root for full license information.
 *
 * For commercial use, please maintain proper attribution.
 */

import { Button, Typography } from '@email-system/ui';

export default function HomePage() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 py-12'>
        <div className='text-center'>
          <Typography variant='h1' className='mb-6'>
            AI Email Marketing System
          </Typography>
          <Typography variant='lead' className='mb-8' color='secondary'>
            Automate your email campaigns with AI-powered personalization
          </Typography>
          <div className='space-x-4'>
            <Button size='lg'>Get Started</Button>
            <Button variant='secondary' size='lg'>
              Learn More
            </Button>
          </div>
        </div>

        <div className='mt-16 grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <Typography variant='large' className='mb-3'>
              AI-Powered Emails
            </Typography>
            <Typography variant='p' color='secondary'>
              Generate personalized email content using advanced AI algorithms
            </Typography>
          </div>

          <div className='bg-white p-6 rounded-lg shadow-md'>
            <Typography variant='large' className='mb-3'>
              Automated Pipelines
            </Typography>
            <Typography variant='p' color='secondary'>
              Create sophisticated email sequences with conditional logic
            </Typography>
          </div>

          <div className='bg-white p-6 rounded-lg shadow-md'>
            <Typography variant='large' className='mb-3'>
              Advanced Analytics
            </Typography>
            <Typography variant='p' color='secondary'>
              Track performance and optimize your campaigns with detailed
              metrics
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
