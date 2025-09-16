import { useState } from 'react';
import { Plus, TrendingUp, Leaf, Zap, Droplets, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

const mockAssessments = [
  {
    id: 1,
    name: 'Aluminium Automotive Part',
    metal: 'aluminium',
    status: 'completed',
    circularity_score: 78.5,
    co2_tonnes: 4.2,
    created_at: '2024-01-15',
  },
  {
    id: 2,
    name: 'Copper Wire Production',
    metal: 'copper',
    status: 'draft',
    circularity_score: null,
    co2_tonnes: null,
    created_at: '2024-01-14',
  },
  {
    id: 3,
    name: 'Steel Construction Beam',
    metal: 'steel',
    status: 'computed',
    circularity_score: 65.2,
    co2_tonnes: 2.8,
    created_at: '2024-01-13',
  },
];

const stats = [
  {
    name: 'Total Assessments',
    value: '24',
    change: '+12%',
    changeType: 'positive' as const,
    icon: BarChart3,
  },
  {
    name: 'Avg Circularity Score',
    value: '72.3',
    change: '+5.2%',
    changeType: 'positive' as const,
    icon: Leaf,
  },
  {
    name: 'Total CO2 Saved',
    value: '145.8t',
    change: '+23%',
    changeType: 'positive' as const,
    icon: TrendingUp,
  },
  {
    name: 'Energy Efficiency',
    value: '89%',
    change: '+8%',
    changeType: 'positive' as const,
    icon: Zap,
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'bg-success text-success-foreground',
      computed: 'bg-warning text-warning-foreground',
      draft: 'bg-muted text-muted-foreground',
    };
    return variants[status as keyof typeof variants] || variants.draft;
  };

  const getMetalColor = (metal: string) => {
    const colors = {
      aluminium: 'bg-blue-100 text-blue-800',
      copper: 'bg-orange-100 text-orange-800',
      steel: 'bg-gray-100 text-gray-800',
      lithium: 'bg-purple-100 text-purple-800',
    };
    return colors[metal as keyof typeof colors] || colors.steel;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Monitor your LCA assessments and sustainability metrics
          </p>
        </div>
        <Button 
          onClick={() => navigate('/assessment/new')}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Assessment
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-sm text-success">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  {stat.change} from last month
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Assessments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Assessments</CardTitle>
          <CardDescription>
            Your latest LCA assessments and their progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAssessments.map((assessment) => (
              <div
                key={assessment.id}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => navigate('/results')}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col">
                    <div className="font-medium">{assessment.name}</div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getMetalColor(assessment.metal)}>
                        {assessment.metal}
                      </Badge>
                      <Badge className={getStatusBadge(assessment.status)}>
                        {assessment.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  {assessment.circularity_score && (
                    <div className="flex items-center space-x-2">
                      <Leaf className="h-4 w-4" />
                      <span>{assessment.circularity_score}% circular</span>
                    </div>
                  )}
                  {assessment.co2_tonnes && (
                    <div className="flex items-center space-x-2">
                      <Droplets className="h-4 w-4" />
                      <span>{assessment.co2_tonnes}t CO₂</span>
                    </div>
                  )}
                  <div>{assessment.created_at}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/assessment/new')}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="mr-2 h-5 w-5" />
              Start New Assessment
            </CardTitle>
            <CardDescription>
              Begin a new life cycle assessment for your metal products
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/compare')}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Compare Scenarios
            </CardTitle>
            <CardDescription>
              Compare different production scenarios and their environmental impact
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}