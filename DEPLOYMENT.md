# Deployment Guide - FinanceAI

## Deploying to Vercel

### Prerequisites

1. **Gemini API Key**: Get your API key from [Google AI Studio](https://ai.google.dev/)

### Step-by-Step Deployment

1. **Connect to Vercel**
   - Fork or clone this repository
   - Import the project to Vercel
   - Connect your GitHub repository

2. **Configure Environment Variables**
   In your Vercel dashboard, go to your project settings and add the following environment variable:

   ```
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

3. **Deploy**
   - Vercel will automatically build and deploy your app
   - The build command is: `pnpm build`
   - The output directory is: `dist/spa`

### Project Structure for Vercel

```
├── api/                    # Vercel API functions
│   ├── chat.js            # Chat endpoint for Gemini AI
│   └── demo.js            # Demo endpoint
├── client/                # React frontend
├── vercel.json            # Vercel configuration
└── .env.example           # Environment variables template
```

### Features

- **Finance AI Chatbot**: AI assistant specifically for financial topics
- **Google Gemini Integration**: Powered by Google's Gemini AI model
- **Memory**: Conversations are remembered within sessions
- **Finance-focused**: Only responds to finance-related questions
- **Indonesian Language**: Optimized for Indonesian language support

### API Endpoints

- `GET /api/demo` - Health check endpoint
- `POST /api/chat` - Chat with FinanceAI

### Environment Variables

| Variable         | Description           | Required |
| ---------------- | --------------------- | -------- |
| `GEMINI_API_KEY` | Google Gemini API key | Yes      |
| `PING_MESSAGE`   | Custom ping message   | No       |

### Security

- API keys are properly secured through environment variables
- No hardcoded secrets in the codebase
- CORS is properly configured for API endpoints

### Troubleshooting

1. **Build errors**: Make sure all dependencies are properly installed
2. **API errors**: Verify your `GEMINI_API_KEY` is correctly set in Vercel environment variables
3. **Chat not working**: Check browser console for any API call errors

### Local Development

1. Copy `.env.example` to `.env`
2. Add your `GEMINI_API_KEY`
3. Run `pnpm dev`
