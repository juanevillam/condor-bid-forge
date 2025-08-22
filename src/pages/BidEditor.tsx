import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
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
import { BidSetupDialog } from "@/components/bid-editor/bid-setup-dialog";
import { MilestoneTimeline } from "@/components/bid-editor/milestone-timeline";
import { useIsMobile } from "@/hooks/use-mobile";
import { useBidStore } from "@/lib/stores/bid-store";
import { Bid, ChatMessage } from "@/lib/types";
import { mockMessages } from "@/lib/mock-data";

export default function BidEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const { getBid, updateBid, deleteBid } = useBidStore();
  
  const [bid, setBid] = useState(() => getBid(id!));
  
  // Redirect if bid not found
  useEffect(() => {
    if (!bid) {
      navigate('/app');
    }
  }, [bid, navigate]);
  
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [leftPanelOpen, setLeftPanelOpen] = useState(!isMobile);
  const [rightPanelOpen, setRightPanelOpen] = useState(!isMobile);
  const [setupDialogOpen, setSetupDialogOpen] = useState(searchParams.get('setup') === '1');

  useEffect(() => {
    // On mobile, panels should be closed by default
    if (isMobile) {
      setLeftPanelOpen(false);
      setRightPanelOpen(false);
    }
  }, [isMobile]);

  const handleTitleSave = (newTitle: string) => {
    if (bid) {
      updateBid(bid.id, { title: newTitle });
      setBid(getBid(bid.id));
      setIsEditingTitle(false);
    }
  };

  const handleAddMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const handleSetupComplete = () => {
    setSetupDialogOpen(false);
    // Remove the setup parameter from URL
    setSearchParams(params => {
      params.delete('setup');
      return params;
    });
    // Refresh bid data
    setBid(getBid(id!));
  };

  const handleSetupCancel = () => {
    // If the bid is empty/new, delete it and go back to home
    if (bid && (!bid.title || !bid.client)) {
      deleteBid(bid.id);
      navigate('/app');
    } else {
      setSetupDialogOpen(false);
      // Remove the setup parameter from URL
      setSearchParams(params => {
        params.delete('setup');
        return params;
      });
    }
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

  if (!bid) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Container with outer gutters */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col">
        {/* Sticky Header with Bid Info */}
        <div className="sticky top-16 z-40 bg-card/80 backdrop-blur-sm border-b border-border -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/app')}
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

        {/* Milestone Timeline */}
        <MilestoneTimeline milestones={bid.milestones || []} />

        {/* Main Content */}
        <div className="flex-1 min-h-0">
          {/* Desktop Layout - 3 Column Grid */}
          {!isMobile && (
            <div className={`grid h-full gap-4 lg:gap-6 transition-all duration-300 ${
              leftPanelOpen && rightPanelOpen 
                ? 'grid-cols-[minmax(260px,320px)_1fr_minmax(280px,340px)]'
                : leftPanelOpen 
                  ? 'grid-cols-[minmax(260px,320px)_1fr_48px]'
                  : rightPanelOpen
                    ? 'grid-cols-[48px_1fr_minmax(280px,340px)]'
                    : 'grid-cols-[48px_1fr_48px]'
            }`}>
              {/* Left Panel - Sources */}
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                {leftPanelOpen ? (
                  <div className="h-full flex flex-col">
                    <div className="p-2 border-b border-border flex justify-end shrink-0">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setLeftPanelOpen(false)}
                      >
                        <PanelLeftOpen className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      <SourcesPanel />
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-start py-4">
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
              <div className="bg-background rounded-lg overflow-hidden">
                <ChatPanel 
                  messages={messages}
                  onAddMessage={handleAddMessage}
                />
              </div>

              {/* Right Panel - Actions */}
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                {rightPanelOpen ? (
                  <div className="h-full flex flex-col">
                    <div className="p-2 border-b border-border flex justify-start shrink-0">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setRightPanelOpen(false)}
                      >
                        <PanelRightOpen className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      <ActionsPanel onAddMessage={handleAddMessage} />
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-start py-4">
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
            </div>
          )}

          {/* Mobile Layout - Full Width Chat */}
          {isMobile && (
            <div className="h-full bg-background rounded-lg overflow-hidden">
              <ChatPanel 
                messages={messages}
                onAddMessage={handleAddMessage}
              />
            </div>
          )}
        </div>
      </div>

      {/* Setup Dialog */}
      {bid && (
        <BidSetupDialog
          bid={bid}
          open={setupDialogOpen}
          onOpenChange={setSetupDialogOpen}
          onComplete={handleSetupComplete}
          onCancel={handleSetupCancel}
        />
      )}
    </div>
  );
}