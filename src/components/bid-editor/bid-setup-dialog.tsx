import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText } from "lucide-react";
import { useBidStore } from "@/lib/stores/bid-store";
import type { Bid } from "@/lib/types";

interface BidSetupDialogProps {
  bid: Bid;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
  onCancel: () => void;
}

export function BidSetupDialog({ bid, open, onOpenChange, onComplete, onCancel }: BidSetupDialogProps) {
  const { updateBid } = useBidStore();
  const [formData, setFormData] = useState({
    title: bid.title || "",
    client: bid.client || "",
    submissionDeadline: bid.submissionDeadline || "",
    stage: bid.stage || "" as "discovery" | "proposal" | "review" | "submitted" | "",
    description: "",
    files: [] as File[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.client || !formData.submissionDeadline || !formData.stage) {
      return;
    }

    // Update the existing bid with the form data
    updateBid(bid.id, {
      title: formData.title,
      client: formData.client,
      submissionDeadline: formData.submissionDeadline,
      stage: formData.stage
    });

    onComplete();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...Array.from(e.target.files!)]
      }));
    }
  };

  const isFormValid = formData.title && formData.client && formData.submissionDeadline && formData.stage;

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
                <Label htmlFor="client">Client/Agency *</Label>
                <Input
                  id="client"
                  placeholder="e.g., Department of Transportation"
                  value={formData.client}
                  onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deadline">Submission Deadline *</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.submissionDeadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, submissionDeadline: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stage">Current Stage *</Label>
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

            {formData.files.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Selected Files:</h4>
                <div className="space-y-1">
                  {formData.files.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="w-4 h-4" />
                      <span>{file.name}</span>
                      <span>({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
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