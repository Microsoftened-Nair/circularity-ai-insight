import { useState } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

const steps = [
  { id: 1, name: 'Basic Info', description: 'Project details and metal selection' },
  { id: 2, name: 'Production Route', description: 'Primary vs recycled content' },
  { id: 3, name: 'Energy & Transport', description: 'Energy sources and logistics' },
  { id: 4, name: 'End-of-Life', description: 'Recovery and recycling options' },
  { id: 5, name: 'Review', description: 'Confirm and run assessment' },
];

interface AssessmentData {
  name: string;
  metal: string;
  primaryPercent: number;
  recycledPercent: number;
  energySource: string;
  transportDistance: number;
  endOfLifeRecovery: number;
  plantCapacity: number;
}

export default function NewAssessment() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<AssessmentData>({
    name: '',
    metal: '',
    primaryPercent: 70,
    recycledPercent: 30,
    energySource: '',
    transportDistance: 500,
    endOfLifeRecovery: 60,
    plantCapacity: 100000,
  });

  const updateData = (field: keyof AssessmentData, value: string | number) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Here you would normally save to Supabase and run calculations
    console.log('Assessment data:', data);
    navigate('/results');
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">New LCA Assessment</h1>
        <p className="text-muted-foreground mt-2">
          Follow the steps below to create your life cycle assessment
        </p>
      </div>

      {/* Progress */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Step {currentStep} of {steps.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Steps Navigation */}
      <div className="flex items-center justify-center space-x-4 overflow-x-auto pb-4">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center space-x-3 ${
              step.id === currentStep ? 'text-primary' : 
              step.id < currentStep ? 'text-success' : 'text-muted-foreground'
            }`}>
              <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                step.id === currentStep ? 'border-primary bg-primary text-primary-foreground' :
                step.id < currentStep ? 'border-success bg-success text-success-foreground' :
                'border-muted-foreground'
              }`}>
                {step.id < currentStep ? <CheckCircle className="h-4 w-4" /> : step.id}
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-medium">{step.name}</div>
                <div className="text-xs">{step.description}</div>
              </div>
            </div>
            {step.id < steps.length && (
              <ChevronRight className="mx-4 h-4 w-4 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].name}</CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Assessment Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Automotive Aluminium Component"
                  value={data.name}
                  onChange={(e) => updateData('name', e.target.value)}
                />
              </div>
              <div>
                <Label>Metal Type</Label>
                <Select value={data.metal} onValueChange={(value) => updateData('metal', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select metal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aluminium">Aluminium</SelectItem>
                    <SelectItem value="copper">Copper</SelectItem>
                    <SelectItem value="steel">Steel</SelectItem>
                    <SelectItem value="lithium">Lithium</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <Label>Primary Content: {data.primaryPercent}%</Label>
                <Slider
                  value={[data.primaryPercent]}
                  onValueChange={(value) => {
                    updateData('primaryPercent', value[0]);
                    updateData('recycledPercent', 100 - value[0]);
                  }}
                  max={100}
                  step={5}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Recycled Content: {data.recycledPercent}%</Label>
                <Slider
                  value={[data.recycledPercent]}
                  onValueChange={(value) => {
                    updateData('recycledPercent', value[0]);
                    updateData('primaryPercent', 100 - value[0]);
                  }}
                  max={100}
                  step={5}
                  className="mt-2"
                />
              </div>
              <div className="flex space-x-2 mt-4">
                <Badge variant="outline">Primary: {data.primaryPercent}%</Badge>
                <Badge variant="outline">Recycled: {data.recycledPercent}%</Badge>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <Label>Energy Source</Label>
                <Select value={data.energySource} onValueChange={(value) => updateData('energySource', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select energy source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">Grid Mix</SelectItem>
                    <SelectItem value="renewable">100% Renewable</SelectItem>
                    <SelectItem value="coal">Coal</SelectItem>
                    <SelectItem value="natural-gas">Natural Gas</SelectItem>
                    <SelectItem value="nuclear">Nuclear</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Transport Distance: {data.transportDistance} km</Label>
                <Slider
                  value={[data.transportDistance]}
                  onValueChange={(value) => updateData('transportDistance', value[0])}
                  max={2000}
                  min={50}
                  step={50}
                  className="mt-2"
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <Label>End-of-Life Recovery Rate: {data.endOfLifeRecovery}%</Label>
                <Slider
                  value={[data.endOfLifeRecovery]}
                  onValueChange={(value) => updateData('endOfLifeRecovery', value[0])}
                  max={95}
                  min={10}
                  step={5}
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Percentage of material that can be recovered and recycled at end of life
                </p>
              </div>
              <div>
                <Label htmlFor="capacity">Plant Capacity (tonnes/year)</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={data.plantCapacity}
                  onChange={(e) => updateData('plantCapacity', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium">Review Your Assessment</h3>
                <p className="text-muted-foreground mt-2">
                  Please review the information below before running the assessment
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Name:</span>
                    <span>{data.name || 'Unnamed Assessment'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Metal:</span>
                    <Badge>{data.metal}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Primary Content:</span>
                    <span>{data.primaryPercent}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Recycled Content:</span>
                    <span>{data.recycledPercent}%</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Energy Source:</span>
                    <span>{data.energySource || 'Not selected'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Transport Distance:</span>
                    <span>{data.transportDistance} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Recovery Rate:</span>
                    <span>{data.endOfLifeRecovery}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Plant Capacity:</span>
                    <span>{data.plantCapacity.toLocaleString()} t/year</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        {currentStep < steps.length ? (
          <Button onClick={nextStep}>
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit}>
            Run Assessment
          </Button>
        )}
      </div>
    </div>
  );
}