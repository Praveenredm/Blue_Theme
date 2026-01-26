import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AdminSidebar } from '@/components/navigation/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  Database,
  Shield,
  Activity,
  Clock
} from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'success';
  category: 'auth' | 'referral' | 'system' | 'ai' | 'security';
  message: string;
  details?: string;
  userId?: string;
  userName?: string;
}

const mockLogs: LogEntry[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    level: 'success',
    category: 'referral',
    message: 'Referral REF-2024-1234 accepted by Dr. Sarah Johnson',
    details: 'Patient: John Smith, Specialty: Cardiology',
    userId: 'sp-001',
    userName: 'Dr. Sarah Johnson'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    level: 'info',
    category: 'auth',
    message: 'User login successful',
    details: 'IP: 192.168.1.100, Device: Chrome/Windows',
    userId: 'pcp-002',
    userName: 'Dr. Michael Chen'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
    level: 'warning',
    category: 'ai',
    message: 'AI model prediction confidence below threshold',
    details: 'Model: referral-v2.4, Confidence: 68%, Threshold: 75%'
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 18 * 60 * 1000),
    level: 'success',
    category: 'system',
    message: 'Database backup completed successfully',
    details: 'Size: 2.4GB, Duration: 4m 32s'
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    level: 'error',
    category: 'security',
    message: 'Failed login attempt detected',
    details: 'IP: 45.33.32.156, Attempts: 5, Action: IP blocked for 1 hour'
  },
  {
    id: '6',
    timestamp: new Date(Date.now() - 35 * 60 * 1000),
    level: 'info',
    category: 'referral',
    message: 'New referral created',
    details: 'REF-2024-1235, Priority: High, Specialty: Neurology',
    userId: 'pcp-003',
    userName: 'Dr. Lisa Wong'
  },
  {
    id: '7',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    level: 'success',
    category: 'ai',
    message: 'AI model updated to v2.4.1',
    details: 'Accuracy improvement: +0.9%, False positive reduction: -0.5%'
  },
  {
    id: '8',
    timestamp: new Date(Date.now() - 55 * 60 * 1000),
    level: 'warning',
    category: 'system',
    message: 'High memory usage detected',
    details: 'Usage: 87%, Threshold: 85%, Auto-scaling initiated'
  },
  {
    id: '9',
    timestamp: new Date(Date.now() - 65 * 60 * 1000),
    level: 'info',
    category: 'auth',
    message: 'Password reset requested',
    userId: 'pt-012',
    userName: 'Emily Thompson'
  },
  {
    id: '10',
    timestamp: new Date(Date.now() - 80 * 60 * 1000),
    level: 'success',
    category: 'referral',
    message: 'Treatment outcome submitted',
    details: 'REF-2024-1220, Outcome: Improved, Satisfaction: 5/5',
    userId: 'sp-002',
    userName: 'Dr. James Park'
  }
];

export default function SystemLogs() {
  const [logs] = useState<LogEntry[]>(mockLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    return matchesSearch && matchesLevel && matchesCategory;
  });

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'success': return <CheckCircle className="h-4 w-4 text-chart-2" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-chart-4" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'info': return <Info className="h-4 w-4 text-primary" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'success': return <Badge variant="secondary" className="bg-chart-2/10 text-chart-2">Success</Badge>;
      case 'warning': return <Badge variant="outline" className="text-chart-4">Warning</Badge>;
      case 'error': return <Badge variant="destructive">Error</Badge>;
      case 'info': return <Badge variant="secondary">Info</Badge>;
      default: return <Badge variant="outline">{level}</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'auth': return <Shield className="h-4 w-4" />;
      case 'referral': return <Activity className="h-4 w-4" />;
      case 'system': return <Database className="h-4 w-4" />;
      case 'ai': return <Activity className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (date: Date) => {
    return format(date, 'MMM d, HH:mm:ss');
  };

  const getTimeAgo = (date: Date) => {
    const mins = Math.floor((Date.now() - date.getTime()) / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const stats = {
    total: logs.length,
    errors: logs.filter(l => l.level === 'error').length,
    warnings: logs.filter(l => l.level === 'warning').length,
    success: logs.filter(l => l.level === 'success').length
  };

  return (
    <DashboardLayout sidebar={<AdminSidebar />} title="System Logs">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">System Logs</h2>
            <p className="text-muted-foreground">Monitor system activity and audit trails</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Database className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Logs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.errors}</p>
                  <p className="text-xs text-muted-foreground">Errors</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-chart-4/10 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-chart-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.warnings}</p>
                  <p className="text-xs text-muted-foreground">Warnings</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-chart-2/10 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-chart-2" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.success}</p>
                  <p className="text-xs text-muted-foreground">Success</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="auth">Authentication</SelectItem>
                  <SelectItem value="referral">Referrals</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="ai">AI Model</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Log ({filteredLogs.length})</CardTitle>
            <CardDescription>Real-time system events and audit trail</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex flex-col lg:flex-row lg:items-start gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 lg:min-w-[200px]">
                    {getLevelIcon(log.level)}
                    <div>
                      <p className="text-sm font-mono text-muted-foreground">
                        {formatTimestamp(log.timestamp)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {getTimeAgo(log.timestamp)}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      {getLevelBadge(log.level)}
                      <Badge variant="outline" className="gap-1">
                        {getCategoryIcon(log.category)}
                        {log.category}
                      </Badge>
                      {log.userName && (
                        <span className="text-xs text-muted-foreground">
                          by {log.userName}
                        </span>
                      )}
                    </div>
                    <p className="font-medium">{log.message}</p>
                    {log.details && (
                      <p className="text-sm text-muted-foreground mt-1">{log.details}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {log.userId || 'System'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
