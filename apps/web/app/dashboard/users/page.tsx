/*
 * Copyright (c) 2024 Ismail Qau
 * Licensed under the MIT License.
 * See the LICENSE file in the project root for more information.
 */

'use client';

import { useState, useEffect } from 'react';
import {
  DashboardLayout,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Typography,
  Avatar,
  Badge,
} from '@email-system/ui';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  avatar?: string;
  department: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Mock user data - in a real app, this would be an API call
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@company.com',
        role: 'admin',
        status: 'active',
        lastLogin: '2024-01-15T10:30:00Z',
        department: 'Engineering',
      },
      {
        id: '2',
        name: 'Sarah Wilson',
        email: 'sarah.wilson@company.com',
        role: 'manager',
        status: 'active',
        lastLogin: '2024-01-15T09:15:00Z',
        department: 'Marketing',
      },
      {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike.johnson@company.com',
        role: 'user',
        status: 'active',
        lastLogin: '2024-01-14T16:45:00Z',
        department: 'Sales',
      },
      {
        id: '4',
        name: 'Emily Davis',
        email: 'emily.davis@company.com',
        role: 'user',
        status: 'inactive',
        lastLogin: '2024-01-10T14:20:00Z',
        department: 'Support',
      },
      {
        id: '5',
        name: 'Alex Chen',
        email: 'alex.chen@company.com',
        role: 'manager',
        status: 'pending',
        lastLogin: 'Never',
        department: 'Product',
      },
    ];
    setUsers(mockUsers);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus =
      filterStatus === 'all' || user.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'user':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatLastLogin = (lastLogin: string) => {
    if (lastLogin === 'Never') return 'Never';
    const date = new Date(lastLogin);
    return (
      date.toLocaleDateString() +
      ' ' +
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  };

  return (
    <DashboardLayout>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex justify-between items-center mb-8'>
          <div>
            <Typography
              variant='h1'
              className='text-3xl font-bold text-gray-900 mb-2'
            >
              User Management
            </Typography>
            <Typography variant='p' className='text-gray-600'>
              Manage user accounts, roles, and permissions
            </Typography>
          </div>

          <Button className='bg-blue-600 hover:bg-blue-700'>
            Add New User
          </Button>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className='p-6'>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
              <div>
                <Typography variant='small' className='font-medium mb-2'>
                  Search Users
                </Typography>
                <input
                  type='text'
                  placeholder='Search by name or email...'
                  className='w-full p-2 border border-gray-300 rounded-md'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>

              <div>
                <Typography variant='small' className='font-medium mb-2'>
                  Filter by Role
                </Typography>
                <select
                  className='w-full p-2 border border-gray-300 rounded-md'
                  value={filterRole}
                  onChange={e => setFilterRole(e.target.value)}
                >
                  <option value='all'>All Roles</option>
                  <option value='admin'>Admin</option>
                  <option value='manager'>Manager</option>
                  <option value='user'>User</option>
                </select>
              </div>

              <div>
                <Typography variant='small' className='font-medium mb-2'>
                  Filter by Status
                </Typography>
                <select
                  className='w-full p-2 border border-gray-300 rounded-md'
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                >
                  <option value='all'>All Status</option>
                  <option value='active'>Active</option>
                  <option value='inactive'>Inactive</option>
                  <option value='pending'>Pending</option>
                </select>
              </div>

              <div className='flex items-end'>
                <Button variant='outline' className='w-full'>
                  Export Users
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b border-gray-200'>
                    <th className='text-left py-3 px-4 font-medium text-gray-900'>
                      User
                    </th>
                    <th className='text-left py-3 px-4 font-medium text-gray-900'>
                      Role
                    </th>
                    <th className='text-left py-3 px-4 font-medium text-gray-900'>
                      Department
                    </th>
                    <th className='text-left py-3 px-4 font-medium text-gray-900'>
                      Status
                    </th>
                    <th className='text-left py-3 px-4 font-medium text-gray-900'>
                      Last Login
                    </th>
                    <th className='text-left py-3 px-4 font-medium text-gray-900'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr
                      key={user.id}
                      className='border-b border-gray-100 hover:bg-gray-50'
                    >
                      <td className='py-4 px-4'>
                        <div className='flex items-center space-x-3'>
                          <Avatar className='w-10 h-10'>
                            {user.name
                              .split(' ')
                              .map(n => n[0])
                              .join('')}
                          </Avatar>
                          <div>
                            <Typography variant='small' className='font-medium'>
                              {user.name}
                            </Typography>
                            <Typography
                              variant='small'
                              className='text-gray-500 text-sm'
                            >
                              {user.email}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className='py-4 px-4'>
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)}
                        </Badge>
                      </td>
                      <td className='py-4 px-4'>
                        <Typography variant='small'>
                          {user.department}
                        </Typography>
                      </td>
                      <td className='py-4 px-4'>
                        <Badge className={getStatusBadgeColor(user.status)}>
                          {user.status.charAt(0).toUpperCase() +
                            user.status.slice(1)}
                        </Badge>
                      </td>
                      <td className='py-4 px-4'>
                        <Typography variant='small' className='text-gray-600'>
                          {formatLastLogin(user.lastLogin)}
                        </Typography>
                      </td>
                      <td className='py-4 px-4'>
                        <div className='flex space-x-2'>
                          <Button variant='outline' size='sm'>
                            Edit
                          </Button>
                          <Button variant='outline' size='sm'>
                            {user.status === 'active'
                              ? 'Deactivate'
                              : 'Activate'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* User Statistics */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          <Card>
            <CardContent className='p-6 text-center'>
              <Typography
                variant='h3'
                className='text-2xl font-bold text-blue-600 mb-2'
              >
                {users.length}
              </Typography>
              <Typography variant='small' className='text-gray-600'>
                Total Users
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6 text-center'>
              <Typography
                variant='h3'
                className='text-2xl font-bold text-green-600 mb-2'
              >
                {users.filter(u => u.status === 'active').length}
              </Typography>
              <Typography variant='small' className='text-gray-600'>
                Active Users
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6 text-center'>
              <Typography
                variant='h3'
                className='text-2xl font-bold text-yellow-600 mb-2'
              >
                {users.filter(u => u.status === 'pending').length}
              </Typography>
              <Typography variant='small' className='text-gray-600'>
                Pending Users
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6 text-center'>
              <Typography
                variant='h3'
                className='text-2xl font-bold text-purple-600 mb-2'
              >
                {users.filter(u => u.role === 'admin').length}
              </Typography>
              <Typography variant='small' className='text-gray-600'>
                Administrators
              </Typography>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
