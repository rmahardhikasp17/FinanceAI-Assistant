import { RequestHandler } from "express";

export interface ChatRequest {
  message: string;
  sessionId?: string;
  conversationHistory?: Array<{
    id: string;
    text: string;
    sender: "user" | "bot";
    timestamp: Date;
  }>;
}

export interface ChatResponse {
  response: string;
}

// Finance-related keywords for filtering
const financeKeywords = [
  "keuangan",
  "uang",
  "dana",
  "investasi",
  "saham",
  "obligasi",
  "reksadana",
  "menabung",
  "tabungan",
  "deposito",
  "kredit",
  "hutang",
  "cicilan",
  "bunga",
  "anggaran",
  "budget",
  "budgeting",
  "pengeluaran",
  "pemasukan",
  "gaji",
  "bisnis",
  "usaha",
  "profit",
  "keuntungan",
  "modal",
  "finansial",
  "ekonomi",
  "pajak",
  "asuransi",
  "pensiun",
  "dana darurat",
  "cash flow",
  "properti",
  "emas",
  "cryptocurrency",
  "crypto",
  "bitcoin",
  "trading",
  "forex",
  "bank",
  "atm",
  "kartu kredit",
  "pinjaman",
  "mortgage",
  "kpr",
  "financial",
  "money",
  "finance",
  "saving",
  "investment",
  "budget",
  "debt",
  "credit",
  "loan",
  "insurance",
  "retirement",
  "pension",
];

// Check if the message is finance-related
function isFinanceRelated(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return financeKeywords.some((keyword) =>
    lowerMessage.includes(keyword.toLowerCase()),
  );
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

export const handleChat: RequestHandler = async (req, res) => {
  try {
    const { message, sessionId, conversationHistory } = req.body as ChatRequest;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    // Check if message is finance-related
    if (!isFinanceRelated(message)) {
      const response: ChatResponse = {
        response: "Maaf, saya hanya bisa membantu pertanyaan seputar keuangan.",
      };
      return res.json(response);
    }

    // Build conversation context from history
    let conversationContext = "";
    if (conversationHistory && conversationHistory.length > 1) {
      // Get last 10 messages for context (excluding the current message)
      const recentHistory = conversationHistory
        .slice(-11, -1) // Get last 10 messages before current
        .map(
          (msg) =>
            `${msg.sender === "user" ? "User" : "Assistant"}: ${msg.text}`,
        )
        .join("\n");

      conversationContext = `\n\nPercakapan sebelumnya:\n${recentHistory}\n\nPertanyaan user saat ini: ${message}`;
    } else {
      conversationContext = `\n\nPertanyaan user: ${message}`;
    }

    // Call Google Gemini API
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY not configured");
    }

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemPrompt}${conversationContext}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
      },
    );

    if (!geminiResponse.ok) {
      console.error(
        "Gemini API error:",
        geminiResponse.status,
        geminiResponse.statusText,
      );
      throw new Error("Failed to get response from Gemini API");
    }

    const geminiData = await geminiResponse.json();

    if (!geminiData.candidates || geminiData.candidates.length === 0) {
      throw new Error("No response generated from Gemini API");
    }

    const generatedText = geminiData.candidates[0].content.parts[0].text;

    const response: ChatResponse = {
      response: generatedText,
    };

    res.json(response);
  } catch (error) {
    console.error("Error in chat handler:", error);

    const errorResponse: ChatResponse = {
      response:
        "Maaf, terjadi kesalahan sistem. Silakan coba lagi dalam beberapa saat.",
    };

    res.status(500).json(errorResponse);
  }
};
