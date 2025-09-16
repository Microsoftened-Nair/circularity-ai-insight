import { useState } from 'react';
import { Download, Share, Copy, AlertCircle, TrendingDown, TrendingUp, Leaf, Zap, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const mockResults = {
  assessment_name: 'Aluminium Automotive Component',
  metal: 'aluminium',
  circularity_score: 78.5,
  results: {
    co2_tonnes_per_tonne: 4.2,
    energy_kwh_per_tonne: 12500,
    water_l_per_tonne: 8500,
    hotspots: [
      { stage: 'Primary Smelting', co2_share_pct: 65, value: 2.73 },
      { stage: 'Transport', co2_share_pct: 20, value: 0.84 },
      { stage: 'Processing', co2_share_pct: 10, value: 0.42 },
      { stage: 'End-of-Life', co2_share_pct: 5, value: 0.21 },
    ]
  },
  recommendations: [
    {
      rank: 1,
      title: 'Increase Recycled Content',
      description: 'Increase recycled content from 30% to 50% to reduce primary material dependency',
      estimated_co2_reduction: 1.2,
      estimated_cost_change: -5.2,
      feasibility: 'High'
    },
    {
      rank: 2,
      title: 'Switch to Renewable Energy',
      description: 'Transition to 100% renewable energy sources for smelting operations',
      estimated_co2_reduction: 1.8,
      estimated_cost_change: 12.5,
      feasibility: 'Medium'
    },
    {
      rank: 3,
      title: 'Optimize Transport Routes',
      description: 'Reduce transport distance by sourcing materials locally',
      estimated_co2_reduction: 0.4,
      estimated_cost_change: -2.1,
      feasibility: 'High'
    }
  ]
};

export default function Results() {
  const [activeTab, setActiveTab] = useState('overview');

  const getCircularityColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getCircularityLevel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assessment Results</h1>
          <p className="text-muted-foreground mt-2">
            {mockResults.assessment_name} • {new Date().toLocaleDateString()}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Circularity Score</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getCircularityColor(mockResults.circularity_score)}`}>
              {mockResults.circularity_score}%
            </div>
            <div className="text-xs text-muted-foreground">
              {getCircularityLevel(mockResults.circularity_score)} performance
            </div>
            <Progress value={mockResults.circularity_score} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CO₂ Emissions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockResults.results.co2_tonnes_per_tonne}</div>
            <p className="text-xs text-muted-foreground">tonnes CO₂ per tonne product</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy Use</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockResults.results.energy_kwh_per_tonne.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">kWh per tonne product</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Water Use</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockResults.results.water_l_per_tonne.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">litres per tonne product</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="breakdown">Impact Breakdown</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="comparison">Benchmarking</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Environmental Hotspots</CardTitle>
                <CardDescription>Major contributors to environmental impact</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockResults.results.hotspots.map((hotspot, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <span className="font-medium">{hotspot.stage}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">{hotspot.co2_share_pct}%</span>
                      <span className="font-medium">{hotspot.value}t CO₂</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Circularity Breakdown</CardTitle>
                <CardDescription>Factors contributing to circularity score</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Recycled Content</span>
                    <span className="font-medium">30%</span>
                  </div>
                  <Progress value={30} />
                  
                  <div className="flex justify-between items-center">
                    <span>End-of-Life Recovery</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <Progress value={85} />
                  
                  <div className="flex justify-between items-center">
                    <span>Resource Efficiency</span>
                    <span className="font-medium">75%</span>
                  </div>
                  <Progress value={75} />
                  
                  <div className="flex justify-between items-center">
                    <span>Design for Circularity</span>
                    <span className="font-medium">65%</span>
                  </div>
                  <Progress value={65} />
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This assessment is based on industry average data and your inputs. Results may vary based on specific operational conditions and supplier practices.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lifecycle Impact Analysis</CardTitle>
              <CardDescription>Detailed breakdown by lifecycle stage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockResults.results.hotspots.map((stage, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">{stage.stage}</h4>
                      <Badge variant="outline">{stage.co2_share_pct}% of total</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>CO₂ Emissions:</span>
                        <span>{stage.value} tonnes</span>
                      </div>
                      <Progress value={stage.co2_share_pct} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="space-y-4">
            {mockResults.recommendations.map((rec, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center">
                        <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">
                          {rec.rank}
                        </span>
                        {rec.title}
                      </CardTitle>
                      <CardDescription className="mt-2">{rec.description}</CardDescription>
                    </div>
                    <Badge 
                      className={rec.feasibility === 'High' ? 'bg-success' : 
                               rec.feasibility === 'Medium' ? 'bg-warning' : 'bg-destructive'}
                    >
                      {rec.feasibility} Feasibility
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center space-x-2">
                      <TrendingDown className="h-4 w-4 text-success" />
                      <span className="text-sm">CO₂ Reduction: <strong>{rec.estimated_co2_reduction}t</strong></span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {rec.estimated_cost_change < 0 ? (
                        <TrendingDown className="h-4 w-4 text-success" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-destructive" />
                      )}
                      <span className="text-sm">
                        Cost Impact: <strong>{rec.estimated_cost_change > 0 ? '+' : ''}{rec.estimated_cost_change}%</strong>
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Industry Benchmarking</CardTitle>
              <CardDescription>How your assessment compares to industry standards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>CO₂ Emissions vs Industry Average</span>
                    <span className="text-success font-medium">15% better</span>
                  </div>
                  <Progress value={85} />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>Your result: {mockResults.results.co2_tonnes_per_tonne}t</span>
                    <span>Industry avg: 4.9t</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span>Circularity Score vs Best Practice</span>
                    <span className="text-warning font-medium">78% of best practice</span>
                  </div>
                  <Progress value={78} />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>Your score: {mockResults.circularity_score}%</span>
                    <span>Best practice: 95%</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span>Energy Efficiency</span>
                    <span className="text-success font-medium">12% better</span>
                  </div>
                  <Progress value={88} />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>Your result: {mockResults.results.energy_kwh_per_tonne.toLocaleString()} kWh</span>
                    <span>Industry avg: 14,200 kWh</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}