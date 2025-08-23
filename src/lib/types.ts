export interface Bid {
  id: string;
  title: string;
  client: string;
  submissionDeadline: string;
  stage: 'discovery' | 'proposal' | 'review' | 'submitted';
  createdAt: string;
  deadlines: Deadline[];
  milestones: Milestone[];
  actions?: BidActionsData;
}

export interface Deadline {
  id: string;
  title: string;
  date: string;
  source: string;
  page?: number;
}

export interface Source {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'xlsx' | 'txt' | 'note' | 'custom';
  size: string;
  path?: string;
  labels?: string[];
  createdAt: string;
  isNote?: true;
  dataUrl?: string; // for persisted note-sources
}

export interface ClassificationLabel {
  id: string;
  name: 'Legal' | 'Finance' | 'Technical' | 'Commercial' | 'Admin';
  confidence: number;
}

export interface ClassifiedParagraph {
  id: string;
  text: string;
  labels: ClassificationLabel[];
  page?: number;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  citations?: Citation[];
}

export interface Citation {
  source: string;
  page?: number;
  text?: string;
}

export interface ActionResult {
  type: 'deadlines' | 'compliance' | 'checklist' | 'letter';
  title: string;
  content: string;
  citations: Citation[];
}

export interface Milestone {
  id: string;
  label: string;
  date: string; // ISO date
  status: 'completed' | 'in_progress' | 'delayed' | 'canceled' | 'extended';
  isExtension: boolean;
  responsible: string;
  deliverables: string[];
  notes?: string;
}

export type ProposalStatus = 'not_started' | 'draft' | 'in_review' | 'final';

export interface BidActionsData {
  results: string[]; // small bullet items (mock)
  proposal: {
    technical: { status: ProposalStatus; owner?: string; updatedAt?: string };
    economic: { status: ProposalStatus; owner?: string; updatedAt?: string };
  };
  progress: { overall: number }; // 0–100
  stakeholders: Array<{ id: string; role: string; name: string; status: 'on_track' | 'needs_input' }>;
  notes: Array<{ id: string; title: string; body?: string; createdAt: string; updatedAt?: string }>;
}