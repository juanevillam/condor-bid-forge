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
        return 'bg-green-500/15 text-green-700';
      case 'in_progress':
        return 'bg-blue-500/15 text-blue-700';
      case 'delayed':
        return 'bg-red-500/15 text-red-700';
      case 'canceled':
        return 'bg-gray-500/15 text-gray-500 line-through';
      case 'extended':
        return 'bg-amber-500/15 text-amber-700';
      default:
        return 'bg-gray-500/15 text-gray-600';
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
      <Card className="m-4 py-3">
        <div className="text-center text-muted-foreground">
          <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No timeline configured yet.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="m-4 py-3">
      <ScrollArea className="w-full">
        <div className="flex" style={{ minWidth: 'max-content' }}>
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
                              <span className={`text-xs px-1 py-0.5 rounded ${
                                milestone.status === 'completed' ? 'bg-green-100 text-green-700' :
                                milestone.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                milestone.status === 'delayed' ? 'bg-red-100 text-red-700' :
                                milestone.status === 'extended' ? 'bg-amber-100 text-amber-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                Ext.
                              </span>
                            )}
                            {(isDueSoon(milestone) || isOverdue(milestone)) && (
                              <div className="relative">
                                <Bell className="w-3 h-3 bg-gray-700 text-white rounded-sm p-0.5" />
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                              </div>
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