import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  ListChecks, 
  FileCog, 
  Banknote, 
  Users, 
  TrendingUp, 
  Plus, 
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useBidStore } from "@/lib/stores/bid-store";
import type { ProposalStatus } from "@/lib/types";

interface ActionsPanelProps {
  bidId: string;
}

export function ActionsPanel({ bidId }: ActionsPanelProps) {
  const { getBid, updateBidActions, initializeBidActions } = useBidStore();
  const { toast } = useToast();
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");

  const bid = getBid(bidId);

  useEffect(() => {
    if (bid) {
      initializeBidActions(bidId);
    }
  }, [bidId, bid, initializeBidActions]);

  const handleBriefingDoc = () => {
    const today = new Date().toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    const briefingContent = `• Key requirements analysis complete
• Technical feasibility confirmed
• Budget estimates within range
• Risk assessment in progress
• Stakeholder alignment needed`;

    const newNote = {
      id: crypto.randomUUID(),
      title: `Briefing doc – ${today}`,
      body: briefingContent,
      createdAt: new Date().toISOString()
    };

    const currentNotes = bid?.actions?.notes || [];
    updateBidActions(bidId, {
      notes: [newNote, ...currentNotes]
    });

    toast({
      title: "Briefing doc created",
      description: "Your briefing document has been generated and saved to notes."
    });
  };

  const handleAddNote = () => {
    setEditingNote(null);
    setNoteTitle("");
    setNoteBody("");
    setIsNoteDialogOpen(true);
  };

  const handleEditNote = (noteId: string) => {
    const note = bid?.actions?.notes.find(n => n.id === noteId);
    if (note) {
      setEditingNote(noteId);
      setNoteTitle(note.title);
      setNoteBody(note.body || "");
      setIsNoteDialogOpen(true);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    const currentNotes = bid?.actions?.notes || [];
    updateBidActions(bidId, {
      notes: currentNotes.filter(n => n.id !== noteId)
    });
  };

  const handleSaveNote = () => {
    if (!noteTitle.trim()) return;

    const currentNotes = bid?.actions?.notes || [];
    
    if (editingNote) {
      // Edit existing note
      updateBidActions(bidId, {
        notes: currentNotes.map(note => 
          note.id === editingNote 
            ? { ...note, title: noteTitle, body: noteBody, updatedAt: new Date().toISOString() }
            : note
        )
      });
    } else {
      // Add new note
      const newNote = {
        id: crypto.randomUUID(),
        title: noteTitle,
        body: noteBody,
        createdAt: new Date().toISOString()
      };
      
      updateBidActions(bidId, {
        notes: [newNote, ...currentNotes]
      });
    }

    setIsNoteDialogOpen(false);
    setNoteTitle("");
    setNoteBody("");
    setEditingNote(null);
  };

  const getStatusColor = (status: ProposalStatus) => {
    switch (status) {
      case 'not_started': return 'bg-slate-500/15 text-slate-500';
      case 'draft': return 'bg-amber-500/15 text-amber-500';
      case 'in_review': return 'bg-sky-500/15 text-sky-500';
      case 'final': return 'bg-emerald-500/15 text-emerald-500';
      default: return 'bg-slate-500/15 text-slate-500';
    }
  };

  const getStatusLabel = (status: ProposalStatus) => {
    switch (status) {
      case 'not_started': return 'Not started';
      case 'draft': return 'Draft';
      case 'in_review': return 'In review';
      case 'final': return 'Final';
      default: return 'Not started';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  if (!bid?.actions) return null;

  return (
    <div className="h-full flex flex-col">
      <CardContent className="flex-1 flex flex-col gap-4 p-4">
        <ScrollArea className="h-full">
          <div className="space-y-6">
            {/* Action Tiles */}
            <div>
              <Card 
                className="p-4 hover:bg-accent/50 transition-colors cursor-pointer group rounded-2xl shadow-sm"
                onClick={handleBriefingDoc}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <FileText className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">Briefing doc</h3>
                    <p className="text-xs text-muted-foreground">
                      Generate comprehensive briefing document
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <Separator />

            {/* Results */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ListChecks className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-medium text-sm">Results</h3>
              </div>
              <div className="space-y-2">
                {bid.actions.results.map((result, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{result}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Proposal */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileCog className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-medium text-sm">Proposal</h3>
              </div>
              <div className="space-y-3">
                {/* Technical Proposal */}
                <Card className="p-3 rounded-xl">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <FileCog className="w-4 h-4 text-sky-500 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">Technical Proposal</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className={getStatusColor(bid.actions.proposal.technical.status)}>
                            {getStatusLabel(bid.actions.proposal.technical.status)}
                          </Badge>
                          {bid.actions.proposal.technical.owner && (
                            <span className="text-xs text-muted-foreground">
                              {bid.actions.proposal.technical.owner}
                            </span>
                          )}
                        </div>
                        {bid.actions.proposal.technical.updatedAt && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Updated {formatDate(bid.actions.proposal.technical.updatedAt)}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Open draft
                    </Button>
                  </div>
                </Card>

                {/* Economic Proposal */}
                <Card className="p-3 rounded-xl">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Banknote className="w-4 h-4 text-emerald-500 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">Economic Proposal</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className={getStatusColor(bid.actions.proposal.economic.status)}>
                            {getStatusLabel(bid.actions.proposal.economic.status)}
                          </Badge>
                          {bid.actions.proposal.economic.owner && (
                            <span className="text-xs text-muted-foreground">
                              {bid.actions.proposal.economic.owner}
                            </span>
                          )}
                        </div>
                        {bid.actions.proposal.economic.updatedAt && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Updated {formatDate(bid.actions.proposal.economic.updatedAt)}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Open draft
                    </Button>
                  </div>
                </Card>
              </div>
            </div>

            <Separator />

            {/* Progress */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-medium text-sm">Progress</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Overall progress</span>
                  <span className="font-medium">{bid.actions.progress.overall}%</span>
                </div>
                <Progress value={bid.actions.progress.overall} className="h-2" />
              </div>
            </div>

            <Separator />

            {/* Stakeholders */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-medium text-sm">Stakeholders</h3>
              </div>
              <div className="space-y-2">
                {bid.actions.stakeholders.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Assign stakeholders</p>
                ) : (
                  bid.actions.stakeholders.map((stakeholder) => (
                    <div key={stakeholder.id} className="flex items-center gap-3">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">
                          {getInitials(stakeholder.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{stakeholder.name}</span>
                          <Badge variant="outline" className={
                            stakeholder.status === 'on_track' 
                              ? 'bg-emerald-500/15 text-emerald-500' 
                              : 'bg-amber-500/15 text-amber-500'
                          }>
                            {stakeholder.status === 'on_track' ? 'On track' : 'Needs input'}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{stakeholder.role}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <Separator />

            {/* Notes */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-medium text-sm">Notes</h3>
              </div>
              
              <div className="space-y-3">
                {bid.actions.notes.length === 0 ? (
                  <p className="text-xs text-muted-foreground mb-3">No notes yet</p>
                ) : (
                  bid.actions.notes.map((note) => (
                    <Card key={note.id} className="p-3 rounded-xl">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{note.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(note.createdAt)}
                            {note.updatedAt && note.updatedAt !== note.createdAt && (
                              <span> • Updated {formatDate(note.updatedAt)}</span>
                            )}
                          </p>
                          {note.body && (
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                              {note.body}
                            </p>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                              <MoreVertical className="w-3 h-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditNote(note.id)}>
                              <Edit className="w-3 h-3 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteNote(note.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-3 h-3 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </Card>
                  ))
                )}

                <Button 
                  variant="outline" 
                  onClick={handleAddNote}
                  className="w-full rounded-full h-10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add note
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>

      {/* Note Dialog */}
      <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingNote ? 'Edit Note' : 'Add Note'}</DialogTitle>
            <DialogDescription>
              {editingNote ? 'Update your note' : 'Create a new note for this bid'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Input
                placeholder="Note title"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
              />
            </div>
            <div>
              <Textarea
                placeholder="Note content (optional)"
                value={noteBody}
                onChange={(e) => setNoteBody(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNoteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNote} disabled={!noteTitle.trim()}>
              {editingNote ? 'Update' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}