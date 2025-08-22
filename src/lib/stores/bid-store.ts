import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Bid, BidActionsData } from '../types';

interface BidStore {
  bids: Bid[];
  addBid: (bid: Omit<Bid, 'id' | 'createdAt' | 'deadlines' | 'milestones' | 'actions'>) => string;
  updateBid: (id: string, updates: Partial<Bid>) => void;
  deleteBid: (id: string) => void;
  getBid: (id: string) => Bid | undefined;
  updateBidActions: (id: string, actions: Partial<BidActionsData>) => void;
  initializeBidActions: (id: string) => void;
}

export const useBidStore = create<BidStore>()(
  persist(
    (set, get) => ({
      bids: [],
      
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
      }
    }),
    {
      name: 'condor-bids-storage',
    }
  )
);