import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Bid } from '../types';

interface BidStore {
  bids: Bid[];
  addBid: (bid: Omit<Bid, 'id' | 'createdAt' | 'deadlines'>) => string;
  updateBid: (id: string, updates: Partial<Bid>) => void;
  deleteBid: (id: string) => void;
  getBid: (id: string) => Bid | undefined;
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
          deadlines: []
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
      }
    }),
    {
      name: 'condor-bids-storage',
    }
  )
);