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

import React, { useState, useCallback } from 'react';
import {
  DashboardLayout,
  Button,
  Typography,
  UploadIcon,
  DownloadIcon,
  CheckIcon,
  XIcon,
  ArrowLeftIcon,
} from '@email-system/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ImportResult {
  summary: {
    totalRows: number;
    successfulImports: number;
    failedImports: number;
  };
  errors: string[];
}

export default function LeadsImportPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (
        droppedFile.type === 'text/csv' ||
        droppedFile.name.endsWith('.csv')
      ) {
        setFile(droppedFile);
      } else {
        alert('Please upload a CSV file');
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/leads/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result: ImportResult = await response.json();
        setImportResult(result);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent =
      'email,firstName,lastName,title,companyName\njohn@example.com,John,Doe,CEO,Example Corp\njane@example.com,Jane,Smith,CTO,Tech Solutions';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const resetImport = () => {
    setFile(null);
    setImportResult(null);
  };

  return (
    <DashboardLayout
      title='Import Leads'
      subtitle='Upload leads from CSV file'
      actions={
        <Link href='/dashboard/leads'>
          <Button variant='outline' className='flex items-center space-x-2'>
            <ArrowLeftIcon size={16} />
            <span>Back to Leads</span>
          </Button>
        </Link>
      }
    >
      <div className='max-w-4xl mx-auto space-y-6'>
        {!importResult ? (
          <>
            {/* Instructions */}
            <div className='bg-blue-50 border border-blue-200 rounded-lg p-6'>
              <Typography
                variant='h3'
                className='text-lg font-semibold text-blue-900 mb-3'
              >
                Import Instructions
              </Typography>
              <div className='space-y-2 text-blue-800'>
                <p>• Upload a CSV file with lead information</p>
                <p>
                  • Required column: <strong>email</strong>
                </p>
                <p>
                  • Optional columns: firstName, lastName, title, companyName
                </p>
                <p>• Maximum file size: 10MB</p>
                <p>• Duplicate emails will be skipped</p>
              </div>
              <div className='mt-4'>
                <Button
                  variant='outline'
                  onClick={downloadTemplate}
                  className='flex items-center space-x-2 text-blue-700 border-blue-300 hover:bg-blue-100'
                >
                  <DownloadIcon size={16} />
                  <span>Download Template</span>
                </Button>
              </div>
            </div>

            {/* File Upload */}
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
              <Typography
                variant='h3'
                className='text-lg font-semibold text-gray-900 mb-4'
              >
                Upload CSV File
              </Typography>

              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-blue-400 bg-blue-50'
                    : file
                      ? 'border-green-400 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {file ? (
                  <div className='space-y-3'>
                    <CheckIcon className='mx-auto h-12 w-12 text-green-500' />
                    <div>
                      <Typography
                        variant='p'
                        className='text-green-700 font-medium'
                      >
                        {file.name}
                      </Typography>
                      <Typography variant='small' className='text-green-600'>
                        {(file.size / 1024).toFixed(1)} KB
                      </Typography>
                    </div>
                    <Button
                      variant='outline'
                      onClick={() => setFile(null)}
                      className='text-gray-600'
                    >
                      Choose Different File
                    </Button>
                  </div>
                ) : (
                  <div className='space-y-3'>
                    <UploadIcon className='mx-auto h-12 w-12 text-gray-400' />
                    <div>
                      <Typography variant='p' className='text-gray-700'>
                        Drag and drop your CSV file here, or
                      </Typography>
                      <label className='cursor-pointer'>
                        <input
                          type='file'
                          accept='.csv'
                          onChange={handleFileSelect}
                          className='hidden'
                        />
                        <span className='text-blue-600 hover:text-blue-700 font-medium'>
                          browse to upload
                        </span>
                      </label>
                    </div>
                    <Typography variant='small' className='text-gray-500'>
                      CSV files only, up to 10MB
                    </Typography>
                  </div>
                )}
              </div>

              {file && (
                <div className='mt-6 flex justify-end'>
                  <Button
                    onClick={handleUpload}
                    disabled={uploading}
                    className='flex items-center space-x-2'
                  >
                    {uploading ? (
                      <>
                        <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <UploadIcon size={16} />
                        <span>Import Leads</span>
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Import Results */
          <div className='space-y-6'>
            {/* Summary */}
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
              <Typography
                variant='h3'
                className='text-lg font-semibold text-gray-900 mb-4'
              >
                Import Complete
              </Typography>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
                <div className='bg-blue-50 rounded-lg p-4 text-center'>
                  <div className='text-2xl font-bold text-blue-600'>
                    {importResult.summary.totalRows}
                  </div>
                  <div className='text-sm text-blue-800'>Total Rows</div>
                </div>
                <div className='bg-green-50 rounded-lg p-4 text-center'>
                  <div className='text-2xl font-bold text-green-600'>
                    {importResult.summary.successfulImports}
                  </div>
                  <div className='text-sm text-green-800'>Successful</div>
                </div>
                <div className='bg-red-50 rounded-lg p-4 text-center'>
                  <div className='text-2xl font-bold text-red-600'>
                    {importResult.summary.failedImports}
                  </div>
                  <div className='text-sm text-red-800'>Failed</div>
                </div>
              </div>

              <div className='flex space-x-3'>
                <Button onClick={resetImport} variant='outline'>
                  Import More Leads
                </Button>
                <Button onClick={() => router.push('/dashboard/leads')}>
                  View All Leads
                </Button>
              </div>
            </div>

            {/* Errors */}
            {importResult.errors.length > 0 && (
              <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
                <Typography
                  variant='h3'
                  className='text-lg font-semibold text-gray-900 mb-4'
                >
                  Import Errors
                </Typography>
                <div className='space-y-2 max-h-64 overflow-y-auto'>
                  {importResult.errors.map((error, index) => (
                    <div
                      key={index}
                      className='flex items-start space-x-2 p-3 bg-red-50 rounded-lg'
                    >
                      <XIcon className='h-5 w-5 text-red-500 mt-0.5 flex-shrink-0' />
                      <Typography variant='small' className='text-red-800'>
                        {error}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
