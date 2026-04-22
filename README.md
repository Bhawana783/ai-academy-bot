# AI Academy WhatsApp Bot

Basic demo WhatsApp chatbot backend using Whapi and an LLM to answer AI Academy course queries.

This repository intentionally implements only assignment-level functionality.

## Requirements
- Node.js 18+
- Whapi channel token
- OpenAI API key

## Setup
1. Install dependencies:

```bash
npm install
```

2. Create a .env file in project root:

```env
PORT=3000
WHAPI_TOKEN=your_whapi_token
OPENAI_API_KEY=your_openai_api_key
```

3. Run server:

```bash
npm start
```

If the selected port is already in use, the app automatically retries the next port (up to 10 times).

## Webhook
- Endpoint: /webhook
- Configure Whapi webhook URL to point to your deployed server, for example:
	https://your-domain.com/webhook

## Bot behavior
1. User must start with exact text: AI-Academy
2. Bot replies: Thank you for reaching out to the AI Academy! How can I help you today?
3. After activation, bot answers course-related questions using fixed context.
4. Bot includes enrollment guidance when user asks about pricing/access.
5. User can send STOP to unsubscribe.

## Notes
- No RAG is used; course details are directly injected into LLM context.
- Test with a single known number only.

## Known Limitations
1. In-memory active user tracking only (resets on restart).
2. No database, analytics, or admin panel.
3. No advanced retry queue, message templates, or delivery tracking.
4. LLM behavior depends on external model API availability and quality.

## Out Of Scope (Not Implemented)
1. Multi-tenant architecture
2. CRM integrations
3. Campaign/broadcast tooling
4. Production observability stack
5. Full test automation suite