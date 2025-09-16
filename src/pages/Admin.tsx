import { useState } from 'react';
import { Settings, Users, Database, BarChart3, Plus, Edit, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const mockUsers = [
  { id: 1, name: 'John Smith', email: 'john@company.com', role: 'engineer', last_active: '2024-01-15' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah@company.com', role: 'manager', last_active: '2024-01-14' },
  { id: 3, name: 'Mike Chen', email: 'mike@company.com', role: 'admin', last_active: '2024-01-15' },
];

const mockFactors = [
  { id: 1, process_name: 'Aluminium Primary Smelting', unit: 'kg', emission_co2_per_unit: 11.5, source: 'IAI Global Industry' },
  { id: 2, process_name: 'Copper Primary Extraction', unit: 'kg', emission_co2_per_unit: 3.2, source: 'ICSG Industry Data' },
  { id: 3, process_name: 'Steel Primary (BOF)', unit: 'kg', emission_co2_per_unit: 2.3, source: 'World Steel Association' },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState('users');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isAddingFactor, setIsAddingFactor] = useState(false);

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      admin: 'bg-destructive text-destructive-foreground',
      manager: 'bg-warning text-warning-foreground',
      engineer: 'bg-primary text-primary-foreground'
    };
    return colors[role as keyof typeof colors] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Administration</h1>
          <p className="text-muted-foreground mt-2">
            Manage users, LCA factors, and system settings
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Bulk Import
          </Button>
          <Button>
            <Settings className="mr-2 h-4 w-4" />
            System Settings
          </Button>
        </div>
      </div>

      {/* Admin Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="factors">LCA Factors</TabsTrigger>
          <TabsTrigger value="models">ML Models</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Users Management */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user accounts and permissions</CardDescription>
                </div>
                <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                      <DialogDescription>Create a new user account</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Full name" />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="user@company.com" />
                      </div>
                      <div>
                        <Label htmlFor="role">Role</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="engineer">Engineer</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddingUser(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsAddingUser(false)}>
                        Create User
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockUsers.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        Last active: {user.last_active}
                      </span>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* LCA Factors Management */}
        <TabsContent value="factors" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>LCA Emission Factors</CardTitle>
                  <CardDescription>Manage emission factors for LCA calculations</CardDescription>
                </div>
                <Dialog open={isAddingFactor} onOpenChange={setIsAddingFactor}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Factor
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Emission Factor</DialogTitle>
                      <DialogDescription>Add a new LCA emission factor</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="process">Process Name</Label>
                        <Input id="process" placeholder="e.g., Steel Primary Production" />
                      </div>
                      <div>
                        <Label htmlFor="unit">Unit</Label>
                        <Input id="unit" placeholder="e.g., kg, tonne" />
                      </div>
                      <div>
                        <Label htmlFor="emission">CO₂ Emission (per unit)</Label>
                        <Input id="emission" type="number" step="0.1" placeholder="0.0" />
                      </div>
                      <div>
                        <Label htmlFor="source">Source</Label>
                        <Input id="source" placeholder="Data source or reference" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddingFactor(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsAddingFactor(false)}>
                        Add Factor
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockFactors.map(factor => (
                  <div key={factor.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex-1">
                      <div className="font-medium">{factor.process_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {factor.emission_co2_per_unit} kg CO₂ per {factor.unit}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Source: {factor.source}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ML Models Management */}
        <TabsContent value="models" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Machine Learning Models</CardTitle>
              <CardDescription>Manage ML models for parameter prediction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="mx-auto h-12 w-12 mb-4" />
                <p>ML model management will be available in the next version.</p>
                <p className="text-sm">Currently using rule-based calculations.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Circularity Scoring Weights</CardTitle>
                <CardDescription>Adjust weights for circularity score calculation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Recycled Content Weight</Label>
                  <Input type="number" defaultValue="35" />
                </div>
                <div className="space-y-2">
                  <Label>End-of-Life Recovery Weight</Label>
                  <Input type="number" defaultValue="30" />
                </div>
                <div className="space-y-2">
                  <Label>Resource Efficiency Weight</Label>
                  <Input type="number" defaultValue="20" />
                </div>
                <div className="space-y-2">
                  <Label>Design for Circularity Weight</Label>
                  <Input type="number" defaultValue="15" />
                </div>
                <Button className="w-full">Update Weights</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>General system settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Default Metal Type</Label>
                  <Select defaultValue="aluminium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aluminium">Aluminium</SelectItem>
                      <SelectItem value="copper">Copper</SelectItem>
                      <SelectItem value="steel">Steel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Report Retention (days)</Label>
                  <Input type="number" defaultValue="90" />
                </div>
                <div className="space-y-2">
                  <Label>Max Assessment per User</Label>
                  <Input type="number" defaultValue="50" />
                </div>
                <Button className="w-full">Save Settings</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}