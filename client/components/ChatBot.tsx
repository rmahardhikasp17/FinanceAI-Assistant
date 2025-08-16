import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send, Bot, User, Loader2, Sparkles, Copy, RefreshCw, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
  onClearPreview?: () => void;
}

export default function ChatBot({ isOpen, onClose, initialMessage, onClearPreview }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Halo! Saya adalah FinanceAI, asisten AI yang khusus membantu pertanyaan seputar keuangan. Silakan tanyakan tentang budgeting, investasi, menabung, atau topik finansial lainnya. Bagaimana saya bisa membantu Anda hari ini?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (initialMessage && isOpen) {
      setInputText(initialMessage);
      onClearPreview?.();
    }
  }, [initialMessage, isOpen, onClearPreview]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputText.trim() }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Maaf, terjadi kesalahan pada sistem. Silakan coba lagi dalam beberapa saat.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      text: 'Chat telah direset. Silakan mulai percakapan baru tentang keuangan!',
      sender: 'bot',
      timestamp: new Date()
    }]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className={cn(
        "w-full max-w-2xl bg-background/95 border-border/50 backdrop-blur-xl transition-all duration-300",
        isMinimized ? "h-16" : "h-[700px]",
        "flex flex-col aurora-glow"
      )}>
        <CardHeader className="aurora-gradient p-4 rounded-t-xl">
          <div className="flex items-center justify-between text-background">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Bot className="h-6 w-6" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              </div>
              <div>
                <h3 className="font-semibold">FinanceAI Assistant</h3>
                <p className="text-xs opacity-90">Khusus membahas topik keuangan</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-background hover:bg-background/20 h-8 w-8"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={clearChat}
                className="text-background hover:bg-background/20 h-8 w-8"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-background hover:bg-background/20 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {!isMinimized && (
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.sender === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] group relative",
                        message.sender === 'user' ? "order-2" : "order-1"
                      )}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        {message.sender === 'bot' ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 aurora-gradient rounded-full flex items-center justify-center">
                              <Bot className="h-3 w-3 text-background" />
                            </div>
                            <span className="text-xs text-muted-foreground font-medium">FinanceAI</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2 ml-auto">
                            <span className="text-xs text-muted-foreground font-medium">Anda</span>
                            <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                              <User className="h-3 w-3" />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div
                        className={cn(
                          "p-4 rounded-2xl text-sm leading-relaxed relative",
                          message.sender === 'user'
                            ? "chat-bubble-gradient text-background rounded-br-sm"
                            : "bg-muted/80 text-foreground rounded-bl-sm"
                        )}
                      >
                        <p className="whitespace-pre-wrap">{message.text}</p>
                        
                        {message.sender === 'bot' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyMessage(message.text)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      
                      <div className={cn(
                        "text-xs text-muted-foreground mt-1",
                        message.sender === 'user' ? "text-right" : "text-left"
                      )}>
                        {message.timestamp.toLocaleTimeString('id-ID', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%]">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 aurora-gradient rounded-full flex items-center justify-center">
                          <Bot className="h-3 w-3 text-background" />
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">FinanceAI</span>
                      </div>
                      <div className="bg-muted/80 p-4 rounded-2xl rounded-bl-sm">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin text-aurora-purple" />
                          <Sparkles className="h-3 w-3 text-aurora-blue animate-pulse" />
                          <span className="text-sm text-muted-foreground">Sedang mengetik...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="p-6 border-t border-border/50">
              <div className="flex space-x-3">
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Tanyakan tentang keuangan..."
                    disabled={isLoading}
                    rows={1}
                    className="w-full bg-input border-border/50 rounded-xl px-4 py-3 pr-12 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-aurora-purple/50 focus:border-aurora-purple/50"
                    style={{ minHeight: '48px', maxHeight: '120px' }}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                    {inputText.length}/500
                  </div>
                </div>
                <Button
                  onClick={sendMessage}
                  disabled={!inputText.trim() || isLoading}
                  size="icon"
                  className="aurora-gradient hover:opacity-90 h-12 w-12 rounded-xl"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-muted-foreground">
                  Tekan Enter untuk mengirim, Shift+Enter untuk baris baru
                </p>
                <div className="flex items-center space-x-1">
                  <Sparkles className="h-3 w-3 text-aurora-purple" />
                  <span className="text-xs text-muted-foreground">Powered by Gemini AI</span>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
