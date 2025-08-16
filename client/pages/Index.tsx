import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Sparkles, Brain, Zap, Shield, Send, Bot, User, Loader2, Copy, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function Index() {
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
  const [sessionId] = useState(() => 'session_' + Date.now()); // Session ID untuk memory
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const exampleQuestions = [
    "Bagaimana cara membuat budget bulanan yang efektif?",
    "Investasi apa yang cocok untuk pemula?",
    "Tips menabung untuk dana darurat",
    "Cara mengelola hutang dengan bijak"
  ];

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const sendMessage = async (messageText?: string) => {
    const messageToSend = messageText || inputText.trim();
    if (!messageToSend || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageToSend,
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
        body: JSON.stringify({ 
          message: messageToSend,
          sessionId: sessionId,
          conversationHistory: messages
        }),
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

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Aurora Background */}
      <div className="fixed inset-0 aurora-gradient-animated opacity-10 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-br from-aurora-purple/5 via-transparent to-aurora-green/5 pointer-events-none" />
      
      {/* Header */}
      <header className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-8 h-8 aurora-gradient rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-background" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-aurora-green rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold aurora-text">FinanceAI</h1>
              <p className="text-xs text-muted-foreground">AI Assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={clearChat}
              variant="outline"
              size="sm"
              className="border-border/50 hover:border-aurora-purple/50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Chat
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="py-12 px-4">
          <div className="container max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-aurora-purple/10 border border-aurora-purple/20 rounded-full mb-4">
                <Sparkles className="h-4 w-4 text-aurora-purple mr-2" />
                <span className="text-sm text-aurora-purple font-medium">Powered by Google Gemini AI</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                AI Assistant untuk{" "}
                <span className="aurora-text">Keuangan</span>
              </h1>
              
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Dapatkan bantuan cerdas untuk mengelola keuangan personal, budgeting, 
                investasi, dan perencanaan finansial
              </p>
            </div>

            {/* Main Chat Interface */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Chat Area */}
              <div className="lg:col-span-2">
                <Card className="bg-card/50 border-border/50 backdrop-blur-sm aurora-glow h-[600px] flex flex-col">
                  <div className="aurora-gradient p-4 rounded-t-xl">
                    <div className="flex items-center space-x-3 text-background">
                      <div className="relative">
                        <Bot className="h-5 w-5" />
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      </div>
                      <div>
                        <h3 className="font-semibold">FinanceAI Assistant</h3>
                        <p className="text-xs opacity-90">Khusus membahas topik keuangan</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Messages Area */}
                  <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
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
                  
                  {/* Input Area */}
                  <div className="p-4 border-t border-border/50">
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
                        onClick={() => sendMessage()}
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
                </Card>
              </div>

              {/* Sidebar - Quick Actions */}
              <div className="space-y-6">
                <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center">
                      <MessageCircle className="h-4 w-4 mr-2 text-aurora-purple" />
                      Contoh Pertanyaan
                    </h3>
                    <div className="space-y-3">
                      {exampleQuestions.map((question, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          onClick={() => sendMessage(question)}
                          className="w-full text-left h-auto p-3 border-border/50 hover:border-aurora-purple/50 hover:bg-aurora-purple/5 group"
                          disabled={isLoading}
                        >
                          <span className="text-sm">{question}</span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Features */}
                <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Fitur FinanceAI</h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 aurora-gradient rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Shield className="h-4 w-4 text-background" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Khusus Keuangan</h4>
                          <p className="text-xs text-muted-foreground">Fokus 100% pada topik finansial</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 aurora-gradient rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Zap className="h-4 w-4 text-background" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Respon Instan</h4>
                          <p className="text-xs text-muted-foreground">Powered by Google Gemini</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 aurora-gradient rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Brain className="h-4 w-4 text-background" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Mengingat Percakapan</h4>
                          <p className="text-xs text-muted-foreground">AI yang memahami konteks</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-4 border-t border-border/50">
        <div className="container text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 aurora-gradient rounded-lg flex items-center justify-center">
              <Brain className="h-4 w-4 text-background" />
            </div>
            <span className="aurora-text font-semibold">FinanceAI</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2024 FinanceAI. AI Assistant untuk keuangan yang lebih baik.
          </p>
        </div>
      </footer>
    </div>
  );
}
