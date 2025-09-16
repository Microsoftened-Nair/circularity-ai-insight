import { useState } from 'react';
import { Plus, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const mockScenarios = [
  {
    id: 1,
    name: 'Current Production',
    metal: 'aluminium',
    circularity_score: 72.5,
    co2_tonnes: 4.2,
    energy_kwh: 12500,
    primary_pct: 70,
    recycled_pct: 30
  },
  {
    id: 2,
    name: 'Optimized Scenario',
    metal: 'aluminium',
    circularity_score: 85.3,
    co2_tonnes: 2.8,
    energy_kwh: 9200,
    primary_pct: 40,
    recycled_pct: 60
  }
];

export default function Compare() {
  const [scenario1, setScenario1] = useState('1');
  const [scenario2, setScenario2] = useState('2');

  const getScenario = (id: string) => mockScenarios.find(s => s.id.toString() === id);
  
  const s1 = getScenario(scenario1);
  const s2 = getScenario(scenario2);

  const getDifference = (val1: number, val2: number, isReverse = false) => {
    const diff = ((val2 - val1) / val1) * 100;
    const actualDiff = isReverse ? -diff : diff;
    return {
      value: Math.abs(actualDiff).toFixed(1),
      isPositive: actualDiff > 0
    };
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scenario Comparison</h1>
          <p className="text-muted-foreground mt-2">
            Compare different production scenarios and their environmental impact
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Scenario
        </Button>
      </div>

      {/* Scenario Selection */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Scenario A</CardTitle>
            <CardDescription>Select first scenario to compare</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={scenario1} onValueChange={setScenario1}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mockScenarios.map(scenario => (
                  <SelectItem key={scenario.id} value={scenario.id.toString()}>
                    {scenario.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scenario B</CardTitle>
            <CardDescription>Select second scenario to compare</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={scenario2} onValueChange={setScenario2}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mockScenarios.map(scenario => (
                  <SelectItem key={scenario.id} value={scenario.id.toString()}>
                    {scenario.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Comparison Results */}
      {s1 && s2 && (
        <div className="space-y-6">
          {/* Key Metrics Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Key Metrics Comparison</CardTitle>
              <CardDescription>Side-by-side comparison of environmental performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Circularity Score */}
                <div className="grid grid-cols-4 items-center gap-4 border-b pb-4">
                  <div className="font-medium">Circularity Score</div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{s1.circularity_score}%</div>
                    <div className="text-sm text-muted-foreground">{s1.name}</div>
                  </div>
                  <div className="flex justify-center">
                    <div className="flex items-center space-x-2">
                      {getDifference(s1.circularity_score, s2.circularity_score).isPositive ? (
                        <TrendingUp className="h-4 w-4 text-success" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-destructive" />
                      )}
                      <span className={`text-sm font-medium ${
                        getDifference(s1.circularity_score, s2.circularity_score).isPositive 
                          ? 'text-success' : 'text-destructive'
                      }`}>
                        {getDifference(s1.circularity_score, s2.circularity_score).value}%
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{s2.circularity_score}%</div>
                    <div className="text-sm text-muted-foreground">{s2.name}</div>
                  </div>
                </div>

                {/* CO2 Emissions */}
                <div className="grid grid-cols-4 items-center gap-4 border-b pb-4">
                  <div className="font-medium">CO₂ Emissions (t)</div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{s1.co2_tonnes}</div>
                    <div className="text-sm text-muted-foreground">{s1.name}</div>
                  </div>
                  <div className="flex justify-center">
                    <div className="flex items-center space-x-2">
                      {getDifference(s1.co2_tonnes, s2.co2_tonnes, true).isPositive ? (
                        <TrendingUp className="h-4 w-4 text-success" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-destructive" />
                      )}
                      <span className={`text-sm font-medium ${
                        getDifference(s1.co2_tonnes, s2.co2_tonnes, true).isPositive 
                          ? 'text-success' : 'text-destructive'
                      }`}>
                        {getDifference(s1.co2_tonnes, s2.co2_tonnes, true).value}%
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{s2.co2_tonnes}</div>
                    <div className="text-sm text-muted-foreground">{s2.name}</div>
                  </div>
                </div>

                {/* Energy Use */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="font-medium">Energy Use (kWh)</div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{s1.energy_kwh.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">{s1.name}</div>
                  </div>
                  <div className="flex justify-center">
                    <div className="flex items-center space-x-2">
                      {getDifference(s1.energy_kwh, s2.energy_kwh, true).isPositive ? (
                        <TrendingUp className="h-4 w-4 text-success" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-destructive" />
                      )}
                      <span className={`text-sm font-medium ${
                        getDifference(s1.energy_kwh, s2.energy_kwh, true).isPositive 
                          ? 'text-success' : 'text-destructive'
                      }`}>
                        {getDifference(s1.energy_kwh, s2.energy_kwh, true).value}%
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{s2.energy_kwh.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">{s2.name}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Production Route Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Production Route Analysis</CardTitle>
              <CardDescription>Material composition comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-3">{s1.name}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Primary Content:</span>
                      <Badge variant="outline">{s1.primary_pct}%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Recycled Content:</span>
                      <Badge variant="outline">{s1.recycled_pct}%</Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">{s2.name}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Primary Content:</span>
                      <Badge variant="outline">{s2.primary_pct}%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Recycled Content:</span>
                      <Badge variant="outline">{s2.recycled_pct}%</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
              <CardDescription>Key insights from the comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span>Scenario B shows {getDifference(s1.circularity_score, s2.circularity_score).value}% better circularity performance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span>CO₂ emissions reduced by {getDifference(s1.co2_tonnes, s2.co2_tonnes, true).value}% in Scenario B</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span>Energy efficiency improved by {getDifference(s1.energy_kwh, s2.energy_kwh, true).value}% in Scenario B</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}