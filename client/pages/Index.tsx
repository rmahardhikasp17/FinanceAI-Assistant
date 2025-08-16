import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Shield, Zap, TrendingUp, DollarSign, PiggyBank, Calculator, CreditCard } from "lucide-react";
import ChatBot from "@/components/ChatBot";

export default function Index() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">FinanceAI</h1>
          </div>
          <Button 
            onClick={() => setIsChatOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Chat Sekarang
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Asisten <span className="text-blue-600">Keuangan</span> AI Anda
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Dapatkan bantuan cerdas untuk mengelola keuangan personal, budgeting, 
              investasi, dan perencanaan finansial dengan teknologi AI terdepan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => setIsChatOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Mulai Chat Gratis
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 text-lg px-8 py-3"
              >
                Pelajari Lebih Lanjut
              </Button>
            </div>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 animate-bounce">
          <div className="bg-blue-100 p-4 rounded-full">
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="absolute top-32 right-16 animate-pulse">
          <div className="bg-green-100 p-4 rounded-full">
            <PiggyBank className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Mengapa Memilih FinanceAI?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Chatbot AI yang khusus dirancang untuk membantu semua kebutuhan finansial Anda
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Khusus Keuangan</h3>
                <p className="text-gray-600">
                  Fokus 100% pada topik finansial. Tidak akan membahas topik lain di luar keuangan.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Respon Cepat</h3>
                <p className="text-gray-600">
                  Powered by Google Gemini AI untuk memberikan jawaban yang akurat dan cepat.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calculator className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Saran Personal</h3>
                <p className="text-gray-600">
                  Dapatkan saran keuangan yang disesuaikan dengan situasi finansial Anda.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Topik yang Bisa Dibahas
            </h2>
            <p className="text-gray-600">
              Tanyakan apapun seputar keuangan dan finansial
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: PiggyBank, title: "Menabung", desc: "Tips dan strategi menabung" },
              { icon: TrendingUp, title: "Investasi", desc: "Panduan investasi untuk pemula" },
              { icon: Calculator, title: "Budgeting", desc: "Perencanaan anggaran bulanan" },
              { icon: CreditCard, title: "Kredit & Hutang", desc: "Mengelola kredit dengan bijak" }
            ].map((topic, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
                <topic.icon className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">{topic.title}</h3>
                <p className="text-sm text-gray-600">{topic.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Siap Mengelola Keuangan Lebih Baik?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Mulai chat dengan AI assistant finansial sekarang juga
          </p>
          <Button 
            size="lg"
            onClick={() => setIsChatOpen(true)}
            className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-3"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Mulai Chat Sekarang
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <DollarSign className="h-6 w-6 text-blue-400" />
            <span className="text-white font-semibold">FinanceAI</span>
          </div>
          <p className="text-gray-400">
            © 2024 FinanceAI. Asisten keuangan AI terpercaya.
          </p>
        </div>
      </footer>

      {/* ChatBot Component */}
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
