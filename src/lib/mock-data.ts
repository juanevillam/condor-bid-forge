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
      id: 'm1',
      label: 'Publication',
      date: '2024-08-01T09:00:00Z',
      status: 'completed',
      isExtension: false,
      responsible: 'Procurement Office',
      deliverables: ['Tender notice', 'RFP documents'],
      notes: 'Published on time'
    },
    {
      id: 'm2',
      label: 'Document Acquisition',
      date: '2024-08-15T17:00:00Z',
      status: 'completed',
      isExtension: false,
      responsible: 'Bidders',
      deliverables: ['Purchase tender documents'],
      notes: 'Documents available online'
    },
    {
      id: 'm3',
      label: 'Mandatory Visit',
      date: '2024-09-10T10:00:00Z',
      status: 'in_progress',
      isExtension: false,
      responsible: 'Client Site Team',
      deliverables: ['Site inspection', 'Q&A session'],
      notes: 'Registration required by Sep 8'
    }
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
    size: 2400000,
    uploadedAt: '2024-08-16T10:00:00Z',
    status: 'ready',
    labels: [
      { id: 'l1', name: 'Legal', confidence: 0.85 },
      { id: 'l2', name: 'Commercial', confidence: 0.72 }
    ],
    paragraphs: [
      {
        id: 'p1',
        text: 'All submissions must comply with federal procurement regulations...',
        labels: [{ id: 'l1', name: 'Legal', confidence: 0.85 }],
        page: 1
      },
      {
        id: 'p2',
        text: 'The total contract value is estimated at $2.5M over 3 years...',
        labels: [{ id: 'l2', name: 'Commercial', confidence: 0.72 }],
        page: 2
      }
    ]
  },
  {
    id: '2',
    name: 'Technical_Requirements.docx',
    type: 'docx',
    size: 1200000,
    uploadedAt: '2024-08-16T10:15:00Z',
    status: 'ready',
    labels: [
      { id: 'l3', name: 'Technical', confidence: 0.95 },
      { id: 'l4', name: 'Finance', confidence: 0.68 }
    ],
    paragraphs: [
      {
        id: 'p3',
        text: 'System must support 99.9% uptime with automatic failover...',
        labels: [{ id: 'l3', name: 'Technical', confidence: 0.95 }],
        page: 1
      },
      {
        id: 'p4',
        text: 'Budget allocation for hardware procurement is $500K...',
        labels: [{ id: 'l4', name: 'Finance', confidence: 0.68 }],
        page: 3
      }
    ]
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
    .slice(0, 2 + Math.floor(Math.random() * 2))
    .map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name,
      confidence: 0.6 + Math.random() * 0.4
    }));
  
  const paragraphs = Array.from({ length: 2 + Math.floor(Math.random() * 3) }, (_, i) => ({
    id: Math.random().toString(36).substr(2, 9),
    text: `Sample paragraph ${i + 1} from ${fileName}...`,
    labels: selectedLabels.slice(0, 1 + Math.floor(Math.random() * selectedLabels.length)),
    page: 1 + Math.floor(Math.random() * 5)
  }));

  return { labels: selectedLabels, paragraphs };
};

// Mock API functions
export async function uploadSource(file: File): Promise<Source> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const classification = mockClassifyFile(file.name);
      resolve({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.name.split('.').pop() as 'pdf' | 'docx' | 'xlsx' | 'txt',
        size: file.size,
        uploadedAt: new Date().toISOString(),
        status: 'ready',
        ...classification
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