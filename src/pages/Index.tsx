import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, Clock, Target } from "lucide-react";
import { Header } from "@/components/layout/header";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-6xl mx-auto py-12 px-6">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Welcome to Condor AI
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Intelligent bid management powered by AI. Analyze RFPs, extract requirements, 
            and generate compliant proposals faster than ever before.
          </p>
          
          <Button 
            size="lg"
            onClick={() => navigate('/bids/new')}
            className="bg-gradient-primary hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Bid
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 hover:shadow-elegant transition-shadow duration-300">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Document Analysis</CardTitle>
              <CardDescription>
                Upload RFPs, requirements docs, and source materials for instant AI analysis
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="p-6 hover:shadow-elegant transition-shadow duration-300">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Deadline Tracking</CardTitle>
              <CardDescription>
                Automatically extract and track all submission deadlines and milestones
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="p-6 hover:shadow-elegant transition-shadow duration-300">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Compliance Matrix</CardTitle>
              <CardDescription>
                Generate requirement matrices and team-specific checklists automatically
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Getting Started */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Ready to get started?</CardTitle>
            <CardDescription>
              Create your first bid workspace and start analyzing documents with AI assistance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
              onClick={() => navigate('/bids/new')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Bid
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;
