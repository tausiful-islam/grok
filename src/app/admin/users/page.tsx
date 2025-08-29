'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Users,
  UserPlus,
  Shield,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react'

interface User {
  id: string
  email: string
  full_name: string
  role: 'customer' | 'admin' | 'super_admin'
  status: 'active' | 'inactive' | 'suspended'
  created_at: string
  last_login: string
  orders_count: number
}

interface RolePermissions {
  role: string
  permissions: string[]
  description: string
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const rolePermissions: RolePermissions[] = [
    {
      role: 'customer',
      permissions: ['view_products', 'place_orders', 'manage_profile', 'view_orders'],
      description: 'Standard customer access'
    },
    {
      role: 'admin',
      permissions: [
        'view_products', 'manage_products', 'view_orders', 'manage_orders',
        'view_customers', 'manage_inventory', 'view_analytics', 'manage_categories'
      ],
      description: 'Full admin access to manage store operations'
    },
    {
      role: 'super_admin',
      permissions: [
        'view_products', 'manage_products', 'view_orders', 'manage_orders',
        'view_customers', 'manage_inventory', 'view_analytics', 'manage_categories',
        'manage_users', 'manage_settings', 'view_system_logs', 'manage_roles'
      ],
      description: 'Complete system access including user management'
    }
  ]

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      // In a real app, this would be an API call to Supabase
      // For now, we'll use mock data
      setUsers([
        {
          id: '1',
          email: 'john.doe@example.com',
          full_name: 'John Doe',
          role: 'customer',
          status: 'active',
          created_at: '2025-01-01T10:00:00Z',
          last_login: '2025-01-15T14:30:00Z',
          orders_count: 5
        },
        {
          id: '2',
          email: 'admin@store.com',
          full_name: 'Admin User',
          role: 'admin',
          status: 'active',
          created_at: '2024-12-01T09:00:00Z',
          last_login: '2025-01-15T16:45:00Z',
          orders_count: 0
        },
        {
          id: '3',
          email: 'super@store.com',
          full_name: 'Super Admin',
          role: 'super_admin',
          status: 'active',
          created_at: '2024-11-01T08:00:00Z',
          last_login: '2025-01-15T17:00:00Z',
          orders_count: 0
        }
      ])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      // In a real app, this would be an API call to update user role
      console.log(`Updating user ${userId} role to ${newRole}`)
      setUsers(users.map(user =>
        user.id === userId ? { ...user, role: newRole as any } : user
      ))
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error('Error updating user role:', error)
    }
  }

  const updateUserStatus = async (userId: string, newStatus: string) => {
    try {
      // In a real app, this would be an API call to update user status
      console.log(`Updating user ${userId} status to ${newStatus}`)
      setUsers(users.map(user =>
        user.id === userId ? { ...user, status: newStatus as any } : user
      ))
    } catch (error) {
      console.error('Error updating user status:', error)
    }
  }

  const deleteUser = async (userId: string) => {
    try {
      // In a real app, this would be an API call to delete user
      console.log(`Deleting user ${userId}`)
      setUsers(users.filter(user => user.id !== userId))
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'super_admin': return 'destructive'
      case 'admin': return 'default'
      case 'customer': return 'secondary'
      default: return 'outline'
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'inactive': return 'secondary'
      case 'suspended': return 'destructive'
      default: return 'outline'
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === 'all' || user.role === selectedRole
    return matchesSearch && matchesRole
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage user roles and permissions</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="user@example.com" />
              </div>
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input id="full_name" placeholder="John Doe" />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsCreateDialogOpen(false)}>
                  Create User
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Admins</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.role === 'admin' || u.role === 'super_admin').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Suspended</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.status === 'suspended').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Permissions Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rolePermissions.map((rolePerm) => (
              <div key={rolePerm.role} className="border rounded-lg p-4">
                <h3 className="font-semibold capitalize mb-2">{rolePerm.role.replace('_', ' ')}</h3>
                <p className="text-sm text-gray-600 mb-3">{rolePerm.description}</p>
                <div className="space-y-1">
                  {rolePerm.permissions.slice(0, 4).map((permission) => (
                    <Badge key={permission} variant="outline" className="text-xs mr-1 mb-1">
                      {permission.replace('_', ' ')}
                    </Badge>
                  ))}
                  {rolePerm.permissions.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{rolePerm.permissions.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">User</th>
                  <th className="text-left py-3 px-4">Role</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Orders</th>
                  <th className="text-left py-3 px-4">Last Login</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{user.full_name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {user.role.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getStatusBadgeVariant(user.status)}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">{user.orders_count}</td>
                    <td className="py-3 px-4">
                      {new Date(user.last_login).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Dialog open={isEditDialogOpen && selectedUser?.id === user.id} onOpenChange={(open) => {
                          setIsEditDialogOpen(open)
                          if (open) setSelectedUser(user)
                        }}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit User: {user.full_name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="edit-role">Role</Label>
                                <Select defaultValue={user.role} onValueChange={(value) => updateUserRole(user.id, value)}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="customer">Customer</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="super_admin">Super Admin</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="edit-status">Status</Label>
                                <Select defaultValue={user.status} onValueChange={(value) => updateUserStatus(user.id, value)}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="suspended">Suspended</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteUser(user.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
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
    </div>
  )
}
