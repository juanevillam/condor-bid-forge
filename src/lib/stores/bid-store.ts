import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Bid, BidActionsData, Source } from '../types';

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
        const id = crypto.randomUUID();
        const newBid: Bid = {
          ...bidData,
          id,
          createdAt: new Date().toISOString(),
          deadlines: [],
          milestones: []
        };
        
        set((state) => ({
          bids: [...state.bids, newBid]
        }));
        
        return id;
      },
      
      updateBid: (id, updates) => {
        set((state) => ({
          bids: state.bids.map((bid) =>
            bid.id === id ? { ...bid, ...updates } : bid
          )
        }));
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
        storeFileBlob(source.id, fileBlob);
        set((state) => ({
          bidSources: {
            ...state.bidSources,
            [bidId]: [...(state.bidSources[bidId] || []), source]
          }
        }));
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