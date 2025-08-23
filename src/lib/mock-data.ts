import type { Bid, Source, ChatMessage, Citation, ActionResult, Milestone } from './types';

export const mockBid: Bid = {
  id: '1',
  title: 'Federal Infrastructure Modernization RFP',
  client: 'Department of Transportation',
  submissionDeadline: '2024-10-15',
  stage: 'discovery',
  createdAt: '2024-08-16',
  deadlines: [
    {
      id: '1',
      title: 'Letter of Intent Due',
      date: '2024-09-01',
      source: 'RFP.pdf',
      page: 3
    },
    {
      id: '2',
      title: 'Technical Proposal Submission',
      date: '2024-10-15',
      source: 'RFP.pdf',
      page: 12
    }
  ],
  milestones: [
    {
      id: "m1",
      label: "Publication",
      date: "2024-08-01T09:00:00Z",
      status: "completed",
      isExtension: false,
      responsible: "Procurement Office",
      deliverables: ["Tender notice", "RFP documents"],
      notes: "Published on time",
    },
    {
      id: "m2",
      label: "Document Acquisition",
      date: "2024-08-15T17:00:00Z",
      status: "completed",
      isExtension: false,
      responsible: "Bidders",
      deliverables: ["Purchase tender documents"],
      notes: "Documents available online",
    },
    {
      id: "m3",
      label: "Mandatory Visit",
      date: "2024-09-10T10:00:00Z",
      status: "in_progress",
      isExtension: false,
      responsible: "Client Site Team",
      deliverables: ["Site inspection", "Q&A session"],
      notes: "Registration required by Sep 8",
    },
    {
      id: "m3-cancel",
      label: "Mandatory Visit (Original Date Canceled)",
      date: "2024-09-05T10:00:00Z",
      status: "canceled",
      isExtension: false,
      responsible: "Client Site Team",
      deliverables: ["Cancellation notice", "New date announcement"],
      notes: "Canceled due to weather; rescheduled to Sep 10.",
    },
    {
      id: "m8",
      label: "Document Acquisition",
      date: "2024-08-20T17:00:00Z",
      status: "extended",
      isExtension: true,
      responsible: "Procurement Office",
      deliverables: ["Extended purchase window notice"],
      notes: "Extension granted due to portal downtime",
    },
    {
      id: "m9",
      label: "Reception of Questions",
      date: "2024-09-20T23:59:00Z",
      status: "completed",
      isExtension: false,
      responsible: "Procurement Office",
      deliverables: ["Question log export"],
      notes: "Received 57 questions total",
    },
    {
      id: "m9-ext",
      label: "Reception of Questions (Extension)",
      date: "2024-09-22T23:59:00Z",
      status: "extended",
      isExtension: true,
      responsible: "Procurement Office",
      deliverables: ["Extension notice", "Updated Q&A cutoff"],
      notes: "Extended by 48 hours due to national holiday",
    },
    {
      id: "m3a",
      label: "First Round of Clarifications",
      date: "2024-09-25T15:00:00Z",
      status: "completed",
      isExtension: false,
      responsible: "Contracting Authority",
      deliverables: ["Clarifications memo #1", "Updated annexes"],
      notes: "Ambiguities on Section 4 resolved",
    },
    {
      id: "m10",
      label: "Publication of Responses",
      date: "2024-10-01T12:00:00Z",
      status: "completed",
      isExtension: false,
      responsible: "Procurement Office",
      deliverables: ["Official Q&A document", "Errata sheet"],
      notes: "Posted to portal and emailed to registered bidders",
    },
    {
      id: "m4",
      label: "Bid Closing and Opening",
      date: "2024-10-15T16:00:00Z",
      status: "completed",
      isExtension: false,
      responsible: "Contracting Authority",
      deliverables: ["Submission register", "Opening minutes"],
      notes: "All submissions received before the deadline",
    },
    {
      id: "m4-delay",
      label: "Bid Closing (Delayed)",
      date: "2024-10-14T16:00:00Z",
      status: "delayed",
      isExtension: false,
      responsible: "Contracting Authority",
      deliverables: ["Revised submission window notice"],
      notes: "Portal downtime caused a 24-hour delay; final opening held Oct 15.",
    },
    {
      id: "m5",
      label: "Submission of Guarantees",
      date: "2024-10-22T17:00:00Z",
      status: "completed",
      isExtension: false,
      responsible: "Bidders",
      deliverables: ["Bid bonds", "Guarantee receipts"],
      notes: "Two bidders requested format clarification",
    },
    {
      id: "m11",
      label: "Notification of Pre-selection",
      date: "2024-11-01T10:00:00Z",
      status: "completed",
      isExtension: false,
      responsible: "Procurement Office",
      deliverables: ["Shortlist notice"],
      notes: "Three bidders advanced to evaluation",
    },
    {
      id: "m12",
      label: "Evaluation of Bids",
      date: "2024-11-10T18:00:00Z",
      status: "completed",
      isExtension: false,
      responsible: "Evaluation Committee",
      deliverables: [
        "Technical scores",
        "Financial scores",
        "Evaluation report",
      ],
      notes: "Weighted scorecard applied (60/40 technical/financial)",
    },
    {
      id: "m6",
      label: "Notification of the Successful Bidder",
      date: "2024-11-20T14:00:00Z",
      status: "completed",
      isExtension: false,
      responsible: "Contracting Authority",
      deliverables: ["Award letter", "Unsuccessful letters"],
      notes: "Standstill period begins",
    },
    {
      id: "m13",
      label: "Contract Signature",
      date: "2024-12-05T11:00:00Z",
      status: "completed",
      isExtension: false,
      responsible: "Legal & Executive Teams",
      deliverables: ["Signed contract", "As-sold package"],
      notes: "Bank guarantees verified prior to signature",
    },
    {
      id: "m7",
      label: "Project Start",
      date: "2025-01-10T09:00:00Z",
      status: "in_progress",
      isExtension: false,
      responsible: "Project Management Office",
      deliverables: ["Kickoff agenda", "Mobilization plan"],
      notes: "Mobilization underway; long-lead items approved",
    },
  ]
};

export const mockBids: Bid[] = [
  {
    id: '1',
    title: 'Federal Infrastructure Modernization RFP',
    client: 'Department of Transportation',
    submissionDeadline: '2024-10-15',
    stage: 'discovery',
    createdAt: '2024-08-16',
    deadlines: [],
    milestones: []
  },
  {
    id: '2',
    title: 'Healthcare System Integration',
    client: 'Regional Medical Center',
    submissionDeadline: '2024-09-30',
    stage: 'proposal',
    createdAt: '2024-08-14',
    deadlines: [],
    milestones: []
  },
  {
    id: '3',
    title: 'Smart City IoT Platform',
    client: 'Metro City Council',
    submissionDeadline: '2024-11-20',
    stage: 'discovery',
    createdAt: '2024-08-12',
    deadlines: [],
    milestones: []
  }
];

export const mockSources: Source[] = [
  {
    id: '1',
    name: 'RFP.pdf',
    type: 'pdf',
    size: '2.4 MB',
    path: 'documents/RFP.pdf',
    labels: ['Legal', 'Commercial'],
    createdAt: '2024-08-16T10:00:00Z'
  },
  {
    id: '2',
    name: 'Technical_Requirements.docx',
    type: 'docx',
    size: '1.2 MB',
    path: 'documents/Technical_Requirements.docx',
    labels: ['Technical', 'Finance'],
    createdAt: '2024-08-16T10:15:00Z'
  },
  {
    id: '3',
    name: 'Project_Specifications.xlsx',
    type: 'xlsx',
    size: '850 KB',
    path: 'documents/specs/Project_Specifications.xlsx',
    labels: ['Technical', 'Admin'],
    createdAt: '2024-08-16T10:20:00Z'
  },
  {
    id: '4',
    name: 'Budget_Analysis.xlsx',
    type: 'xlsx',
    size: '1.1 MB',
    path: 'documents/finance/Budget_Analysis.xlsx',
    labels: ['Finance'],
    createdAt: '2024-08-16T10:25:00Z'
  }
];

export const mockMessages: ChatMessage[] = [
  {
    id: '1',
    type: 'system',
    content: `Welcome to your bid workspace for "${mockBid.title}". I've analyzed your uploaded sources and I'm ready to help you extract key information, generate compliance matrices, and draft proposal content.`,
    timestamp: '2024-08-16T10:30:00Z'
  }
];

export const mockCitations: Citation[] = [
  { source: 'RFP.pdf', page: 3 },
  { source: 'Technical_Requirements.docx', page: 1 }
];

// Mock classification function
const mockClassifyFile = (fileName: string) => {
  const labels = ['Legal', 'Finance', 'Technical', 'Commercial', 'Admin'] as const;
  const selectedLabels = labels
    .filter(() => Math.random() > 0.6)
    .slice(0, 2 + Math.floor(Math.random() * 2));
  
  return { labels: selectedLabels };
};

// Mock API functions
export async function uploadSource(file: File): Promise<Source> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const classification = mockClassifyFile(file.name);
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
      resolve({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.name.split('.').pop() as 'pdf' | 'docx' | 'xlsx' | 'txt',
        size: `${sizeInMB} MB`,
        path: `documents/${file.name}`,
        labels: classification.labels,
        createdAt: new Date().toISOString()
      });
    }, 2000);
  });
}

export async function extractDeadlines(): Promise<ActionResult> {
  return {
    type: 'deadlines',
    title: 'Extracted Key Deadlines',
    content: `Found 5 critical deadlines:
• Letter of Intent: September 1, 2024
• Site Visit Registration: September 15, 2024
• Technical Questions Due: September 20, 2024
• Technical Proposal: October 15, 2024
• Cost Proposal: October 15, 2024`,
    citations: mockCitations
  };
}

export async function generateComplianceMatrix(): Promise<ActionResult> {
  return {
    type: 'compliance',
    title: 'Compliance Matrix Generated',
    content: `Compliance requirements matrix created with 23 technical requirements and 15 administrative requirements. Key areas:
• Technical Specifications (85% coverage identified)
• Security Requirements (12 items)
• Performance Standards (8 metrics)
• Reporting Requirements (quarterly, annual)`,
    citations: mockCitations
  };
}

export async function createChecklists(): Promise<ActionResult> {
  return {
    type: 'checklist',
    title: 'Function-Based Checklists Created',
    content: `Created checklists for 4 key functions:
• Engineering Team (12 deliverables)
• Project Management (8 milestones)
• Quality Assurance (15 checkpoints)
• Business Development (6 requirements)`,
    citations: mockCitations
  };
}

export async function draftLetter(type: 'participation' | 'decline'): Promise<ActionResult> {
  const content = type === 'participation' 
    ? `Draft Letter of Intent for participation prepared including:
• Company qualifications and experience
• Team composition and key personnel
• Technical approach summary
• Past performance references`
    : `Draft decline letter prepared with professional language maintaining future opportunities.`;

  return {
    type: 'letter',
    title: `${type === 'participation' ? 'Participation' : 'Decline'} Letter Draft`,
    content,
    citations: type === 'participation' ? mockCitations : []
  };
}