import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  Users,
  Package,
  Globe,
  TrendingUp,
  Mail,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Activity,
  DollarSign,
  FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "wouter";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { motion } from "framer-motion";

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

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();

  // Fetch dashboard stats
  const { data: stats, isLoading, error } = useQuery<DashboardStats>({
    queryKey: ['/api/admin/dashboard/stats'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const statCards = [
    {
      title: t('dashboard.stats.inquiries', 'Total Inquiries'),
      value: stats?.totalInquiries || 0,
      change: '+12%',
      changeType: 'positive' as const,
      icon: Mail,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: t('dashboard.stats.leads', 'Active Leads'),
      value: stats?.activeLeads || 0,
      change: '+8%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      title: t('dashboard.stats.products', 'Products'),
      value: stats?.totalProducts || 0,
      change: '+15',
      changeType: 'positive' as const,
      icon: Package,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      title: t('dashboard.stats.countries', 'Export Markets'),
      value: stats?.exportCountries || 0,
      change: '+3',
      changeType: 'positive' as const,
      icon: Globe,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-6 text-center">
            <BarChart3 className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">{t('dashboard.error.title', 'Failed to Load Dashboard')}</h2>
            <p className="text-muted-foreground">{t('dashboard.error.description', 'Please check your connection and try again.')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                {t('dashboard.title', 'Admin Dashboard')}
              </h1>
              <p className="text-muted-foreground mt-1">
                {t('dashboard.welcome', 'Welcome back, {{name}}', { name: user?.name || 'Admin' })}
              </p>
            </div>
            <Badge className="bg-primary/10 text-primary">
              <span className="w-2 h-2 bg-primary rounded-full mr-2" />
              {user?.role === 'admin' ? t('roles.admin', 'Administrator') : t('roles.manager', 'Manager')}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index} className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className={`flex items-center text-sm ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.changeType === 'positive' ? (
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 mr-1" />
                    )}
                    <span className="font-medium">{stat.change}</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-2xl font-bold mb-1" data-testid={`stat-value-${index}`}>
                    {isLoading ? (
                      <div className="w-16 h-8 bg-muted animate-pulse rounded" />
                    ) : (
                      stat.value.toLocaleString()
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground" data-testid={`stat-title-${index}`}>
                    {stat.title}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions & Pipeline Overview */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                {t('dashboard.quickActions.title', 'Quick Actions')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full justify-start" variant="outline" data-testid="quick-action-crm">
                <Link href="/admin/crm">
                  <Users className="w-4 h-4 mr-2" />
                  {t('dashboard.quickActions.manageCRM', 'Manage CRM')}
                </Link>
              </Button>
              
              <Button asChild className="w-full justify-start" variant="outline" data-testid="quick-action-products">
                <Link href="/admin/products">
                  <Package className="w-4 h-4 mr-2" />
                  {t('dashboard.quickActions.manageProducts', 'Manage Products')}
                </Link>
              </Button>
              
              <Button asChild className="w-full justify-start" variant="outline" data-testid="quick-action-languages">
                <Link href="/admin/languages">
                  <Globe className="w-4 h-4 mr-2" />
                  {t('dashboard.quickActions.manageLanguages', 'Manage Languages')}
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Lead Pipeline Overview */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                {t('dashboard.pipeline.title', 'Lead Pipeline Overview')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="w-20 h-4 bg-muted animate-pulse rounded" />
                      <div className="w-8 h-4 bg-muted animate-pulse rounded" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(stats?.pipeline || {}).map(([stage, count]) => (
                    <div key={stage} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          stage === 'new' ? 'bg-blue-500' :
                          stage === 'contacted' ? 'bg-yellow-500' :
                          stage === 'quoted' ? 'bg-orange-500' :
                          stage === 'negotiation' ? 'bg-purple-500' :
                          'bg-green-500'
                        }`} />
                        <span className="font-medium capitalize" data-testid={`pipeline-stage-${stage}`}>
                          {t(`dashboard.pipeline.${stage}`, stage)}
                        </span>
                      </div>
                      <Badge variant="secondary" data-testid={`pipeline-count-${stage}`}>
                        {count}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-6 pt-4 border-t">
                <Button asChild className="w-full" data-testid="view-full-crm">
                  <Link href="/admin/crm">
                    {t('dashboard.pipeline.viewFull', 'View Full CRM')}
                    <ArrowUpRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          {/* Monthly Leads Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  {t('dashboard.charts.monthlyLeads', 'Monthly Leads Trend')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={[
                      { month: 'Jan', leads: 12, converted: 4 },
                      { month: 'Feb', leads: 19, converted: 7 },
                      { month: 'Mar', leads: 15, converted: 5 },
                      { month: 'Apr', leads: 25, converted: 9 },
                      { month: 'May', leads: 22, converted: 8 },
                      { month: 'Jun', leads: 30, converted: 12 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="leads"
                      stroke="#0288D1"
                      strokeWidth={2}
                      name="Total Leads"
                      dot={{ fill: '#0288D1', r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="converted"
                      stroke="#22C55E"
                      strokeWidth={2}
                      name="Converted"
                      dot={{ fill: '#22C55E', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Lead Source Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-secondary" />
                  {t('dashboard.charts.leadSources', 'Lead Sources')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
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
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: 'Website', value: 45, color: '#0288D1' },
                        { name: 'WhatsApp', value: 25, color: '#25D366' },
                        { name: 'Email', value: 20, color: '#FF8F00' },
                        { name: 'Referral', value: 10, color: '#22C55E' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Product Category Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-accent" />
                  {t('dashboard.charts.productPerformance', 'Product Interest')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { category: 'Micronutrients', inquiries: 35 },
                      { category: 'Bactericides', inquiries: 28 },
                      { category: 'Growth Promoters', inquiries: 25 },
                      { category: 'Bio-Fertilizers', inquiries: 20 },
                      { category: 'Plant Tonics', inquiries: 15 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis
                      dataKey="category"
                      stroke="#666"
                      angle={-15}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis stroke="#666" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="inquiries" fill="#FF8F00" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Export Markets Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  {t('dashboard.charts.exportMarkets', 'Top Export Markets')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    layout="vertical"
                    data={[
                      { country: 'Ethiopia', leads: 45 },
                      { country: 'Indonesia', leads: 38 },
                      { country: 'Kenya', leads: 30 },
                      { country: 'India', leads: 25 },
                      { country: 'Tanzania', leads: 20 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis type="number" stroke="#666" />
                    <YAxis dataKey="country" type="category" stroke="#666" width={100} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="leads" fill="#22C55E" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                {t('dashboard.activity.title', 'Recent Activity')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'New lead received', name: 'Ahmed Hassan (Ethiopia)', time: '5 mins ago', type: 'lead' },
                  { action: 'Product inquiry', name: 'Micronutrients - Bulk Order', time: '23 mins ago', type: 'inquiry' },
                  { action: 'Lead converted', name: 'Budi Santoso (Indonesia)', time: '1 hour ago', type: 'converted' },
                  { action: 'New contact form', name: 'John Smith - Export Query', time: '2 hours ago', type: 'contact' },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
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
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.name}</p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
