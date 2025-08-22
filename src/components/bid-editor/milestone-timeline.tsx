import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  AlertTriangle,
  XCircle,
  Clock,
  ArrowUpRight,
  Check,
} from "lucide-react";
import { Milestone } from "@/lib/types";
import { format, isAfter, isBefore, addDays, parseISO } from "date-fns";

// Types
type MilestoneStatus = Milestone["status"];

// Status configuration mapping
const STATUS_CONFIG: Record<MilestoneStatus, {
  colors: string;
  extColors: string;
  icon: React.ComponentType<{ className?: string }>;
  ariaLabel: string;
}> = {
  completed: {
    colors: "bg-green-500/15 text-green-500",
    extColors: "bg-green-400 text-green-900",
    icon: Check,
    ariaLabel: "Completed milestone"
  },
  in_progress: {
    colors: "bg-teal-500/15 text-teal-500",
    extColors: "bg-teal-400 text-teal-900",
    icon: Clock,
    ariaLabel: "In progress milestone"
  },
  delayed: {
    colors: "bg-red-500/15 text-red-500",
    extColors: "bg-red-400 text-red-900",
    icon: AlertTriangle,
    ariaLabel: "Delayed milestone"
  },
  canceled: {
    colors: "bg-gray-500/15 text-gray-500",
    extColors: "bg-gray-400 text-gray-900",
    icon: XCircle,
    ariaLabel: "Canceled milestone"
  },
  extended: {
    colors: "bg-amber-500/15 text-amber-500",
    extColors: "bg-amber-400 text-amber-900",
    icon: ArrowUpRight,
    ariaLabel: "Extended milestone"
  }
};

// Helper functions
const sortMilestones = (milestones: Milestone[]): Milestone[] => {
  return [...milestones].sort((a, b) => {
    const dateA = parseISO(a.date);
    const dateB = parseISO(b.date);
    if (dateA.getTime() === dateB.getTime()) {
      return a.label.localeCompare(b.label);
    }
    return dateA.getTime() - dateB.getTime();
  });
};

const getStatusColor = (status: MilestoneStatus): string => {
  return STATUS_CONFIG[status]?.colors || STATUS_CONFIG.canceled.colors;
};

const getExtensionColor = (status: MilestoneStatus): string => {
  return STATUS_CONFIG[status]?.extColors || STATUS_CONFIG.canceled.extColors;
};

const getStatusIcon = (status: MilestoneStatus): React.ReactElement => {
  const IconComponent = STATUS_CONFIG[status]?.icon || Calendar;
  return <IconComponent className="w-3 h-3" />;
};

const getStatusAriaLabel = (status: MilestoneStatus): string => {
  return STATUS_CONFIG[status]?.ariaLabel || "Milestone";
};

const isDueSoon = (milestone: Milestone, today: Date): boolean => {
  if (milestone.status === "completed" || milestone.status === "canceled") {
    return false;
  }
  const milestoneDate = parseISO(milestone.date);
  const sevenDaysFromNow = addDays(today, 7);
  return (
    isBefore(milestoneDate, sevenDaysFromNow) && isAfter(milestoneDate, today)
  );
};

const isOverdue = (milestone: Milestone, today: Date): boolean => {
  if (milestone.status === "completed" || milestone.status === "canceled") {
    return false;
  }
  const milestoneDate = parseISO(milestone.date);
  return isBefore(milestoneDate, today);
};

const getDaysUntilDue = (milestone: Milestone, today: Date): number => {
  const milestoneDate = parseISO(milestone.date);
  const diffTime = milestoneDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const formatDate = (dateString: string): string => {
  try {
    return format(parseISO(dateString), "MMM dd, yyyy");
  } catch {
    return "TBD";
  }
};

const humanizeStatus = (status: MilestoneStatus): string => {
  return status.replace("_", " ");
};

// Component
interface MilestoneTimelineProps {
  milestones: Milestone[];
}

export function MilestoneTimeline({ milestones }: MilestoneTimelineProps) {
  const today = new Date();
  const sortedMilestones = sortMilestones(milestones);

  if (milestones.length === 0) {
    return (
      <Card className="m-4 px-2 py-3">
        <div className="text-center text-muted-foreground">
          <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No timeline configured yet.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="m-4 px-0">
      <ScrollArea className="py-3 w-full">
        <div className="flex px-3 pb-3" style={{ minWidth: "max-content" }}>
          {sortedMilestones.map((milestone, index) => (
            <div key={milestone.id} className="flex items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div 
                          className="relative flex flex-col items-center gap-2 cursor-pointer"
                          role="button"
                          tabIndex={0}
                          aria-label={`${getStatusAriaLabel(milestone.status)}: ${milestone.label}`}
                        >
                          <Badge
                            variant="outline"
                            className={`${getStatusColor(
                              milestone.status
                            )} pl-2 py-1 flex items-center gap-2 text-xs font-medium whitespace-nowrap ${
                              milestone.isExtension ? "pr-1" : "pr-2.5"
                            }`}
                          >
                            {getStatusIcon(milestone.status)}
                            <span
                              className={
                                milestone.status === "canceled"
                                  ? "line-through"
                                  : ""
                              }
                            >
                              {milestone.label}
                            </span>
                            {milestone.isExtension && (
                              <span
                                className={`text-xs px-1 py-0.5 rounded-lg ${getExtensionColor(milestone.status)}`}
                                aria-label="Extension"
                              >
                                Ext.
                              </span>
                            )}
                            {(isDueSoon(milestone, today) || isOverdue(milestone, today)) && (
                              <div 
                                className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full"
                                aria-label="Alert: Due soon or overdue"
                              />
                            )}
                          </Badge>
                          <div className="text-xs text-muted-foreground text-center">
                            {formatDate(milestone.date)}
                          </div>
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80 p-4">
                        <div className="space-y-3">
                          <h4 className="font-semibold">{milestone.label}</h4>
                          <Separator />
                          <div className="space-y-2 text-sm">
                            <p>
                              <span className="font-medium">Date:</span>{" "}
                              {formatDate(milestone.date)}
                            </p>
                            <p>
                              <span className="font-medium">Status:</span>{" "}
                              {humanizeStatus(milestone.status)}
                            </p>
                            <p>
                              <span className="font-medium">Responsible:</span>{" "}
                              {milestone.responsible}
                            </p>
                            {milestone.deliverables.length > 0 && (
                              <div>
                                <p className="font-medium">Deliverables:</p>
                                <ul className="list-disc list-inside ml-2 space-y-1">
                                  {milestone.deliverables.map(
                                    (deliverable, idx) => (
                                      <li
                                        key={idx}
                                        className="text-muted-foreground"
                                      >
                                        {deliverable}
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                            {milestone.notes && (
                              <p>
                                <span className="font-medium">Notes:</span>{" "}
                                {milestone.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isDueSoon(milestone, today) && (
                      <p>Due in {getDaysUntilDue(milestone, today)} days</p>
                    )}
                    {isOverdue(milestone, today) && (
                      <p>
                        Overdue by {Math.abs(getDaysUntilDue(milestone, today))} days
                      </p>
                    )}
                    {!isDueSoon(milestone, today) && !isOverdue(milestone, today) && (
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