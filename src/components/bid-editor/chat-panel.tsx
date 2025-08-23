import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, FileText } from "lucide-react";
import { ChatMessage, Citation } from "@/lib/types";
import { mockMessages } from "@/lib/mock-data";

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage?: (message: string) => void;
  onAddMessage?: (message: ChatMessage) => void;
}

export function ChatPanel({ messages = mockMessages, onSendMessage, onAddMessage }: ChatPanelProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'user',
      content: inputValue,
      timestamp: new Date().toISOString()
    };

    onAddMessage?.(userMessage);
    onSendMessage?.(inputValue);
    setInputValue("");

    // Mock AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'assistant',
        content: "I understand your request. Let me analyze the documents and provide you with the relevant information. Based on the sources you've uploaded, I can help extract key deadlines, requirements, and generate the necessary documentation.",
        timestamp: new Date().toISOString(),
        citations: [
          { source: 'RFP.pdf', page: 3 },
          { source: 'Technical_Requirements.docx', page: 1 }
        ]
      };
      onAddMessage?.(aiMessage);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderCitations = (citations?: Citation[]) => {
    if (!citations || citations.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {citations.map((citation, index) => (
          <Badge key={index} variant="outline" className="citation-chip text-xs">
            <FileText className="w-3 h-3 mr-1" />
            {citation.source} {citation.page && `p.${citation.page}`}
          </Badge>
        ))}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Messages Area */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full px-4">
          <div className="space-y-4 py-4">
            {messages.map((message) => (
              <div key={message.id} className="flex gap-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {message.type === 'assistant' ? (
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                  ) : message.type === 'user' ? (
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-info/20 rounded-lg flex items-center justify-center">
                      <Bot className="w-4 h-4 text-info" />
                    </div>
                  )}
                </div>

                {/* Message Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">
                      {message.type === 'assistant' ? 'Condor AI' : 
                       message.type === 'user' ? 'You' : 'System'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  
                  <Card className={`p-3 ${
                    message.type === 'user' ? 'bg-primary text-primary-foreground ml-8' :
                    message.type === 'system' ? 'bg-info/10 border-info/20' :
                    'bg-card'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    {renderCitations(message.citations)}
                  </Card>
                </div>
              </div>
            ))}

            {messages.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Ready to assist</p>
                <p className="text-sm">Ask me about your bid documents, deadlines, or requirements.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4">
        <div className="flex gap-2">
          <Textarea
            placeholder="Ask about deadlines, requirements, or request document analysis..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 min-h-[44px] max-h-32 resize-none"
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            size="sm"
            className="px-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}