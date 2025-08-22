import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Upload, FileText, File, MoreVertical, Download, Trash2, Eye } from "lucide-react";
import { Source } from "@/lib/types";
import { mockSources, uploadSource } from "@/lib/mock-data";

interface SourcesPanelProps {
  onSourcesUpdate?: (sources: Source[]) => void;
}

export function SourcesPanel({ onSourcesUpdate }: SourcesPanelProps) {
  const [sources, setSources] = useState<Source[]>(mockSources);
  const [uploadingSources, setUploadingSources] = useState<Array<{ id: string; progress: number }>>([]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    
    for (const file of files) {
      const uploadId = Math.random().toString(36).substr(2, 9);
      setUploadingSources(prev => [...prev, { id: uploadId, progress: 0 }]);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadingSources(prev => 
          prev.map(upload => 
            upload.id === uploadId 
              ? { ...upload, progress: Math.min(upload.progress + Math.random() * 30, 100) }
              : upload
          )
        );
      }, 200);

      try {
        const source = await uploadSource(file);
        setSources(prev => [...prev, source]);
        onSourcesUpdate?.([...sources, source]);
        
        clearInterval(interval);
        setUploadingSources(prev => prev.filter(upload => upload.id !== uploadId));
      } catch (error) {
        clearInterval(interval);
        setUploadingSources(prev => prev.filter(upload => upload.id !== uploadId));
      }
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-4 h-4 text-red-500" />;
      case 'docx':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'xlsx':
        return <FileText className="w-4 h-4 text-green-500" />;
      default:
        return <File className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="h-full flex flex-col">
      <CardContent className="flex-1 flex flex-col gap-4">
        {/* Upload Zone */}
        <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
          <input
            type="file"
            multiple
            accept=".pdf,.docx,.xlsx,.txt"
            onChange={handleFileUpload}
            className="hidden"
            id="sources-upload"
          />
          <label htmlFor="sources-upload" className="cursor-pointer">
            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium mb-1">Add sources</p>
            <p className="text-xs text-muted-foreground">PDF, DOCX, XLSX, TXT</p>
          </label>
        </div>

        {/* Discover Button */}
        <Button variant="outline" className="w-full">
          <Eye className="w-4 h-4 mr-2" />
          Discover
        </Button>

        {/* Sources List */}
        <div className="flex-1">
          <ScrollArea className="h-full">
            <div className="space-y-3">
              {/* Uploading Files */}
              {uploadingSources.map((upload) => (
                <Card key={upload.id} className="p-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <File className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Uploading...</span>
                    </div>
                    <Progress value={upload.progress} className="h-1" />
                  </div>
                </Card>
              ))}

              {/* Uploaded Sources */}
              {sources.map((source) => (
                <Card key={source.id} className="p-3 hover:bg-accent/50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      {getFileIcon(source.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{source.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{formatFileSize(source.size)}</span>
                          <span>•</span>
                          <span className="capitalize">{source.status}</span>
                        </div>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreVertical className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Card>
              ))}

              {sources.length === 0 && uploadingSources.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No sources added yet</p>
                  <p className="text-xs">Upload documents to get started</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </div>
  );
}