export interface Bid {
  id: string;
  title: string;
  client: string;
  submissionDeadline: string;
  stage: 'discovery' | 'proposal' | 'review' | 'submitted';
  createdAt: string;
  deadlines: Deadline[];
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
  type: 'pdf' | 'docx' | 'xlsx' | 'txt';
  size: number;
  uploadedAt: string;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  progress?: number;
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