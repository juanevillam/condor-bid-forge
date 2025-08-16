import { Bid, Source, ChatMessage, ActionResult, Citation } from './types';

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
  ]
};

export const mockSources: Source[] = [
  {
    id: '1',
    name: 'RFP.pdf',
    type: 'pdf',
    size: 2400000,
    uploadedAt: '2024-08-16T10:00:00Z',
    status: 'ready'
  },
  {
    id: '2',
    name: 'Technical_Requirements.docx',
    type: 'docx',
    size: 1200000,
    uploadedAt: '2024-08-16T10:15:00Z',
    status: 'ready'
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

// Mock API functions
export async function uploadSource(file: File): Promise<Source> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.name.split('.').pop() as 'pdf' | 'docx' | 'xlsx' | 'txt',
        size: file.size,
        uploadedAt: new Date().toISOString(),
        status: 'ready'
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