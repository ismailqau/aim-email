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

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import { Button, Input, Typography } from '@email-system/ui';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authApi.register(formData);
      localStorage.setItem('auth_token', response.data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <Typography variant='h2' className='text-center'>
            Create your account
          </Typography>
          <Typography variant='muted' className='mt-2 text-center'>
            Or{' '}
            <Link
              href='/login'
              className='font-medium text-blue-600 hover:text-blue-500'
            >
              sign in to existing account
            </Link>
          </Typography>
        </div>
        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          {error && (
            <div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded'>
              <Typography variant='small' color='destructive'>
                {error}
              </Typography>
            </div>
          )}
          <div>
            <Input
              name='name'
              type='text'
              required
              placeholder='Full name'
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <Input
              name='email'
              type='email'
              required
              placeholder='Email address'
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <Input
              name='password'
              type='password'
              required
              minLength={8}
              placeholder='Password (min 8 characters)'
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <Button type='submit' disabled={isLoading} className='w-full'>
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
      </div>
    </div>
  );
}
