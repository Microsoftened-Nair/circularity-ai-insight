import { useState } from 'react';
import { Download, FileText, Calendar, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const mockReports = [
  {
    id: 1,
    name: 'Aluminium Automotive Component - Full Assessment',
    assessment_name: 'Aluminium Automotive Part',
    type: 'Full LCA Report',
    format: 'PDF',
    generated_at: '2024-01-15T10:30:00Z',
    size: '2.4 MB',
    status: 'completed'
  },
  {
    id: 2,
    name: 'Copper Wire Production - Executive Summary',
    assessment_name: 'Copper Wire Production',
    type: 'Executive Summary',
    format: 'PDF',
    generated_at: '2024-01-14T15:45:00Z',
    size: '850 KB',
    status: 'completed'
  },
  {
    id: 3,
    name: 'Steel Construction - Data Export',
    assessment_name: 'Steel Construction Beam',
    type: 'Data Export',
    format: 'Excel',
    generated_at: '2024-01-13T09:15:00Z',
    size: '1.1 MB',
    status: 'completed'
  },
  {
    id: 4,
    name: 'Quarterly Sustainability Report',
    assessment_name: 'Multiple Assessments',
    type: 'Quarterly Report',
    format: 'PDF',
    generated_at: '2024-01-12T14:20:00Z',
    size: '3.8 MB',
    status: 'completed'
  }
];

export default function Reports() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterFormat, setFilterFormat] = useState('all');

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.assessment_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || report.type === filterType;
    const matchesFormat = filterFormat === 'all' || report.format === filterFormat;
    
    return matchesSearch && matchesType && matchesFormat;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'Full LCA Report': 'bg-primary text-primary-foreground',
      'Executive Summary': 'bg-blue-100 text-blue-800',
      'Data Export': 'bg-green-100 text-green-800',
      'Quarterly Report': 'bg-purple-100 text-purple-800'
    };
    return colors[type as keyof typeof colors] || 'bg-muted text-muted-foreground';
  };

  const getFormatIcon = (format: string) => {
    return format === 'PDF' ? '📄' : '📊';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground mt-2">
            Generate and download comprehensive reports from your assessments
          </p>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Generate New Report
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Full LCA Report</CardTitle>
            <CardDescription>Comprehensive assessment with all details</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Generate PDF
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Executive Summary</CardTitle>
            <CardDescription>Key metrics and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" size="sm" variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Generate PDF
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Data Export</CardTitle>
            <CardDescription>Raw data in spreadsheet format</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" size="sm" variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Generate Excel
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Report History</CardTitle>
          <CardDescription>Previously generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Full LCA Report">Full LCA Report</SelectItem>
                <SelectItem value="Executive Summary">Executive Summary</SelectItem>
                <SelectItem value="Data Export">Data Export</SelectItem>
                <SelectItem value="Quarterly Report">Quarterly Report</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterFormat} onValueChange={setFilterFormat}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Formats</SelectItem>
                <SelectItem value="PDF">PDF</SelectItem>
                <SelectItem value="Excel">Excel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reports List */}
          <div className="space-y-3">
            {filteredReports.map(report => (
              <div 
                key={report.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="text-2xl">{getFormatIcon(report.format)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{report.name}</div>
                    <div className="text-sm text-muted-foreground">
                      From: {report.assessment_name}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getTypeColor(report.type)}>
                        {report.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(report.generated_at)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {report.size}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredReports.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="mx-auto h-12 w-12 mb-4" />
              <p>No reports found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Report Templates</CardTitle>
          <CardDescription>Customize your report structure and content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium">Standard Templates</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded">
                  <span>ISO 14040/14044 Compliant Report</span>
                  <Button size="sm" variant="outline">Use Template</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <span>Executive Dashboard Summary</span>
                  <Button size="sm" variant="outline">Use Template</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <span>Regulatory Compliance Report</span>
                  <Button size="sm" variant="outline">Use Template</Button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Custom Templates</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded">
                  <span>Internal Sustainability Report</span>
                  <Button size="sm" variant="outline">Edit</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <span>Client Presentation Format</span>
                  <Button size="sm" variant="outline">Edit</Button>
                </div>
                <Button className="w-full" variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Create New Template
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}