import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Upload, 
  FileText, 
  File, 
  MoreVertical, 
  Download, 
  Trash2, 
  Search,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  Tag
} from "lucide-react";
import { Source, ClassificationLabel } from "@/lib/types";
import { mockSources, uploadSource } from "@/lib/mock-data";

interface SourcesPanelProps {
  onSourcesUpdate?: (sources: Source[]) => void;
}

type CheckboxState = boolean | 'indeterminate';

const LABEL_COLORS = {
  Legal: "bg-violet-100 text-violet-700 border-violet-200",
  Finance: "bg-emerald-100 text-emerald-700 border-emerald-200", 
  Technical: "bg-sky-100 text-sky-700 border-sky-200",
  Commercial: "bg-amber-100 text-amber-700 border-amber-200",
  Admin: "bg-slate-100 text-slate-700 border-slate-200"
} as const;

export function SourcesPanel({ onSourcesUpdate }: SourcesPanelProps) {
  const [sources, setSources] = useState<Source[]>(mockSources);
  const [uploadingSources, setUploadingSources] = useState<Array<{ id: string; progress: number }>>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());
  const [originalDocsOpen, setOriginalDocsOpen] = useState(true);
  const [aiClassifiedOpen, setAiClassifiedOpen] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['Legal', 'Finance', 'Technical', 'Commercial', 'Admin']));

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    
    for (const file of files) {
      const uploadId = Math.random().toString(36).substr(2, 9);
      setUploadingSources(prev => [...prev, { id: uploadId, progress: 0 }]);

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

  const filteredSources = useMemo(() => {
    if (!searchQuery) return sources;
    
    return sources.filter(source => {
      const nameMatch = source.name.toLowerCase().includes(searchQuery.toLowerCase());
      const paragraphMatch = source.paragraphs?.some(p => 
        p.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return nameMatch || paragraphMatch;
    });
  }, [sources, searchQuery]);

  const groupedSources = useMemo(() => {
    const groups: Record<string, Source[]> = {
      Legal: [],
      Finance: [],
      Technical: [],
      Commercial: [],
      Admin: []
    };

    filteredSources.forEach(source => {
      source.labels?.forEach(label => {
        if (groups[label.name]) {
          groups[label.name].push(source);
        }
      });
    });

    return groups;
  }, [filteredSources]);

  const getFileIcon = (type: string) => {
    const iconProps = "w-4 h-4";
    switch (type) {
      case 'pdf': return <FileText className={`${iconProps} text-red-500`} />;
      case 'docx': return <FileText className={`${iconProps} text-blue-500`} />;
      case 'xlsx': return <FileText className={`${iconProps} text-green-500`} />;
      default: return <File className={`${iconProps} text-muted-foreground`} />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCheckboxState = (itemIds: string[]): CheckboxState => {
    const selectedCount = itemIds.filter(id => selectedFiles.has(id)).length;
    if (selectedCount === 0) return false;
    if (selectedCount === itemIds.length) return true;
    return 'indeterminate';
  };

  const handleSelectAll = (itemIds: string[], checked: CheckboxState) => {
    setSelectedFiles(prev => {
      const newSet = new Set(prev);
      if (checked) {
        itemIds.forEach(id => newSet.add(id));
      } else {
        itemIds.forEach(id => newSet.delete(id));
      }
      return newSet;
    });
  };

  const handleFileSelect = (fileId: string, checked: boolean) => {
    setSelectedFiles(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(fileId);
      } else {
        newSet.delete(fileId);
      }
      return newSet;
    });
  };

  const toggleFileExpansion = (fileId: string) => {
    setExpandedFiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  };

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupName)) {
        newSet.delete(groupName);
      } else {
        newSet.add(groupName);
      }
      return newSet;
    });
  };

  const renderFileRow = (source: Source, showLabels = true) => (
    <div key={source.id} className="group">
      <div className="flex items-center gap-3 p-2 rounded-md hover:bg-accent/50 transition-colors">
        <Checkbox
          checked={selectedFiles.has(source.id)}
          onCheckedChange={(checked) => handleFileSelect(source.id, checked as boolean)}
        />
        
        <div className="flex items-start gap-2 flex-1 min-w-0">
          {getFileIcon(source.type)}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium truncate">{source.name}</p>
              {showLabels && source.labels && source.labels.length > 0 && (
                <div className="flex gap-1">
                  {source.labels.map(label => (
                    <Badge 
                      key={label.id} 
                      variant="outline" 
                      className={`text-xs px-1.5 py-0.5 ${LABEL_COLORS[label.name]}`}
                    >
                      {label.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{formatFileSize(source.size)}</span>
              <span>•</span>
              <span className="capitalize">{source.status}</span>
              {source.paragraphs && (
                <>
                  <span>•</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-xs text-primary hover:bg-transparent"
                    onClick={() => toggleFileExpansion(source.id)}
                  >
                    {expandedFiles.has(source.id) ? 'Hide' : 'Show'} snippets
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100">
              <MoreVertical className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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

      {expandedFiles.has(source.id) && source.paragraphs && (
        <div className="ml-9 mt-2 space-y-2">
          {source.paragraphs.map(paragraph => (
            <div key={paragraph.id} className="bg-muted/30 p-3 rounded-md">
              <p className="text-xs text-muted-foreground mb-1">
                {paragraph.page && `Page ${paragraph.page}`}
              </p>
              <p className="text-sm mb-2">{paragraph.text}</p>
              <div className="flex gap-1">
                {paragraph.labels.map(label => (
                  <Badge 
                    key={label.id} 
                    variant="outline" 
                    className={`text-xs px-1.5 py-0.5 ${LABEL_COLORS[label.name]}`}
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {label.name}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const hasAnySources = sources.length > 0 || uploadingSources.length > 0;

  return (
    <div className="h-full flex flex-col">
      <CardContent className="flex-1 flex flex-col gap-4">
        {/* Upload Zone */}
        <div className={`border-2 border-dashed border-border rounded-lg ${hasAnySources ? 'p-3' : 'p-6'} text-center hover:border-primary/50 transition-colors`}>
          <input
            type="file"
            multiple
            accept=".pdf,.docx,.xlsx,.txt"
            onChange={handleFileUpload}
            className="hidden"
            id="sources-upload"
          />
          <label htmlFor="sources-upload" className="cursor-pointer">
            <Upload className={`${hasAnySources ? 'w-5 h-5' : 'w-8 h-8'} mx-auto mb-2 text-muted-foreground`} />
            <p className={`${hasAnySources ? 'text-xs' : 'text-sm'} font-medium mb-1`}>Add sources</p>
            {!hasAnySources && (
              <p className="text-xs text-muted-foreground">PDF, DOCX, XLSX, TXT</p>
            )}
          </label>
        </div>

        {hasAnySources && (
          <>
            {/* Global Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search sources and content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Selection Counter */}
            {selectedFiles.size > 0 && (
              <div className="text-xs text-muted-foreground text-right">
                {selectedFiles.size} selected
              </div>
            )}
          </>
        )}

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

        {/* Empty State */}
        {!hasAnySources && (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm font-medium mb-1">Saved sources will appear here</p>
            <p className="text-xs">Click Add sources above to add PDFs, Word, Excel or text files.</p>
          </div>
        )}

        {/* Content Sections */}
        {hasAnySources && filteredSources.length > 0 && (
          <div className="flex-1 space-y-4">
            {/* Original Documents */}
            <Collapsible open={originalDocsOpen} onOpenChange={setOriginalDocsOpen}>
              <div className="flex items-center justify-between p-2 hover:bg-accent/50 rounded-md">
                <div className="flex items-center gap-2">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-auto p-1">
                      {originalDocsOpen ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  {originalDocsOpen ? (
                    <FolderOpen className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Folder className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium">Original Documents</span>
                  <Badge variant="secondary" className="text-xs">
                    {filteredSources.length}
                  </Badge>
                </div>
                <Checkbox
                  checked={getCheckboxState(filteredSources.map(s => s.id))}
                  onCheckedChange={(checked) => 
                    handleSelectAll(filteredSources.map(s => s.id), checked as CheckboxState)
                  }
                />
              </div>
              <CollapsibleContent>
                <ScrollArea className="max-h-64">
                  <div className="space-y-1 ml-4">
                    {filteredSources.map(source => renderFileRow(source, true))}
                  </div>
                </ScrollArea>
              </CollapsibleContent>
            </Collapsible>

            <Separator />

            {/* AI-Classified */}
            <Collapsible open={aiClassifiedOpen} onOpenChange={setAiClassifiedOpen}>
              <div className="flex items-center justify-between p-2 hover:bg-accent/50 rounded-md">
                <div className="flex items-center gap-2">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-auto p-1">
                      {aiClassifiedOpen ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">AI-Classified</span>
                </div>
                <Checkbox
                  checked={getCheckboxState(filteredSources.map(s => s.id))}
                  onCheckedChange={(checked) => 
                    handleSelectAll(filteredSources.map(s => s.id), checked as CheckboxState)
                  }
                />
              </div>
              <CollapsibleContent>
                <div className="space-y-3 ml-4">
                  {Object.entries(groupedSources).map(([groupName, groupSources]) => {
                    if (groupSources.length === 0) return null;
                    
                    return (
                      <div key={groupName}>
                        <div className="flex items-center justify-between p-2 hover:bg-accent/30 rounded-md">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-1"
                              onClick={() => toggleGroup(groupName)}
                            >
                              {expandedGroups.has(groupName) ? (
                                <ChevronDown className="w-3 h-3" />
                              ) : (
                                <ChevronRight className="w-3 h-3" />
                              )}
                            </Button>
                            <Badge 
                              variant="outline" 
                              className={`text-xs px-2 py-1 ${LABEL_COLORS[groupName as keyof typeof LABEL_COLORS]}`}
                            >
                              {groupName}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {groupSources.length}
                            </Badge>
                          </div>
                          <Checkbox
                            checked={getCheckboxState(groupSources.map(s => s.id))}
                            onCheckedChange={(checked) => 
                              handleSelectAll(groupSources.map(s => s.id), checked as CheckboxState)
                            }
                          />
                        </div>
                        {expandedGroups.has(groupName) && (
                          <ScrollArea className="max-h-48">
                            <div className="space-y-1 ml-4">
                              {groupSources.map(source => renderFileRow(source, false))}
                            </div>
                          </ScrollArea>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}

        {/* No Results */}
        {hasAnySources && filteredSources.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No results found</p>
            <p className="text-xs">Try a different search term</p>
          </div>
        )}
      </CardContent>
    </div>
  );
}