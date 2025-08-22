import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  PanelLeftOpen,
  PanelRightOpen,
  Edit3,
  ArrowLeft,
} from "lucide-react";
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

// Helper functions
const getStageColor = (stage: string): string => {
  const stageColors = {
    discovery: "bg-info/20 text-info",
    proposal: "bg-warning/20 text-warning",
    review: "bg-accent text-accent-foreground",
    submitted: "bg-success/20 text-success",
  } as const;
  
  return stageColors[stage as keyof typeof stageColors] || "bg-muted text-muted-foreground";
};

const PANEL_WIDTHS = {
  expanded: "w-80",
  collapsed: "w-14",
} as const;

const HEADER_CLASSES = {
  sticky: "sticky top-16 z-40 glass-effect border-b",
  container: "px-6 py-3",
  content: "flex items-center justify-between",
} as const;

export default function BidEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const { getBid, updateBid, deleteBid } = useBidStore();

  const [bid, setBid] = useState(() => getBid(id!));

  // State management
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [leftPanelOpen, setLeftPanelOpen] = useState(!isMobile);
  const [rightPanelOpen, setRightPanelOpen] = useState(!isMobile);
  const [setupDialogOpen, setSetupDialogOpen] = useState(
    searchParams.get("setup") === "1"
  );

  // Effects
  useEffect(() => {
    if (!bid) {
      navigate("/app");
    }
  }, [bid, navigate]);

  useEffect(() => {
    if (isMobile) {
      setLeftPanelOpen(false);
      setRightPanelOpen(false);
    }
  }, [isMobile]);

  // Event handlers
  const handleTitleSave = (newTitle: string) => {
    if (!bid) return;
    
    updateBid(bid.id, { title: newTitle });
    setBid(getBid(bid.id));
    setIsEditingTitle(false);
  };

  const handleAddMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  const handleSetupComplete = () => {
    setSetupDialogOpen(false);
    setSearchParams((params) => {
      params.delete("setup");
      return params;
    });
    setBid(getBid(id!));
  };

  const handleSetupCancel = () => {
    if (bid && (!bid.title || !bid.client)) {
      deleteBid(bid.id);
      navigate("/app");
    } else {
      setSetupDialogOpen(false);
      setSearchParams((params) => {
        params.delete("setup");
        return params;
      });
    }
  };

  const handleTitleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleTitleSave((e.target as HTMLInputElement).value);
    }
  };

  // Helper components
  const renderSidePanel = (children: React.ReactNode, title: string) => {
    if (!isMobile) return children;

    const isSourcesPanel = title === "Sources";
    
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm">
            {isSourcesPanel ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelRightOpen className="w-4 h-4" />
            )}
          </Button>
        </SheetTrigger>
        <SheetContent
          side={isSourcesPanel ? "left" : "right"}
          className="w-80 p-0"
        >
          {children}
        </SheetContent>
      </Sheet>
    );
  };

  const renderTitleSection = () => (
    <div className="flex items-center gap-3">
      {isEditingTitle ? (
        <Input
          defaultValue={bid?.title}
          onBlur={(e) => handleTitleSave(e.target.value)}
          onKeyPress={handleTitleKeyPress}
          className="text-lg font-semibold bg-transparent border-none p-0 h-auto focus-visible:ring-1"
          autoFocus
        />
      ) : (
        <h1
          className="text-lg font-semibold cursor-pointer hover:text-primary transition-colors"
          onClick={() => setIsEditingTitle(true)}
        >
          {bid?.title}
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
  );

  const renderPanelHeader = (title: string, isLeft: boolean) => {
    const isOpen = isLeft ? leftPanelOpen : rightPanelOpen;
    const setOpen = isLeft ? setLeftPanelOpen : setRightPanelOpen;
    
    return (
      <CardHeader className="py-2 pl-4 pr-2 border-b mb-4">
        <CardTitle className="text-lg flex items-center justify-between">
          {title}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(!isOpen)}
          >
            {isLeft ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelRightOpen className="w-4 h-4" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
    );
  };

  const renderCollapsedPanel = (isLeft: boolean) => {
    const setOpen = isLeft ? setLeftPanelOpen : setRightPanelOpen;
    
    return (
      <div className="h-full flex flex-col items-center py-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setOpen(true)}
        >
          {isLeft ? (
            <PanelLeftOpen className="w-4 h-4" />
          ) : (
            <PanelRightOpen className="w-4 h-4" />
          )}
        </Button>
      </div>
    );
  };

  if (!bid) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Sticky Header with Bid Info */}
      <div className={HEADER_CLASSES.sticky}>
        <div className={HEADER_CLASSES.container}>
          <div className={HEADER_CLASSES.content}>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/app")}
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>

              {renderTitleSection()}
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
                    "Sources"
                  )}
                   {renderSidePanel(
                     <Card className="h-full rounded-none border-0">
                       <ActionsPanel bidId={bid.id} />
                     </Card>,
                     "Actions"
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
      <div className="flex-1 flex min-h-0 mx-4 space-x-4 mb-4">
        {/* Desktop Layout */}
        {!isMobile && (
          <>
            {/* Left Panel - Sources */}
            <Card
              className={`transition-all duration-300 ${
                leftPanelOpen ? PANEL_WIDTHS.expanded : PANEL_WIDTHS.collapsed
              } border-r bg-card`}
            >
              {leftPanelOpen ? (
                <div>
                  {renderPanelHeader("Sources", true)}
                  <SourcesPanel />
                </div>
              ) : (
                renderCollapsedPanel(true)
              )}
            </Card>

            {/* Center Panel - Chat */}
            <Card className="flex-1 min-w-0">
              <ChatPanel messages={messages} onAddMessage={handleAddMessage} />
            </Card>

            {/* Right Panel - Actions */}
            <Card
              className={`transition-all duration-300 ${
                rightPanelOpen ? PANEL_WIDTHS.expanded : PANEL_WIDTHS.collapsed
              } border-l bg-card`}
            >
              {rightPanelOpen ? (
                 <div>
                   {renderPanelHeader("Actions", false)}
                   <ActionsPanel bidId={bid.id} />
                 </div>
              ) : (
                renderCollapsedPanel(false)
              )}
            </Card>
          </>
        )}

        {/* Mobile Layout - Full Width Chat */}
        {isMobile && (
          <div className="flex-1 min-w-0 bg-background">
            <ChatPanel messages={messages} onAddMessage={handleAddMessage} />
          </div>
        )}
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