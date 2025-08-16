import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Sparkles, Brain, Zap, Shield, ArrowRight, Send } from "lucide-react";
import ChatBot from "@/components/ChatBot";

export default function Index() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [previewMessage, setPreviewMessage] = useState('');

  const exampleQuestions = [
    "Bagaimana cara membuat budget bulanan yang efektif?",
    "Investasi apa yang cocok untuk pemula?",
    "Tips menabung untuk dana darurat",
    "Cara mengelola hutang dengan bijak"
  ];

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
          <Button 
            onClick={() => setIsChatOpen(true)}
            className="bg-aurora-purple hover:bg-aurora-purple/80 text-white px-6 aurora-glow"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Chat Now
          </Button>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero Section - Chat Interface Style */}
        <section className="py-20 px-4">
          <div className="container max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-aurora-purple/10 border border-aurora-purple/20 rounded-full mb-6">
                <Sparkles className="h-4 w-4 text-aurora-purple mr-2" />
                <span className="text-sm text-aurora-purple font-medium">Powered by Google Gemini AI</span>
              </div>
              
              <h1 className="text-6xl font-bold mb-6">
                AI Assistant untuk{" "}
                <span className="aurora-text">Keuangan</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Dapatkan bantuan cerdas untuk mengelola keuangan personal, budgeting, 
                investasi, dan perencanaan finansial dengan teknologi AI terdepan
              </p>
            </div>

            {/* Chat Preview Interface */}
            <div className="max-w-2xl mx-auto mb-12">
              <Card className="bg-card/50 border-border/50 backdrop-blur-sm aurora-glow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-aurora-green rounded-full animate-pulse" />
                      <span className="text-sm font-medium">FinanceAI Assistant</span>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 bg-aurora-purple/30 rounded-full" />
                      <div className="w-3 h-3 bg-aurora-blue/30 rounded-full" />
                      <div className="w-3 h-3 bg-aurora-green/30 rounded-full" />
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-start">
                      <div className="bg-muted/80 p-3 rounded-2xl rounded-bl-sm max-w-[80%]">
                        <p className="text-sm">
                          Halo! Saya adalah AI assistant keuangan. Silakan tanyakan tentang budgeting, investasi, atau topik finansial lainnya.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Tanyakan seputar keuangan..."
                      value={previewMessage}
                      onChange={(e) => setPreviewMessage(e.target.value)}
                      className="flex-1 bg-input border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-aurora-purple/50"
                    />
                    <Button
                      onClick={() => setIsChatOpen(true)}
                      size="icon"
                      className="aurora-gradient hover:opacity-90 h-12 w-12 rounded-xl"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Start Examples */}
            <div className="grid md:grid-cols-2 gap-4 mb-12">
              {exampleQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => {
                    setPreviewMessage(question);
                    setIsChatOpen(true);
                  }}
                  className="p-4 h-auto text-left border-border/50 hover:border-aurora-purple/50 hover:bg-aurora-purple/5 group"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm">{question}</span>
                    <ArrowRight className="h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:text-aurora-purple transition-all" />
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Mengapa Memilih <span className="aurora-text">FinanceAI</span>?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Pengalaman AI assistant yang dirancang khusus untuk kebutuhan finansial Anda
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-card/50 border-border/50 backdrop-blur-sm hover:aurora-glow transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 aurora-gradient rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-6 w-6 text-background" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Khusus Keuangan</h3>
                  <p className="text-muted-foreground">
                    Fokus 100% pada topik finansial. AI yang terlatih khusus untuk memberikan saran keuangan terbaik.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 border-border/50 backdrop-blur-sm hover:aurora-glow transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 aurora-gradient rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-6 w-6 text-background" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Respon Instan</h3>
                  <p className="text-muted-foreground">
                    Powered by Google Gemini untuk memberikan jawaban yang akurat dan responsif dalam hitungan detik.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 border-border/50 backdrop-blur-sm hover:aurora-glow transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 aurora-gradient rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Brain className="h-6 w-6 text-background" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">AI Cerdas</h3>
                  <p className="text-muted-foreground">
                    Memahami konteks percakapan dan memberikan saran personal sesuai situasi keuangan Anda.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 relative">
          <div className="absolute inset-0 aurora-gradient opacity-5" />
          <div className="container text-center relative z-10">
            <h2 className="text-4xl font-bold mb-6">
              Mulai Percakapan dengan <span className="aurora-text">AI Assistant</span>
            </h2>
            <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">
              Dapatkan bantuan keuangan yang Anda butuhkan. Gratis dan tersedia 24/7.
            </p>
            <Button 
              size="lg"
              onClick={() => setIsChatOpen(true)}
              className="aurora-gradient hover:opacity-90 text-background font-semibold px-8 py-3 text-lg aurora-glow"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Mulai Chat Sekarang
            </Button>
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

      {/* ChatBot Component */}
      <ChatBot 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        initialMessage={previewMessage}
        onClearPreview={() => setPreviewMessage('')}
      />
    </div>
  );
}
