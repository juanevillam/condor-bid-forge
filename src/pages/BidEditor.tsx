import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { PanelLeftOpen, PanelRightOpen, Edit3, ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/header";
import { SourcesPanel } from "@/components/bid-editor/sources-panel";
import { ChatPanel } from "@/components/bid-editor/chat-panel";
import { ActionsPanel } from "@/components/bid-editor/actions-panel";
import { useIsMobile } from "@/hooks/use-mobile";
import { Bid, ChatMessage } from "@/lib/types";
import { mockBid, mockMessages } from "@/lib/mock-data";

export default function BidEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [bid, setBid] = useState<Bid>(mockBid);
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [leftPanelOpen, setLeftPanelOpen] = useState(!isMobile);
  const [rightPanelOpen, setRightPanelOpen] = useState(!isMobile);

  useEffect(() => {
    // On mobile, panels should be closed by default
    if (isMobile) {
      setLeftPanelOpen(false);
      setRightPanelOpen(false);
    }
  }, [isMobile]);

  const handleTitleSave = (newTitle: string) => {
    setBid(prev => ({ ...prev, title: newTitle }));
    setIsEditingTitle(false);
  };

  const handleAddMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'discovery': return 'bg-blue-500/20 text-blue-400';
      case 'proposal': return 'bg-orange-500/20 text-orange-400';
      case 'review': return 'bg-purple-500/20 text-purple-400';
      case 'submitted': return 'bg-green-500/20 text-green-400';
      default: return 'bg-muted';
    }
  };

  const renderSidePanel = (children: React.ReactNode, title: string) => {
    if (isMobile) {
      return (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm">
              {title === 'Sources' ? <PanelLeftOpen className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
            </Button>
          </SheetTrigger>
          <SheetContent 
            side={title === 'Sources' ? 'left' : 'right'} 
            className="w-80 p-0"
          >
            {children}
          </SheetContent>
        </Sheet>
      );
    }

    return children;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Sticky Header with Bid Info */}
      <div className="sticky top-16 z-40 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/bids/new')}
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              
              <div className="flex items-center gap-3">
                {isEditingTitle ? (
                  <Input
                    defaultValue={bid.title}
                    onBlur={(e) => handleTitleSave(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleTitleSave((e.target as HTMLInputElement).value)}
                    className="text-lg font-semibold bg-transparent border-none p-0 h-auto focus-visible:ring-1"
                    autoFocus
                  />
                ) : (
                  <h1 
                    className="text-lg font-semibold cursor-pointer hover:text-primary transition-colors"
                    onClick={() => setIsEditingTitle(true)}
                  >
                    {bid.title}
                  </h1>
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsEditingTitle(true)}
                  className="p-1"
                >
                  <Edit3 className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className={getStageColor(bid.stage)}>
                {bid.stage}
              </Badge>
              
              {isMobile && (
                <div className="flex gap-1">
                  {renderSidePanel(
                    <Card className="h-full rounded-none border-0">
                      <SourcesPanel />
                    </Card>,
                    'Sources'
                  )}
                  {renderSidePanel(
                    <Card className="h-full rounded-none border-0">
                      <ActionsPanel onAddMessage={handleAddMessage} />
                    </Card>,
                    'Actions'
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Desktop Layout */}
        {!isMobile && (
          <>
            {/* Left Panel - Sources */}
            <div className={`transition-all duration-300 ${leftPanelOpen ? 'w-80' : 'w-12'} border-r border-border bg-card`}>
              {leftPanelOpen ? (
                <div className="h-full">
                  <div className="p-2 border-b border-border flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setLeftPanelOpen(false)}
                    >
                      <PanelLeftOpen className="w-4 h-4" />
                    </Button>
                  </div>
                  <SourcesPanel />
                </div>
              ) : (
                <div className="h-full flex flex-col items-center py-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setLeftPanelOpen(true)}
                    className="p-2"
                  >
                    <PanelLeftOpen className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Center Panel - Chat */}
            <div className="flex-1 min-w-0 bg-background">
              <ChatPanel 
                messages={messages}
                onAddMessage={handleAddMessage}
              />
            </div>

            {/* Right Panel - Actions */}
            <div className={`transition-all duration-300 ${rightPanelOpen ? 'w-80' : 'w-12'} border-l border-border bg-card`}>
              {rightPanelOpen ? (
                <div className="h-full">
                  <div className="p-2 border-b border-border flex justify-start">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setRightPanelOpen(false)}
                    >
                      <PanelRightOpen className="w-4 h-4" />
                    </Button>
                  </div>
                  <ActionsPanel onAddMessage={handleAddMessage} />
                </div>
              ) : (
                <div className="h-full flex flex-col items-center py-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setRightPanelOpen(true)}
                    className="p-2"
                  >
                    <PanelRightOpen className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Mobile Layout - Full Width Chat */}
        {isMobile && (
          <div className="flex-1 min-w-0 bg-background">
            <ChatPanel 
              messages={messages}
              onAddMessage={handleAddMessage}
            />
          </div>
        )}
      </div>
    </div>
  );
}