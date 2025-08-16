import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, FileText, MoreVertical, Folder } from "lucide-react";
import { Header } from "@/components/layout/header";
import { useBidStore } from "@/lib/stores/bid-store";
import type { Bid } from "@/lib/types";

const Index = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<'recent' | 'title'>('recent');
  const { bids, deleteBid } = useBidStore();
  
  const sortedBids = [...bids].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return a.title.localeCompare(b.title);
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getSourceCount = (bid: Bid) => {
    // Mock source count - in real app this would come from the bid data
    return Math.floor(Math.random() * 5);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-6xl mx-auto py-8 px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-foreground">
            {bids.length === 0 ? "Welcome to Bid Proponent" : "My bids"}
          </h1>
          
          {bids.length > 0 && (
            <Select value={sortBy} onValueChange={(value: 'recent' | 'title') => setSortBy(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most recent</SelectItem>
                <SelectItem value="title">By title</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {bids.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Folder className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No bids yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Get started by creating your first bid workspace to organize your proposal documents and deadlines.
            </p>
            <Button onClick={() => navigate('/bids/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Create your first bid
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Create New Bid Card */}
            <Card 
              className="h-48 border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer group"
              onClick={() => navigate('/bids/new')}
            >
              <CardContent className="flex flex-col items-center justify-center h-full p-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <Plus className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  Create new bid
                </span>
              </CardContent>
            </Card>

            {/* Existing Bids */}
            {sortedBids.map((bid) => (
              <Card 
                key={bid.id}
                className="h-48 hover:shadow-elegant transition-shadow duration-300 cursor-pointer group"
                onClick={() => navigate(`/bids/${bid.id}/edit`)}
              >
                <CardContent className="p-4 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-12 bg-gradient-primary rounded-sm flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteBid(bid.id);
                          }}
                        >
                          Delete bid
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                      {bid.title}
                    </h3>
                    
                    <div className="mt-auto">
                      <p className="text-xs text-muted-foreground">
                        {formatDate(bid.createdAt)} • {getSourceCount(bid)} sources
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
