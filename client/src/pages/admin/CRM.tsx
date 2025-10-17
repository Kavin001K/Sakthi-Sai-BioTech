import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Tag,
  Calendar,
  Edit,
  Trash2,
  Download,
  MessageSquare,
  Send,
  TrendingUp,
  Activity,
  Sparkles,
  GripVertical
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import LeadDetailModal from "@/components/LeadDetailModal";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string;
  country: string;
  productInterest: string | null;
  message: string | null;
  source: string;
  status: string;
  assignedTo: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  score: number;
  tags: string[] | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminCRM() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [assignedFilter, setAssignedFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [dateRangeFilter, setDateRangeFilter] = useState("all");
  const [view, setView] = useState<"kanban" | "table">("kanban");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch leads
  const { data: leads = [], isLoading, error } = useQuery<Lead[]>({
    queryKey: ['/api/admin/leads'],
    staleTime: 30 * 1000, // 30 seconds
  });

  // Update lead mutation
  const updateLeadMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Lead> }) => {
      const response = await apiRequest('PUT', `/api/admin/leads/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/leads'] });
      toast({
        title: t('crm.success.title', 'Lead Updated'),
        description: t('crm.success.description', 'Lead has been successfully updated.'),
      });
    },
    onError: () => {
      toast({
        title: t('crm.error.title', 'Update Failed'),
        description: t('crm.error.description', 'Failed to update lead. Please try again.'),
        variant: "destructive",
      });
    },
  });

  const leadStatuses = [
    { value: 'new', label: t('crm.status.new', 'New'), color: 'bg-blue-500' },
    { value: 'contacted', label: t('crm.status.contacted', 'Contacted'), color: 'bg-yellow-500' },
    { value: 'quoted', label: t('crm.status.quoted', 'Quoted'), color: 'bg-orange-500' },
    { value: 'negotiation', label: t('crm.status.negotiation', 'Negotiation'), color: 'bg-purple-500' },
    { value: 'converted', label: t('crm.status.converted', 'Converted'), color: 'bg-green-500' },
    { value: 'closed', label: t('crm.status.closed', 'Closed'), color: 'bg-gray-500' },
  ];

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = searchQuery === '' ||
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;

    const matchesAssigned = assignedFilter === 'all' ||
      (assignedFilter === 'unassigned' ? !lead.assignedTo : lead.assignedTo === assignedFilter);

    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;

    const matchesDateRange = (() => {
      if (dateRangeFilter === 'all') return true;
      const leadDate = new Date(lead.createdAt);
      const now = new Date();

      switch (dateRangeFilter) {
        case 'today':
          return leadDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return leadDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return leadDate >= monthAgo;
        case 'quarter':
          const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          return leadDate >= quarterAgo;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesStatus && matchesAssigned && matchesSource && matchesDateRange;
  });

  // Group leads by status for Kanban view
  const groupedLeads = leadStatuses.reduce((acc, status) => {
    acc[status.value] = filteredLeads.filter(lead => lead.status === status.value);
    return acc;
  }, {} as Record<string, Lead[]>);

  const handleStatusChange = (leadId: string, newStatus: string) => {
    updateLeadMutation.mutate({
      id: leadId,
      data: { status: newStatus }
    });
  };

  // Drag and drop handlers
  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveDragId(null);
      return;
    }

    const leadId = active.id as string;
    const newStatus = over.id as string;

    // Find the lead's current status
    const lead = leads.find(l => l.id === leadId);

    if (lead && lead.status !== newStatus && leadStatuses.some(s => s.value === newStatus)) {
      handleStatusChange(leadId, newStatus);

      toast({
        title: "Lead Status Updated",
        description: `Lead moved to ${leadStatuses.find(s => s.value === newStatus)?.label}`,
      });
    }

    setActiveDragId(null);
  };

  // Get active drag lead for overlay
  const activeLead = leads.find(l => l.id === activeDragId);

  // Draggable Lead Card Component
  const DraggableLeadCard = ({ lead }: { lead: Lead }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: lead.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <div ref={setNodeRef} style={style} {...attributes}>
        <Card
          className="group card-hover cursor-pointer border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
          data-testid={`lead-card-${lead.id}`}
          onClick={() => handleOpenLeadModal(lead)}
        >
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm truncate flex-1" title={lead.name}>
                  {lead.name}
                </h4>
                <div className="flex items-center gap-1">
                  {/* Drag Handle */}
                  <div
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        data-testid={`edit-lead-${lead.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenLeadModal(lead);
                        }}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        {t('crm.actions.edit', 'Edit')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        data-testid={`delete-lead-${lead.id}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        {t('crm.actions.delete', 'Delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <p className="text-xs text-muted-foreground truncate" title={lead.company}>
                {lead.company}
              </p>

              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>{lead.country}</span>
              </div>

              {lead.productInterest && (
                <Badge variant="outline" className="text-xs">
                  {lead.productInterest}
                </Badge>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(lead.createdAt)}</span>
                </div>
                <span className="text-primary font-medium">#{lead.score}</span>
              </div>

              {/* Quick Actions */}
              <motion.div
                className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ opacity: 0, y: -10 }}
                whileHover={{ opacity: 1, y: 0 }}
              >
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs h-7 px-2 hover:bg-blue-500 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`mailto:${lead.email}`, '_blank');
                  }}
                  title="Send Email"
                >
                  <Mail className="w-3 h-3" />
                </Button>
                {lead.phone && (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs h-7 px-2 hover:bg-green-500 hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        const phone = lead.phone?.replace(/[^0-9]/g, '');
                        window.open(`https://wa.me/${phone}`, '_blank');
                      }}
                      title="WhatsApp"
                    >
                      <MessageSquare className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs h-7 px-2 hover:bg-purple-500 hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`tel:${lead.phone}`, '_blank');
                      }}
                      title="Call"
                    >
                      <Phone className="w-3 h-3" />
                    </Button>
                  </>
                )}
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = leadStatuses.find(s => s.value === status);
    return statusConfig || { value: status, label: status, color: 'bg-gray-500' };
  };

  const handleOpenLeadModal = (lead: Lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleCloseLeadModal = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
  };

  const handleExportToExcel = () => {
    if (filteredLeads.length === 0) {
      toast({
        title: t('crm.export.empty.title', 'No Data to Export'),
        description: t('crm.export.empty.description', 'There are no leads matching your current filters.'),
        variant: "destructive",
      });
      return;
    }

    // Prepare data for export
    const exportData = filteredLeads.map(lead => ({
      'Name': lead.name,
      'Email': lead.email,
      'Phone': lead.phone || 'N/A',
      'Company': lead.company,
      'Country': lead.country,
      'Product Interest': lead.productInterest || 'N/A',
      'Status': getStatusBadge(lead.status).label,
      'Assigned To': lead.assignedTo || 'Unassigned',
      'Source': lead.source,
      'Score': lead.score,
      'UTM Source': lead.utmSource || 'N/A',
      'UTM Medium': lead.utmMedium || 'N/A',
      'UTM Campaign': lead.utmCampaign || 'N/A',
      'Created': formatDate(lead.createdAt),
      'Message': lead.message || 'N/A',
      'Notes': lead.notes || 'N/A'
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    const colWidths = [
      { wch: 20 }, // Name
      { wch: 30 }, // Email
      { wch: 15 }, // Phone
      { wch: 25 }, // Company
      { wch: 15 }, // Country
      { wch: 20 }, // Product Interest
      { wch: 12 }, // Status
      { wch: 15 }, // Assigned To
      { wch: 12 }, // Source
      { wch: 8 },  // Score
      { wch: 15 }, // UTM Source
      { wch: 15 }, // UTM Medium
      { wch: 20 }, // UTM Campaign
      { wch: 18 }, // Created
      { wch: 40 }, // Message
      { wch: 40 }  // Notes
    ];
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Leads');

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `SakthiSaiBiotech_Leads_${timestamp}.xlsx`;

    // Save file
    XLSX.writeFile(wb, filename);

    toast({
      title: t('crm.export.success.title', 'Export Successful'),
      description: t('crm.export.success.description', `Exported ${filteredLeads.length} leads to ${filename}`),
    });
  };

  const handleExportToCSV = () => {
    if (filteredLeads.length === 0) {
      toast({
        title: t('crm.export.empty.title', 'No Data to Export'),
        description: t('crm.export.empty.description', 'There are no leads matching your current filters.'),
        variant: "destructive",
      });
      return;
    }

    // Prepare data for export
    const exportData = filteredLeads.map(lead => ({
      'Name': lead.name,
      'Email': lead.email,
      'Phone': lead.phone || 'N/A',
      'Company': lead.company,
      'Country': lead.country,
      'Product Interest': lead.productInterest || 'N/A',
      'Status': getStatusBadge(lead.status).label,
      'Assigned To': lead.assignedTo || 'Unassigned',
      'Source': lead.source,
      'Score': lead.score,
      'UTM Source': lead.utmSource || 'N/A',
      'UTM Medium': lead.utmMedium || 'N/A',
      'UTM Campaign': lead.utmCampaign || 'N/A',
      'Created': formatDate(lead.createdAt),
      'Message': lead.message || 'N/A',
      'Notes': lead.notes || 'N/A'
    }));

    // Create worksheet and convert to CSV
    const ws = XLSX.utils.json_to_sheet(exportData);
    const csv = XLSX.utils.sheet_to_csv(ws);

    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `SakthiSaiBiotech_Leads_${timestamp}.csv`;

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: t('crm.export.success.title', 'Export Successful'),
      description: t('crm.export.success.description', `Exported ${filteredLeads.length} leads to ${filename}`),
    });
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-6 text-center">
            <Users className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">{t('crm.error.title', 'Failed to Load CRM')}</h2>
            <p className="text-muted-foreground">{t('crm.error.description', 'Please check your connection and try again.')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header with Gradient */}
      <div className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
          <div className="absolute inset-0 bg-mesh-gradient opacity-30" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/5 rounded-full blur-3xl animate-pulse-slow" />

        <div className="relative container mx-auto px-4 py-8">
          <motion.div
            className="flex items-center justify-between mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Users className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                </motion.div>
                {t('crm.title', 'Customer Relationship Management')}
              </h1>
              <p className="text-muted-foreground mt-2 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                {t('crm.subtitle', 'Manage leads and track customer interactions')}
              </p>

              {/* Quick Stats */}
              <motion.div
                className="flex gap-4 mt-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="font-semibold">{filteredLeads.length}</span>
                  <span className="text-muted-foreground">Total Leads</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  <span className="font-semibold">
                    {filteredLeads.filter(l => l.status === 'new').length}
                  </span>
                  <span className="text-muted-foreground">New</span>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="card-hover" data-testid="export-button">
                    <Download className="w-4 h-4 mr-2" />
                    {t('crm.export.button', 'Export')}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleExportToExcel} data-testid="export-excel">
                    <Download className="w-4 h-4 mr-2" />
                    {t('crm.export.excel', 'Export to Excel (.xlsx)')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportToCSV} data-testid="export-csv">
                    <Download className="w-4 h-4 mr-2" />
                    {t('crm.export.csv', 'Export to CSV (.csv)')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button className="bg-primary card-hover" data-testid="add-lead-button">
                <Plus className="w-4 h-4 mr-2" />
                {t('crm.addLead', 'Add Lead')}
              </Button>
            </motion.div>
          </motion.div>

          {/* Filters */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder={t('crm.search.placeholder', 'Search leads...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="crm-search-input"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48" data-testid="crm-status-filter">
                  <SelectValue placeholder={t('crm.filter.status', 'Filter by status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('crm.filter.all', 'All Status')}</SelectItem>
                  {leadStatuses.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                data-testid="toggle-advanced-filters"
              >
                <Filter className="w-4 h-4 mr-2" />
                {t('crm.filter.advanced', 'Advanced Filters')}
              </Button>

              <Tabs value={view} onValueChange={(value) => setView(value as "kanban" | "table")}>
                <TabsList>
                  <TabsTrigger value="kanban" data-testid="view-kanban">Kanban</TabsTrigger>
                  <TabsTrigger value="table" data-testid="view-table">Table</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg border border-border">
                <div>
                  <Label className="mb-2 block text-sm font-medium">
                    {t('crm.filter.assigned', 'Assigned To')}
                  </Label>
                  <Select value={assignedFilter} onValueChange={setAssignedFilter}>
                    <SelectTrigger data-testid="crm-assigned-filter">
                      <SelectValue placeholder={t('crm.filter.allAssigned', 'All')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('crm.filter.allAssigned', 'All')}</SelectItem>
                      <SelectItem value="unassigned">{t('crm.filter.unassigned', 'Unassigned')}</SelectItem>
                      <SelectItem value="admin">{t('crm.filter.admin', 'Administrator')}</SelectItem>
                      <SelectItem value="sales_team">{t('crm.filter.salesTeam', 'Sales Team')}</SelectItem>
                      <SelectItem value="marketing">{t('crm.filter.marketing', 'Marketing Manager')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2 block text-sm font-medium">
                    {t('crm.filter.source', 'Source')}
                  </Label>
                  <Select value={sourceFilter} onValueChange={setSourceFilter}>
                    <SelectTrigger data-testid="crm-source-filter">
                      <SelectValue placeholder={t('crm.filter.allSources', 'All Sources')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('crm.filter.allSources', 'All Sources')}</SelectItem>
                      <SelectItem value="website">{t('crm.filter.website', 'Website')}</SelectItem>
                      <SelectItem value="email">{t('crm.filter.email', 'Email')}</SelectItem>
                      <SelectItem value="phone">{t('crm.filter.phone', 'Phone')}</SelectItem>
                      <SelectItem value="referral">{t('crm.filter.referral', 'Referral')}</SelectItem>
                      <SelectItem value="trade_show">{t('crm.filter.tradeShow', 'Trade Show')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2 block text-sm font-medium">
                    {t('crm.filter.dateRange', 'Date Range')}
                  </Label>
                  <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
                    <SelectTrigger data-testid="crm-date-filter">
                      <SelectValue placeholder={t('crm.filter.allDates', 'All Time')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('crm.filter.allDates', 'All Time')}</SelectItem>
                      <SelectItem value="today">{t('crm.filter.today', 'Today')}</SelectItem>
                      <SelectItem value="week">{t('crm.filter.week', 'Last 7 Days')}</SelectItem>
                      <SelectItem value="month">{t('crm.filter.month', 'Last 30 Days')}</SelectItem>
                      <SelectItem value="quarter">{t('crm.filter.quarter', 'Last 90 Days')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-gradient-to-r from-muted via-muted/50 to-muted rounded animate-shimmer" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="h-20 bg-gradient-to-r from-muted via-muted/50 to-muted rounded animate-shimmer" />
                    <div className="h-20 bg-gradient-to-r from-muted via-muted/50 to-muted rounded animate-shimmer" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : view === "kanban" ? (
          /* Kanban View with Drag & Drop - Fixed grid to accommodate all 6 statuses */
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {leadStatuses.map((status, statusIndex) => (
                <motion.div
                  key={status.value}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: statusIndex * 0.1 }}
                >
                  <SortableContext
                    id={status.value}
                    items={groupedLeads[status.value]?.map(l => l.id) || []}
                    strategy={verticalListSortingStrategy}
                  >
                    <Card className="flex flex-col h-full" id={status.value}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <motion.div
                          className={`w-3 h-3 rounded-full ${status.color}`}
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        />
                        {status.label}
                      </CardTitle>
                      <Badge variant="secondary" data-testid={`kanban-count-${status.value}`}>
                        {groupedLeads[status.value]?.length || 0}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-3" data-droppable-id={status.value}>
                    <AnimatePresence mode="popLayout">
                      {groupedLeads[status.value]?.map((lead, index) => (
                        <motion.div
                          key={lead.id}
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <DraggableLeadCard lead={lead} />
                        </motion.div>
                      ))}
                    </AnimatePresence>

                  {groupedLeads[status.value]?.length === 0 && (
                    <motion.div
                      className="text-center py-8 text-muted-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      </motion.div>
                      <p className="text-sm">{t('crm.empty', 'No leads in this stage')}</p>
                    </motion.div>
                  )}
                </CardContent>
                    </Card>
                  </SortableContext>
                </motion.div>
              ))}
            </div>

            {/* Drag Overlay */}
            <DragOverlay>
              {activeLead ? (
                <Card className="opacity-90 shadow-2xl border-2 border-primary rotate-3">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">{activeLead.name}</h4>
                      <p className="text-xs text-muted-foreground">{activeLead.company}</p>
                      <Badge variant="outline" className="text-xs">
                        {activeLead.country}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </DragOverlay>
          </DndContext>
        ) : (
          /* Table View */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-lg">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border bg-muted/30">
                      <tr>
                        <th className="text-left p-4 font-semibold">{t('crm.table.name', 'Name')}</th>
                        <th className="text-left p-4 font-semibold">{t('crm.table.company', 'Company')}</th>
                        <th className="text-left p-4 font-semibold">{t('crm.table.status', 'Status')}</th>
                        <th className="text-left p-4 font-semibold">{t('crm.table.country', 'Country')}</th>
                        <th className="text-left p-4 font-semibold">{t('crm.table.created', 'Created')}</th>
                        <th className="text-left p-4 font-semibold">{t('crm.table.actions', 'Actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeads.map((lead, index) => (
                        <motion.tr
                          key={lead.id}
                          className="border-b border-border hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={() => handleOpenLeadModal(lead)}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.01 }}
                        >
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{lead.name}</div>
                            <div className="text-sm text-muted-foreground">{lead.email}</div>
                          </div>
                        </td>
                        <td className="p-4">{lead.company}</td>
                        <td className="p-4">
                          <Badge className={`${getStatusBadge(lead.status).color} text-white`}>
                            {getStatusBadge(lead.status).label}
                          </Badge>
                        </td>
                        <td className="p-4">{lead.country}</td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {formatDate(lead.createdAt)}
                        </td>
                        <td className="p-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenLeadModal(lead);
                                }}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                {t('crm.actions.edit', 'Edit')}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                {t('crm.actions.delete', 'Delete')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredLeads.length === 0 && (
                  <motion.div
                    className="text-center py-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50 text-primary" />
                    </motion.div>
                    <h3 className="text-lg font-semibold mb-2">
                      {t('crm.table.empty.title', 'No leads found')}
                    </h3>
                    <p className="text-muted-foreground">
                      {t('crm.table.empty.description', 'Try adjusting your search criteria or add new leads.')}
                    </p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Lead Detail Modal */}
      <LeadDetailModal
        lead={selectedLead}
        isOpen={isModalOpen}
        onClose={handleCloseLeadModal}
      />
    </div>
  );
}
