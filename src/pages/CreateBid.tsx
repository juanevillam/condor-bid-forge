import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Calendar, Building2, Target } from "lucide-react";
import { Header } from "@/components/layout/header";
import { useBidStore } from "@/lib/stores/bid-store";

export default function CreateBid() {
  const navigate = useNavigate();
  const { addBid } = useBidStore();
  const [formData, setFormData] = useState({
    title: "",
    client: "",
    submissionDeadline: "",
    stage: "" as "discovery" | "proposal" | "review" | "submitted" | "",
    description: "",
    files: [] as File[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.client || !formData.submissionDeadline || !formData.stage) {
      return;
    }

    // Create the bid
    addBid({
      title: formData.title,
      client: formData.client,
      submissionDeadline: formData.submissionDeadline,
      stage: formData.stage
    });

    // Navigate back to home to see the new bid
    navigate('/');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...Array.from(e.target.files!)]
      }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-4xl mx-auto py-8 px-6">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Bid</h1>
          <p className="text-muted-foreground">
            Set up your bid workspace with initial details and source documents.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Enter the fundamental details about this bid opportunity.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Bid Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Federal Infrastructure Modernization RFP"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
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
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="deadline">Submission Deadline *</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.submissionDeadline}
                    onChange={(e) => setFormData(prev => ({ ...prev, submissionDeadline: e.target.value }))}
                    required
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
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
                  className="min-h-[100px] transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </CardContent>
          </Card>

          {/* Initial Documents */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Initial Documents
              </CardTitle>
              <CardDescription>
                Upload source documents to get started. You can add more later.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.docx,.xlsx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Upload Documents</h3>
                  <p className="text-muted-foreground mb-4">
                    Drag & drop files here or click to browse
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports PDF, DOCX, XLSX, TXT
                  </p>
                </label>
              </div>

              {formData.files.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Selected Files:</h4>
                  <div className="space-y-2">
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
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-primary hover:opacity-90 transition-opacity"
              disabled={!formData.title || !formData.client || !formData.submissionDeadline || !formData.stage}
            >
              Create Bid Workspace
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}