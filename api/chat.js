// Vercel API function for chat endpoint
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, sessionId, conversationHistory } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Finance-related keywords for filtering
    const financeKeywords = [
      'keuangan', 'uang', 'dana', 'investasi', 'saham', 'obligasi', 'reksadana',
      'menabung', 'tabungan', 'deposito', 'kredit', 'hutang', 'cicilan', 'bunga',
      'anggaran', 'budget', 'budgeting', 'pengeluaran', 'pemasukan', 'gaji',
      'bisnis', 'usaha', 'profit', 'keuntungan', 'modal', 'finansial', 'ekonomi',
      'pajak', 'asuransi', 'pensiun', 'dana darurat', 'cash flow', 'properti',
      'emas', 'cryptocurrency', 'crypto', 'bitcoin', 'trading', 'forex',
      'bank', 'atm', 'kartu kredit', 'pinjaman', 'mortgage', 'kpr',
      'financial', 'money', 'finance', 'saving', 'investment', 'budget',
      'debt', 'credit', 'loan', 'insurance', 'retirement', 'pension'
    ];

    // Check if the message is finance-related
    function isFinanceRelated(message) {
      const lowerMessage = message.toLowerCase();
      return financeKeywords.some(keyword => lowerMessage.includes(keyword.toLowerCase()));
    }

    // Check if message is finance-related
    if (!isFinanceRelated(message)) {
      return res.json({
        response: "Maaf, saya hanya bisa membantu pertanyaan seputar keuangan."
      });
    }

    // System prompt to ensure finance-only responses
    const systemPrompt = `Anda adalah FinanceAI, asisten AI keuangan yang hanya membahas topik seputar keuangan dan finansial. 

Sebagai FinanceAI, Anda memiliki kemampuan untuk:
- Mengingat percakapan sebelumnya dalam sesi yang sama
- Memberikan jawaban yang berkesinambungan dan kontekstual
- Merujuk kembali ke informasi yang telah dibahas sebelumnya

Topik yang boleh dibahas:
- Keuangan personal dan budgeting
- Investasi (saham, obligasi, reksadana, properti, emas, crypto)
- Menabung dan dana darurat
- Manajemen hutang dan kredit
- Perencanaan keuangan dan pensiun
- Asuransi dan perlindungan finansial
- Bisnis dan kewirausahaan
- Pajak dan perencanaan pajak
- Banking dan produk finansial

PENTING:
- Jika user bertanya di luar topik keuangan, jawab dengan: "Maaf, saya hanya bisa membantu pertanyaan seputar keuangan."
- Jika ada percakapan sebelumnya, gunakan konteks tersebut untuk memberikan jawaban yang lebih personal dan relevan
- Berikan jawaban yang informatif, praktis, dan mudah dipahami dalam bahasa Indonesia
- Gunakan contoh konkret jika memungkinkan
- Jika user merujuk ke pertanyaan sebelumnya, pastikan Anda mengingat dan merespons dengan tepat`;

    // Build conversation context from history
    let conversationContext = '';
    if (conversationHistory && conversationHistory.length > 1) {
      // Get last 10 messages for context (excluding the current message)
      const recentHistory = conversationHistory
        .slice(-11, -1) // Get last 10 messages before current
        .map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
        .join('\n');
      
      conversationContext = `\n\nPercakapan sebelumnya:\n${recentHistory}\n\nPertanyaan user saat ini: ${message}`;
    } else {
      conversationContext = `\n\nPertanyaan user: ${message}`;
    }

    // Call Google Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }
    
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}${conversationContext}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!geminiResponse.ok) {
      console.error('Gemini API error:', geminiResponse.status, geminiResponse.statusText);
      throw new Error('Failed to get response from Gemini API');
    }

    const geminiData = await geminiResponse.json();
    
    if (!geminiData.candidates || geminiData.candidates.length === 0) {
      throw new Error('No response generated from Gemini API');
    }

    const generatedText = geminiData.candidates[0].content.parts[0].text;
    
    res.json({
      response: generatedText
    });
  } catch (error) {
    console.error('Error in chat handler:', error);
    
    res.status(500).json({
      response: "Maaf, terjadi kesalahan sistem. Silakan coba lagi dalam beberapa saat."
    });
  }
}
