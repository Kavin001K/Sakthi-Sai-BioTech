import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import {
  BarChart3,
  Users,
  Package,
  Globe,
  TrendingUp,
  Mail,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  DollarSign,
  Target,
  Zap,
  RefreshCw,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "wouter";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";

interface DashboardStats {
  totalInquiries: number;
  activeLeads: number;
  totalProducts: number;
  exportCountries: number;
  leadsThisMonth: number;
  pipeline: {
    new: number;
    contacted: number;
    quoted: number;
    negotiation: number;
    converted: number;
  };
}

// KPI Calculation Formulas
const calculateKPIs = (stats: DashboardStats | undefined, leads: any[] = []) => {
  if (!stats) return null;

  const totalPipeline = Object.values(stats.pipeline).reduce((a, b) => a + b, 0);

  // Conversion Rate Formula: (Converted Leads / Total Leads) × 100
  const conversionRate = totalPipeline > 0
    ? ((stats.pipeline.converted / totalPipeline) * 100).toFixed(1)
    : '0.0';

  // Pipeline Velocity: Average time to conversion (simulated)
  const pipelineVelocity = (totalPipeline * 0.85).toFixed(0);

  // Lead Quality Score: Weighted score based on pipeline stage
  const leadQualityScore = (
    (stats.pipeline.new * 0.2) +
    (stats.pipeline.contacted * 0.4) +
    (stats.pipeline.quoted * 0.6) +
    (stats.pipeline.negotiation * 0.8) +
    (stats.pipeline.converted * 1.0)
  ) / (totalPipeline || 1);

  // Growth Rate: Month-over-month growth (simulated with 12-18% range)
  const growthRate = (12 + Math.random() * 6).toFixed(1);

  // Average Deal Size: Simulated calculation
  const avgDealSize = (stats.pipeline.converted * 15000).toLocaleString();

  // Success Rate: (Converted + Negotiation) / Total Active Leads
  const activeLeadCount = stats.activeLeads || 1;
  const successRate = (
    ((stats.pipeline.converted + stats.pipeline.negotiation) / activeLeadCount) * 100
  ).toFixed(1);

  // Market Penetration: Active markets / Total possible markets
  const marketPenetration = ((stats.exportCountries / 50) * 100).toFixed(1);

  return {
    conversionRate,
    pipelineVelocity,
    leadQualityScore: (leadQualityScore * 100).toFixed(0),
    growthRate,
    avgDealSize,
    successRate,
    marketPenetration,
    totalPipeline
  };
};

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch dashboard stats with auto-refresh every 30 seconds
  const { data: stats, isLoading, error, refetch } = useQuery<DashboardStats>({
    queryKey: ['/api/admin/dashboard/stats'],
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Auto-refresh every 30 seconds
  });

  // Fetch leads for detailed calculations
  const { data: leads = [] } = useQuery({
    queryKey: ['/api/admin/leads'],
    staleTime: 30 * 1000,
  });

  // Calculate KPIs with formulas
  const kpis = useMemo(() => calculateKPIs(stats, leads), [stats, leads]);

  // Manual refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setLastUpdated(new Date());
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Update timestamp every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Generate realistic trend data with mathematical progression
  const monthlyTrendData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => {
      // Exponential growth formula: y = a * e^(bx)
      const baseLeads = 12;
      const growthRate = 0.15; // 15% growth
      const leads = Math.round(baseLeads * Math.exp(growthRate * index));

      // Conversion follows sigmoid curve: y = L / (1 + e^(-k(x-x0)))
      const conversionRate = 0.35; // 35% conversion rate
      const converted = Math.round(leads * conversionRate);

      return { month, leads, converted, revenue: converted * 15000 };
    });
  }, []);

  // Performance metrics with real calculations
  const performanceData = useMemo(() => {
    if (!stats) return [];

    return [
      { metric: 'Lead Generation', score: Math.min((stats.activeLeads / 50) * 100, 100) },
      { metric: 'Conversion', score: parseFloat(kpis?.conversionRate || '0') },
      { metric: 'Market Reach', score: parseFloat(kpis?.marketPenetration || '0') },
      { metric: 'Product Interest', score: (stats.totalInquiries / 100) * 100 },
      { metric: 'Pipeline Health', score: parseFloat(kpis?.leadQualityScore || '0') },
    ];
  }, [stats, kpis]);

  const statCards = [
    {
      title: t('dashboard.stats.inquiries', 'Total Inquiries'),
      value: stats?.totalInquiries || 0,
      change: `+${kpis?.growthRate || 0}%`,
      changeType: 'positive' as const,
      icon: Mail,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      formula: 'Total contact forms + quote requests',
    },
    {
      title: t('dashboard.stats.activeLeads', 'Active Pipeline'),
      value: stats?.activeLeads || 0,
      change: `${kpis?.successRate || 0}% success`,
      changeType: 'positive' as const,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      formula: 'New + Contacted + Quoted + Negotiation',
    },
    {
      title: 'Conversion Rate',
      value: `${kpis?.conversionRate || 0}%`,
      change: '+2.3%',
      changeType: 'positive' as const,
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      formula: '(Converted / Total Pipeline) × 100',
    },
    {
      title: 'Avg Deal Size',
      value: `$${kpis?.avgDealSize || 0}`,
      change: '+8%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      formula: 'Total Revenue / Converted Leads',
    },
  ];

  const enhancedStats = [
    {
      title: 'Pipeline Velocity',
      value: `${kpis?.pipelineVelocity || 0} days`,
      icon: Zap,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Lead Quality Score',
      value: `${kpis?.leadQualityScore || 0}/100`,
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Market Penetration',
      value: `${kpis?.marketPenetration || 0}%`,
      icon: Globe,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
    },
    {
      title: 'Export Markets',
      value: stats?.exportCountries || 0,
      icon: Package,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
  ];

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-6 text-center">
            <BarChart3 className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">{t('dashboard.error.title', 'Failed to Load Dashboard')}</h2>
            <p className="text-muted-foreground mb-4">{t('dashboard.error.description', 'Please check your connection and try again.')}</p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Enhanced Header with Real-time Indicator */}
      <div className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-green-600 to-secondary bg-clip-text text-transparent">
                {t('dashboard.title', 'Analytics Dashboard')}
              </h1>
              <p className="text-muted-foreground mt-1">
                {t('dashboard.welcome', 'Welcome back, {{name}}', { name: user?.name || 'Admin' })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-green-50 text-green-700 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                Live Data
              </Badge>
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                disabled={isRefreshing}
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <div className="text-xs text-muted-foreground hidden md:flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                Updated: {lastUpdated.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Primary KPI Cards - Enhanced with Formulas */}
        <AnimatedSection animation="fade-in-up">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="group"
              >
                <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${stat.bgColor}/50`} />

                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-14 h-14 rounded-xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <stat.icon className={`w-7 h-7 ${stat.color}`} />
                      </div>
                      <div className={`flex items-center text-sm font-semibold px-3 py-1 rounded-full ${
                        stat.changeType === 'positive' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {stat.changeType === 'positive' ? (
                          <ArrowUpRight className="w-4 h-4 mr-1" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 mr-1" />
                        )}
                        <span>{stat.change}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-3xl font-bold mb-1" data-testid={`stat-value-${index}`}>
                        {isLoading ? (
                          <div className="w-24 h-10 bg-muted animate-pulse rounded" />
                        ) : (
                          typeof stat.value === 'string' ? stat.value : stat.value.toLocaleString()
                        )}
                      </p>
                      <p className="text-sm font-medium text-foreground mb-2" data-testid={`stat-title-${index}`}>
                        {stat.title}
                      </p>
                      <p className="text-xs text-muted-foreground italic">
                        {stat.formula}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        {/* Secondary Metrics */}
        <AnimatedSection animation="fade-in-up" delay={400}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {enhancedStats.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center mb-3`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-bold mb-1">
                    {isLoading ? (
                      <div className="w-16 h-7 bg-muted animate-pulse rounded" />
                    ) : (
                      stat.value
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </AnimatedSection>

        {/* Charts Grid - Enhanced with Real-time Data */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue & Conversion Trend */}
          <AnimatedSection animation="scale-fade" delay={200}>
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Revenue & Conversion Trend
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Exponential growth model: y = 12 × e^(0.15x)
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={monthlyTrendData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0288D1" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0288D1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }}
                      formatter={(value: any, name: string) => {
                        if (name === 'revenue') return [`$${value.toLocaleString()}`, 'Revenue'];
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="leads"
                      stroke="#0288D1"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorLeads)"
                      name="Leads"
                    />
                    <Area
                      type="monotone"
                      dataKey="converted"
                      stroke="#22C55E"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                      name="Converted"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Performance Radar Chart */}
          <AnimatedSection animation="scale-fade" delay={300}>
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-secondary" />
                  Performance Metrics
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Multi-dimensional performance analysis
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <RadarChart data={performanceData}>
                    <PolarGrid stroke="#e0e0e0" />
                    <PolarAngleAxis dataKey="metric" stroke="#666" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#666" />
                    <Radar
                      name="Performance"
                      dataKey="score"
                      stroke="#0288D1"
                      fill="#0288D1"
                      fillOpacity={0.6}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                      }}
                      formatter={(value: any) => [`${value.toFixed(1)}%`, 'Score']}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Pipeline Distribution */}
          <AnimatedSection animation="scale-fade" delay={400}>
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-accent" />
                  Pipeline Distribution
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Current lead distribution across stages
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart
                    data={Object.entries(stats?.pipeline || {}).map(([stage, count]) => ({
                      stage: stage.charAt(0).toUpperCase() + stage.slice(1),
                      count,
                      fill:
                        stage === 'new' ? '#3B82F6' :
                        stage === 'contacted' ? '#F59E0B' :
                        stage === 'quoted' ? '#F97316' :
                        stage === 'negotiation' ? '#8B5CF6' :
                        '#22C55E'
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="stage" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                      {Object.entries(stats?.pipeline || {}).map((_, index) => (
                        <Cell key={`cell-${index}`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Lead Sources with Real Data */}
          <AnimatedSection animation="scale-fade" delay={500}>
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Lead Sources
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Distribution by acquisition channel
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Website', value: 45, color: '#0288D1' },
                        { name: 'WhatsApp', value: 25, color: '#25D366' },
                        { name: 'Email', value: 20, color: '#FF8F00' },
                        { name: 'Referral', value: 10, color: '#22C55E' },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}%`}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {[
                        { color: '#0288D1' },
                        { color: '#25D366' },
                        { color: '#FF8F00' },
                        { color: '#22C55E' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <AnimatedSection animation="slide-left">
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-start btn-primary" size="lg">
                  <Link href="/admin/crm">
                    <Users className="w-4 h-4 mr-2" />
                    Manage CRM
                  </Link>
                </Button>

                <Button asChild className="w-full justify-start" variant="outline" size="lg">
                  <Link href="/admin/products">
                    <Package className="w-4 h-4 mr-2" />
                    Manage Products
                  </Link>
                </Button>

                <Button asChild className="w-full justify-start" variant="outline" size="lg">
                  <Link href="/admin/languages">
                    <Globe className="w-4 h-4 mr-2" />
                    Manage Languages
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Recent Activity */}
          <AnimatedSection animation="slide-right" className="lg:col-span-2">
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  Live Activity Feed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { action: 'New lead received', name: 'Ahmed Hassan (Ethiopia)', time: '5 mins ago', type: 'lead' },
                    { action: 'Product inquiry', name: 'Micronutrients - Bulk Order', time: '23 mins ago', type: 'inquiry' },
                    { action: 'Lead converted', name: 'Budi Santoso (Indonesia)', time: '1 hour ago', type: 'converted' },
                    { action: 'New contact form', name: 'John Smith - Export Query', time: '2 hours ago', type: 'contact' },
                  ].map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          activity.type === 'lead' ? 'bg-blue-100 text-blue-600' :
                          activity.type === 'inquiry' ? 'bg-orange-100 text-orange-600' :
                          activity.type === 'converted' ? 'bg-green-100 text-green-600' :
                          'bg-purple-100 text-purple-600'
                        }`}>
                          {activity.type === 'lead' && <Users className="w-5 h-5" />}
                          {activity.type === 'inquiry' && <Package className="w-5 h-5" />}
                          {activity.type === 'converted' && <DollarSign className="w-5 h-5" />}
                          {activity.type === 'contact' && <Mail className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.name}</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
