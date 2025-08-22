import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Bell, CheckCircle, AlertTriangle, XCircle, Clock, ArrowUpRight } from "lucide-react";
import { Milestone } from "@/lib/types";
import { format, isAfter, isBefore, addDays, parseISO } from "date-fns";

interface MilestoneTimelineProps {
  milestones: Milestone[];
}

export function MilestoneTimeline({ milestones }: MilestoneTimelineProps) {
  const today = new Date();
  
  // Sort milestones by date, then by label
  const sortedMilestones = [...milestones].sort((a, b) => {
    const dateA = parseISO(a.date);
    const dateB = parseISO(b.date);
    if (dateA.getTime() === dateB.getTime()) {
      return a.label.localeCompare(b.label);
    }
    return dateA.getTime() - dateB.getTime();
  });

  const getStatusColor = (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-white';
      case 'in_progress':
        return 'bg-info text-white';
      case 'delayed':
        return 'bg-destructive text-destructive-foreground';
      case 'canceled':
        return 'bg-muted text-muted-foreground line-through';
      case 'extended':
        return 'bg-warning text-black';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-3 h-3" />;
      case 'in_progress':
        return <Clock className="w-3 h-3" />;
      case 'delayed':
        return <AlertTriangle className="w-3 h-3" />;
      case 'canceled':
        return <XCircle className="w-3 h-3" />;
      case 'extended':
        return <ArrowUpRight className="w-3 h-3" />;
      default:
        return <Calendar className="w-3 h-3" />;
    }
  };

  const isDueSoon = (milestone: Milestone) => {
    if (milestone.status === 'completed' || milestone.status === 'canceled') {
      return false;
    }
    const milestoneDate = parseISO(milestone.date);
    const sevenDaysFromNow = addDays(today, 7);
    return isBefore(milestoneDate, sevenDaysFromNow) && isAfter(milestoneDate, today);
  };

  const isOverdue = (milestone: Milestone) => {
    if (milestone.status === 'completed' || milestone.status === 'canceled') {
      return false;
    }
    const milestoneDate = parseISO(milestone.date);
    return isBefore(milestoneDate, today);
  };

  const getDaysUntilDue = (milestone: Milestone) => {
    const milestoneDate = parseISO(milestone.date);
    const diffTime = milestoneDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch {
      return 'TBD';
    }
  };

  if (milestones.length === 0) {
    return (
      <Card className="mx-6 mb-4 p-4">
        <div className="text-center text-muted-foreground">
          <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No timeline configured yet.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="mx-6 mb-4 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground">Project Timeline</h3>
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-success"></div>
            <span className="text-muted-foreground">Completed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-info"></div>
            <span className="text-muted-foreground">In Progress</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-warning"></div>
            <span className="text-muted-foreground">Extended</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-destructive"></div>
            <span className="text-muted-foreground">Delayed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-muted"></div>
            <span className="text-muted-foreground">Canceled</span>
          </div>
        </div>
      </div>
      
      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-2" style={{ minWidth: 'max-content' }}>
          {sortedMilestones.map((milestone, index) => (
            <div key={milestone.id} className="flex items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div className="relative flex flex-col items-center gap-2 min-w-[140px] cursor-pointer">
                          <Badge
                            variant="outline"
                            className={`${getStatusColor(milestone.status)} px-3 py-1 flex items-center gap-2 text-xs font-medium whitespace-nowrap`}
                          >
                            {getStatusIcon(milestone.status)}
                            <span className={milestone.status === 'canceled' ? 'line-through' : ''}>
                              {milestone.label}
                            </span>
                            {milestone.isExtension && (
                              <span className="text-xs bg-warning/20 text-warning px-1 py-0.5 rounded">
                                Ext.
                              </span>
                            )}
                            {(isDueSoon(milestone) || isOverdue(milestone)) && (
                              <Bell className="w-3 h-3 text-warning" />
                            )}
                          </Badge>
                          <div className="text-xs text-muted-foreground text-center">
                            {formatDate(milestone.date)}
                          </div>
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80 p-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(milestone.status)}
                            <h4 className="font-semibold">{milestone.label}</h4>
                          </div>
                          <div className="space-y-2 text-sm">
                            <p><span className="font-medium">Date:</span> {formatDate(milestone.date)}</p>
                            <p><span className="font-medium">Status:</span> {milestone.status.replace('_', ' ')}</p>
                            <p><span className="font-medium">Responsible:</span> {milestone.responsible}</p>
                            {milestone.deliverables.length > 0 && (
                              <div>
                                <p className="font-medium">Deliverables:</p>
                                <ul className="list-disc list-inside ml-2 space-y-1">
                                  {milestone.deliverables.map((deliverable, idx) => (
                                    <li key={idx} className="text-muted-foreground">{deliverable}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {milestone.notes && (
                              <p><span className="font-medium">Notes:</span> {milestone.notes}</p>
                            )}
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isDueSoon(milestone) && (
                      <p>Due in {getDaysUntilDue(milestone)} days</p>
                    )}
                    {isOverdue(milestone) && (
                      <p>Overdue by {Math.abs(getDaysUntilDue(milestone))} days</p>
                    )}
                    {!isDueSoon(milestone) && !isOverdue(milestone) && (
                      <p>Click for details</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              {index < sortedMilestones.length - 1 && (
                <Separator orientation="horizontal" className="w-8 mx-2" />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}