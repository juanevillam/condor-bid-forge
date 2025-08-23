import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, X } from "lucide-react";
import { useBidStore } from "@/lib/stores/bid-store";
import type { Bid, Source } from "@/lib/types";

const LABEL_COLORS = {
  Legal: "bg-indigo-500/15 text-indigo-500",
  Finance: "bg-emerald-500/15 text-emerald-500",
  Technical: "bg-sky-500/15 text-sky-500",
  Commercial: "bg-amber-500/15 text-amber-500",
  Admin: "bg-slate-500/15 text-slate-500",
} as const;

// Helper function to get random labels
const getRandomLabels = (): string[] => {
  const availableLabels = ['Legal', 'Finance', 'Technical', 'Commercial', 'Admin'];
  const numLabels = Math.random() < 0.5 ? 1 : 2; // 1 or 2 labels
  const shuffled = [...availableLabels].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, numLabels);
};

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// Helper function to get file type from extension
const getFileType = (filename: string): 'pdf' | 'docx' | 'xlsx' | 'txt' => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf': return 'pdf';
    case 'docx': case 'doc': return 'docx';
    case 'xlsx': case 'xls': return 'xlsx';
    case 'txt': return 'txt';
    default: return 'txt';
  }
};

interface BidSetupDialogProps {
  bid: Bid;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
  onCancel: () => void;
}

export function BidSetupDialog({ bid, open, onOpenChange, onComplete, onCancel }: BidSetupDialogProps) {
  const { updateBid, addSourceToBid, removeSourceFromBid } = useBidStore();
  const [formData, setFormData] = useState({
    title: bid.title || "",
    client: bid.client || "",
    submissionDeadline: bid.submissionDeadline || "",
    stage: bid.stage || "" as "discovery" | "proposal" | "review" | "submitted" | "",
    description: "",
  });
  const [uploadedSources, setUploadedSources] = useState<Source[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title) {
      return;
    }

    // Update the existing bid with the form data
    updateBid(bid.id, {
      title: formData.title,
      client: formData.client || undefined,
      submissionDeadline: formData.submissionDeadline || undefined,
      stage: formData.stage || undefined
    });

    onComplete();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    
    for (const file of files) {
      // Create source object like in sources-panel
      const source: Source = {
        id: crypto.randomUUID(),
        name: file.name,
        type: getFileType(file.name),
        size: formatFileSize(file.size),
        labels: getRandomLabels(),
        createdAt: new Date().toISOString()
      };

      // Add to local state for UI display
      setUploadedSources(prev => [...prev, source]);

      // Store the file in the bid store
      try {
        addSourceToBid(bid.id, source, file);
      } catch (error) {
        console.error('Failed to upload file:', error);
      }
    }

    // Clear the input
    e.target.value = '';
  };

  const handleRemoveSource = (sourceId: string) => {
    // Remove from local UI state
    setUploadedSources(prev => prev.filter(source => source.id !== sourceId));
    
    // Remove from bid's sources in the store
    removeSourceFromBid(bid.id, sourceId);
  };

  const isFormValid = !!formData.title;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create new bid</DialogTitle>
          <DialogDescription>
            Set up your bid workspace with initial details and source documents.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Bid Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Federal Infrastructure Modernization RFP"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="client">Client/Agency</Label>
                <Input
                  id="client"
                  placeholder="e.g., Department of Transportation"
                  value={formData.client}
                  onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deadline">Submission Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.submissionDeadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, submissionDeadline: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stage">Current Stage</Label>
                <Select onValueChange={(value: "discovery" | "proposal" | "review" | "submitted") => setFormData(prev => ({ ...prev, stage: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select current stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="discovery">Discovery</SelectItem>
                    <SelectItem value="proposal">Proposal Development</SelectItem>
                    <SelectItem value="review">Internal Review</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the opportunity, key requirements, or strategic notes..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* Initial Documents */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Initial Documents</h3>
            
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              <input
                type="file"
                multiple
                accept=".pdf,.docx,.xlsx,.txt"
                onChange={handleFileUpload}
                className="hidden"
                id="dialog-file-upload"
              />
              <label htmlFor="dialog-file-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag & drop files here or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports PDF, DOCX, XLSX, TXT
                </p>
              </label>
            </div>

            {uploadedSources.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Selected Files:</h4>
                <div className="space-y-2">
                  {uploadedSources.map((source) => (
                    <div key={source.id} className="flex items-center justify-between p-2 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">{source.name}</span>
                        <span className="text-xs text-muted-foreground">({source.size})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {source.labels?.map((label) => (
                            <Badge 
                              key={label} 
                              variant="secondary" 
                              className={`text-xs ${LABEL_COLORS[label as keyof typeof LABEL_COLORS]}`}
                            >
                              {label}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSource(source.id)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid}
            >
              Create Bid Workspace
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}