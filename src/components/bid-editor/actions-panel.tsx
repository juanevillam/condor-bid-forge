import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, CheckSquare, Send, Clock, Grid3X3, Mail, Copy } from "lucide-react";
import { ActionResult, ChatMessage } from "@/lib/types";
import { extractDeadlines, generateComplianceMatrix, createChecklists, draftLetter } from "@/lib/mock-data";

interface ActionsPanelProps {
  onAddMessage?: (message: ChatMessage) => void;
}

export function ActionsPanel({ onAddMessage }: ActionsPanelProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentResult, setCurrentResult] = useState<ActionResult | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleAction = async (actionType: string, actionFn: () => Promise<ActionResult>) => {
    setLoadingAction(actionType);
    
    try {
      const result = await actionFn();
      setCurrentResult(result);
      setIsDialogOpen(true);

      // Add structured message to chat
      const chatMessage: ChatMessage = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'assistant',
        content: `${result.title}\n\n${result.content}`,
        timestamp: new Date().toISOString(),
        citations: result.citations
      };
      onAddMessage?.(chatMessage);
      
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setLoadingAction(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const actionCards = [
    {
      id: 'deadlines',
      title: 'Extract Deadlines',
      description: 'Find and organize all submission deadlines',
      icon: Calendar,
      color: 'text-blue-500',
      action: () => handleAction('deadlines', extractDeadlines)
    },
    {
      id: 'compliance',
      title: 'Compliance Matrix',
      description: 'Generate requirements compliance tracking',
      icon: Grid3X3,
      color: 'text-green-500',
      action: () => handleAction('compliance', generateComplianceMatrix)
    },
    {
      id: 'checklists',
      title: 'Function Checklists',
      description: 'Create team-specific task lists',
      icon: CheckSquare,
      color: 'text-purple-500',
      action: () => handleAction('checklists', createChecklists)
    },
    {
      id: 'participate',
      title: 'Participation Letter',
      description: 'Draft letter of intent to participate',
      icon: Mail,
      color: 'text-orange-500',
      action: () => handleAction('participate', () => draftLetter('participation'))
    },
    {
      id: 'decline',
      title: 'Decline Letter',
      description: 'Draft professional decline letter',
      icon: FileText,
      color: 'text-red-500',
      action: () => handleAction('decline', () => draftLetter('decline'))
    }
  ];

  return (
    <div className="h-full flex flex-col">
      <CardContent className="flex-1">
        <ScrollArea className="h-full">
          <div className="space-y-3">
            {actionCards.map((card) => {
              const Icon = card.icon;
              const isLoading = loadingAction === card.id;
              
              return (
                <Card 
                  key={card.id} 
                  className="p-4 hover:bg-accent/50 transition-colors cursor-pointer group"
                  onClick={card.action}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <Icon className={`w-5 h-5 ${card.color} group-hover:scale-110 transition-transform`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm mb-1">{card.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>
                  
                  {isLoading && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>

      {/* Result Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {currentResult?.type === 'deadlines' && <Calendar className="w-5 h-5" />}
              {currentResult?.type === 'compliance' && <Grid3X3 className="w-5 h-5" />}
              {currentResult?.type === 'checklist' && <CheckSquare className="w-5 h-5" />}
              {currentResult?.type === 'letter' && <Mail className="w-5 h-5" />}
              {currentResult?.title}
            </DialogTitle>
            <DialogDescription>
              Generated from your uploaded sources
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Content */}
            <ScrollArea className="max-h-96">
              <div className="p-4 bg-muted/30 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm font-mono">
                  {currentResult?.content}
                </pre>
              </div>
            </ScrollArea>

            {/* Citations */}
            {currentResult?.citations && currentResult.citations.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2">Sources:</h4>
                <div className="flex flex-wrap gap-2">
                  {currentResult.citations.map((citation, index) => (
                    <Badge key={index} variant="outline" className="citation-chip">
                      <FileText className="w-3 h-3 mr-1" />
                      {citation.source} {citation.page && `p.${citation.page}`}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(currentResult?.content || '')}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button
                size="sm"
                onClick={() => setIsDialogOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}