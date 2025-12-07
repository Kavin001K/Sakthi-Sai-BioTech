import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  Tag,
  MessageSquare,
  Save,
  X,
  Plus,
  Send
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

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

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function LeadDetailModal({ lead, isOpen, onClose }: LeadDetailModalProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Initialize with defaults for creation mode
  const [editedLead, setEditedLead] = useState<Partial<Lead>>({
    name: "",
    email: "",
    status: "new",
    source: "manual",
    company: "",
    country: "",
    ...lead
  });

  const [newNote, setNewNote] = useState("");

  // Reset state when lead prop changes
  useEffect(() => {
    if (lead) {
      setEditedLead(lead);
    } else {
      setEditedLead({
        name: "",
        email: "",
        status: "new",
        source: "manual",
        company: "Unknown Company",
        country: "Unknown",
      });
    }
  }, [lead, isOpen]);

  const updateLeadMutation = useMutation({
    mutationFn: async (data: Partial<Lead>) => {
      const response = await apiRequest('PUT', `/api/admin/leads/${lead?.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/leads'] });
      toast({
        title: t('crm.success.title', 'Lead Updated'),
        description: t('crm.success.description', 'Lead has been successfully updated.'),
      });
      onClose();
    },
    onError: () => {
      toast({
        title: t('crm.error.title', 'Update Failed'),
        description: t('crm.error.description', 'Failed to update lead. Please try again.'),
        variant: "destructive",
      });
    },
  });

  const createLeadMutation = useMutation({
    mutationFn: async (data: Partial<Lead>) => {
      // Use inquiry endpoint to create a lead
      const response = await apiRequest('POST', '/api/inquiries', {
        ...data,
        message: data.notes || "Manual Entry",
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/leads'] });
      toast({
        title: "Lead Created",
        description: "New lead has been successfully added.",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Creation Failed",
        description: "Failed to create lead.",
        variant: "destructive",
      });
    }
  });

  const handleSave = () => {
    if (lead) {
      updateLeadMutation.mutate(editedLead);
    } else {
      createLeadMutation.mutate(editedLead);
    }
  };

  const handleWhatsApp = () => {
    if (!lead) return;
    const message = encodeURIComponent(`Hello ${lead.name}, thank you for your inquiry about ${lead.productInterest || 'our products'}. How can we assist you further?`);
    const phone = lead.phone?.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const handleEmail = () => {
    if (!lead) return;
    const subject = encodeURIComponent(`Re: Your inquiry about ${lead.productInterest || 'our products'}`);
    const body = encodeURIComponent(`Dear ${lead.name},\n\nThank you for your interest in Sakthi Sai Biotech products.\n\nBest regards,\nSakthi Sai Biotech Team`);
    window.open(`mailto:${lead.email}?subject=${subject}&body=${body}`, '_blank');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isSaving = updateLeadMutation.isPending || createLeadMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            {lead ? (
              <>
                <User className="w-6 h-6 text-primary" />
                {lead.name}
              </>
            ) : (
              <>
                <Plus className="w-6 h-6 text-primary" />
                Create New Lead
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {lead ? "Lead Details & Management" : "Enter information for the new lead"}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="notes" disabled={!lead}>Notes & Follow-up</TabsTrigger>
            <TabsTrigger value="activity" disabled={!lead}>Activity</TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </Label>
                  <Input
                    value={editedLead.name || ""}
                    onChange={(e) => setEditedLead({ ...editedLead, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={editedLead.email || ""}
                      onChange={(e) => setEditedLead({ ...editedLead, email: e.target.value })}
                      className="flex-1"
                      placeholder="email@example.com"
                    />
                    {lead && (
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={handleEmail}
                        title="Send Email"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4" />
                    Phone
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={editedLead.phone || ""}
                      onChange={(e) => setEditedLead({ ...editedLead, phone: e.target.value })}
                      className="flex-1"
                      placeholder="+1 234 567 890"
                    />
                    {lead?.phone && (
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={handleWhatsApp}
                        title="Open WhatsApp"
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Building className="w-4 h-4" />
                    Company
                  </Label>
                  <Input
                    value={editedLead.company || ""}
                    onChange={(e) => setEditedLead({ ...editedLead, company: e.target.value })}
                    placeholder="Company Name"
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4" />
                    Country
                  </Label>
                  <Input
                    value={editedLead.country || ""}
                    onChange={(e) => setEditedLead({ ...editedLead, country: e.target.value })}
                    placeholder="Country"
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Tag className="w-4 h-4" />
                    Product Interest
                  </Label>
                  <Input
                    value={editedLead.productInterest || ""}
                    onChange={(e) => setEditedLead({ ...editedLead, productInterest: e.target.value })}
                    placeholder="Micronutrients"
                  />
                </div>
              </div>

              {/* Status & Assignment */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <Label className="mb-2">Status</Label>
                  <Select
                    value={editedLead.status || "new"}
                    onValueChange={(value) => setEditedLead({ ...editedLead, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="quoted">Quoted</SelectItem>
                      <SelectItem value="negotiation">Negotiation</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2">Assigned To</Label>
                  <Select
                    value={editedLead.assignedTo || 'unassigned'}
                    onValueChange={(value) => setEditedLead({ ...editedLead, assignedTo: value === 'unassigned' ? null : value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="sales_team">Sales Team</SelectItem>
                      <SelectItem value="marketing">Marketing Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Description/Notes for New Lead */}
              {!lead && (
                <div className="mt-6">
                  <Label className="mb-2">Initial Notes</Label>
                  <Textarea
                    value={editedLead.notes || ""}
                    onChange={(e) => setEditedLead({ ...editedLead, notes: e.target.value })}
                    placeholder="Enter initial lead details or notes..."
                  />
                </div>
              )}

              {/* Original Message (Only for existing) */}
              {lead && lead.message && (
                <div className="mt-6">
                  <Label className="mb-2">Original Message</Label>
                  <Textarea
                    value={lead.message}
                    readOnly
                    className="min-h-[100px] bg-muted/30"
                  />
                </div>
              )}

              {/* UTM Parameters */}
              {lead && (lead.utmSource || lead.utmMedium || lead.utmCampaign) && (
                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold mb-2">Source Tracking</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    {lead.utmSource && (
                      <div>
                        <span className="text-muted-foreground">Source:</span>
                        <Badge variant="outline" className="ml-2">{lead.utmSource}</Badge>
                      </div>
                    )}
                    {lead.utmMedium && (
                      <div>
                        <span className="text-muted-foreground">Medium:</span>
                        <Badge variant="outline" className="ml-2">{lead.utmMedium}</Badge>
                      </div>
                    )}
                    {lead.utmCampaign && (
                      <div>
                        <span className="text-muted-foreground">Campaign:</span>
                        <Badge variant="outline" className="ml-2">{lead.utmCampaign}</Badge>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Metadata */}
              {lead && (
                <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Created: {formatDate(lead.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Score: </span>
                    <Badge variant="secondary">{lead.score}</Badge>
                  </div>
                </div>
              )}
            </motion.div>
          </TabsContent>

          {/* Notes & Follow-up Tab */}
          <TabsContent value="notes" className="space-y-4">
            {/* Only show if lead exists */}
            {lead && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <Label className="mb-2">Add New Note</Label>
                  <Textarea
                    placeholder="Add notes about this lead..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <Button className="mt-2" onClick={() => {
                    setEditedLead({
                      ...editedLead,
                      notes: (editedLead.notes || lead.notes || '') + '\n\n' + `[${new Date().toLocaleString()}] ${newNote}`
                    });
                    setNewNote('');
                  }}>
                    <Save className="w-4 h-4 mr-2" />
                    Add Note
                  </Button>
                </div>

                {(editedLead.notes || lead.notes) && (
                  <div className="mt-6">
                    <Label className="mb-2">Previous Notes</Label>
                    <div className="p-4 bg-muted/30 rounded-lg whitespace-pre-wrap">
                      {editedLead.notes || lead.notes}
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <Label className="mb-2">Set Follow-up Date</Label>
                  <Input
                    type="datetime-local"
                    className="max-w-md"
                  />
                  <Button className="mt-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Follow-up
                  </Button>
                </div>
              </motion.div>
            )}
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4">
            {lead && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-4">
                  <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/30">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Lead Created</span>
                      <span className="text-sm text-muted-foreground">{formatDate(lead.createdAt)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      From: {lead.source}
                    </p>
                  </div>

                  <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950/30">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Status Updated</span>
                      <span className="text-sm text-muted-foreground">{formatDate(lead.updatedAt)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Current status: <Badge>{lead.status}</Badge>
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 mt-6 pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : (lead ? 'Save Changes' : 'Create Lead')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
