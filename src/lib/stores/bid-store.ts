import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Bid, BidActionsData, Source } from '../types';
import { mockBid } from '../mock-data';
import { createBidSchema, updateBidSchema } from '../validation/bids';
import { sourceSchema } from '../validation/sources';
import { createNoteSchema, updateNoteSchema } from '../validation/notes';
import { ZodError } from 'zod';

// Validation error handler
const handleValidationError = (error: unknown, operation: string) => {
  if (error instanceof ZodError) {
    console.error(`Validation failed in ${operation}:`, error.errors);
    throw new Error(`Invalid data provided to ${operation}`);
  }
  throw error;
};

interface BidStore {
  bids: Bid[];
  bidSources: Record<string, Source[]>; // bidId -> sources
  addBid: (bid: Omit<Bid, 'id' | 'createdAt' | 'deadlines' | 'milestones' | 'actions'>) => string;
  updateBid: (id: string, updates: Partial<Bid>) => void;
  deleteBid: (id: string) => void;
  getBid: (id: string) => Bid | undefined;
  updateBidActions: (id: string, actions: Partial<BidActionsData>) => void;
  initializeBidActions: (id: string) => void;
  // Source management
  addSourceToBid: (bidId: string, source: Source, fileBlob: Blob) => void;
  removeSourceFromBid: (bidId: string, sourceId: string) => void;
  getBidSources: (bidId: string) => Source[];
  downloadSource: (sourceId: string) => void;
}

// File storage helper functions
const storeFileBlob = (sourceId: string, blob: Blob): void => {
  const reader = new FileReader();
  reader.onload = () => {
    localStorage.setItem(`file_${sourceId}`, reader.result as string);
  };
  reader.readAsDataURL(blob);
};

const getFileBlob = (sourceId: string): Blob | null => {
  const dataUrl = localStorage.getItem(`file_${sourceId}`);
  if (!dataUrl) return null;
  
  const [header, data] = dataUrl.split(',');
  const mime = header.match(/:(.*?);/)?.[1] || 'application/octet-stream';
  const bytes = atob(data);
  const arrayBuffer = new ArrayBuffer(bytes.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  
  for (let i = 0; i < bytes.length; i++) {
    uint8Array[i] = bytes.charCodeAt(i);
  }
  
  return new Blob([arrayBuffer], { type: mime });
};

const removeFileBlob = (sourceId: string): void => {
  localStorage.removeItem(`file_${sourceId}`);
};

export const useBidStore = create<BidStore>()(
  persist(
    (set, get) => ({
      bids: [],
      bidSources: {},
      
      addBid: (bidData) => {
        // Validate input data
        try {
          const validatedData = createBidSchema.parse(bidData);
          const id = crypto.randomUUID();
          const newBid: Bid = {
            title: validatedData.title,
            client: validatedData.client || '',
            submissionDeadline: validatedData.submissionDeadline || '',
            stage: validatedData.stage || 'discovery',
            id,
            createdAt: new Date().toISOString(),
            deadlines: [],
            milestones: mockBid.milestones
          };
          
          set((state) => ({
            bids: [...state.bids, newBid]
          }));
          
          return id;
        } catch (error) {
          handleValidationError(error, 'addBid');
          return '';
        }
      },
      
      updateBid: (id, updates) => {
        // Validate updates
        try {
          const validatedUpdates = updateBidSchema.parse(updates);
          set((state) => ({
            bids: state.bids.map((bid) =>
              bid.id === id ? { ...bid, ...validatedUpdates } : bid
            )
          }));
        } catch (error) {
          handleValidationError(error, 'updateBid');
        }
      },
      
      deleteBid: (id) => {
        set((state) => ({
          bids: state.bids.filter((bid) => bid.id !== id)
        }));
      },
      
      getBid: (id) => {
        return get().bids.find((bid) => bid.id === id);
      },
      
      updateBidActions: (id, actionsUpdate) => {
        // Validate notes if they're being updated
        if (actionsUpdate.notes) {
          try {
            actionsUpdate.notes.forEach(note => {
              createNoteSchema.parse({
                title: note.title,
                body: note.body
              });
            });
          } catch (error) {
            handleValidationError(error, 'updateBidActions');
            return;
          }
        }

        set((state) => ({
          bids: state.bids.map((bid) =>
            bid.id === id 
              ? { 
                  ...bid, 
                  actions: bid.actions 
                    ? { ...bid.actions, ...actionsUpdate }
                    : { 
                        results: [],
                        proposal: {
                          technical: { status: 'not_started' },
                          economic: { status: 'not_started' }
                        },
                        progress: { overall: 0 },
                        stakeholders: [],
                        notes: [],
                        ...actionsUpdate
                      }
                }
              : bid
          )
        }));
      },
      
      initializeBidActions: (id) => {
        const bid = get().getBid(id);
        if (bid && !bid.actions) {
          get().updateBidActions(id, {
            results: [
              "3 critical deadlines identified",
              "Technical requirements reviewed", 
              "Budget estimates pending",
              "Stakeholder alignment needed"
            ],
            proposal: {
              technical: { status: 'not_started' },
              economic: { status: 'not_started' }
            },
            progress: { overall: 25 },
            stakeholders: [
              { id: '1', role: 'Technical Lead', name: 'Sarah Chen', status: 'on_track' },
              { id: '2', role: 'Commercial Manager', name: 'Mike Johnson', status: 'needs_input' },
              { id: '3', role: 'Project Manager', name: 'Lisa Wong', status: 'on_track' }
            ],
            notes: []
          });
        }
      },

      // Source management methods
      addSourceToBid: (bidId, source, fileBlob) => {
        // Validate source data
        try {
          const validatedSource = sourceSchema.parse(source) as Source;
          storeFileBlob(validatedSource.id, fileBlob);
          set((state) => ({
            bidSources: {
              ...state.bidSources,
              [bidId]: [...(state.bidSources[bidId] || []), validatedSource]
            }
          }));
        } catch (error) {
          handleValidationError(error, 'addSourceToBid');
        }
      },

      removeSourceFromBid: (bidId, sourceId) => {
        removeFileBlob(sourceId);
        set((state) => ({
          bidSources: {
            ...state.bidSources,
            [bidId]: (state.bidSources[bidId] || []).filter(s => s.id !== sourceId)
          }
        }));
      },

      getBidSources: (bidId) => {
        return get().bidSources[bidId] || [];
      },

      downloadSource: (sourceId) => {
        const blob = getFileBlob(sourceId);
        if (!blob) return;

        // Find the source to get its name
        const { bidSources } = get();
        let sourceName = 'download';
        
        for (const sources of Object.values(bidSources)) {
          const source = sources.find(s => s.id === sourceId);
          if (source) {
            sourceName = source.name;
            break;
          }
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = sourceName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    }),
    {
      name: 'condor-bids-storage',
    }
  )
);