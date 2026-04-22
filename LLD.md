# LLD: AI Academy WhatsApp Bot

## 1. Objective
Build a WhatsApp chatbot with Whapi + LLM that:
1. Understands user queries
2. Responds using LLM-based answers
3. Provides AI Academy course information
4. Guides users to enrollment

Design intent: baseline assignment compliance, not production-hardening.

## 2. High-Level Design

User (WhatsApp)
  -> Whapi webhook event
  -> Node.js Express endpoint (/webhook)
  -> LLM service with fixed course context
  -> Whapi outbound message API
  -> User receives response

## 3. Components
1. App Server (src/app.js)
- Express app
- JSON parsing
- Webhook route registration

2. Webhook Handler (src/routes/webhook.js)
- Reads inbound message payload
- Entry code gate: AI-Academy
- Session activation per user number (in-memory)
- STOP command handling
- Sends outbound WhatsApp message via Whapi

3. LLM Service (src/services/llmService.js)
- Sends user query + fixed context to LLM
- Restricts answer scope to provided course context
- Includes enrollment link when needed

4. Context Provider (src/utils/courseContext.js)
- Contains fixed course details (modules, pricing, certificate)

## 4. Sequence Flow
1. User sends AI-Academy
2. Webhook receives message and activates user session
3. Bot responds with required greeting
4. User sends course question
5. Backend forwards question + context to LLM
6. LLM returns contextual answer
7. Backend sends answer via Whapi

## 5. Input/Output Rules
1. Entry point text must be exact AI-Academy.
2. If user is not activated, bot asks for entry code.
3. STOP unsubscribes the user from further bot replies.
4. Out-of-context questions are declined with a course-only response.

## 6. Configuration
Environment variables:
- PORT
- WHAPI_TOKEN
- OPENAI_API_KEY

## 7. Ban-Risk Reduction Plan (How to not get banned)
This implementation and operations follow anti-ban practices:

1. User-initiated conversations only
- Bot responds only when users send messages first.
- Entry code AI-Academy enforces explicit user opt-in.

2. No bulk messaging
- No broadcast or campaign logic in code.
- Test only with one known number.

3. Easy opt-out
- Every response appends STOP instruction.
- STOP immediately disables that user session.

4. Progressive and low-volume usage
- For production operations, start with low send rates (about 1-2 messages/minute) and avoid continuous all-day sending.
- Do not message new/unfamiliar contacts in bulk.

5. Better response ratio
- Bot asks for user interaction naturally in chat flow.
- Focus on helpful, relevant replies to reduce block reports.

6. Message quality controls
- Avoid suspicious repetitive blasts and unsolicited links.
- Only send one relevant enrollment link when asked about paid access/pricing.

7. Number warm-up
- Use an aged or warmed-up WhatsApp number before API connection.
- Avoid scanning QR immediately after creating a brand-new number.

## 8. Limitations
1. In-memory sessions reset on server restart.
2. No database persistence.
3. Single webhook endpoint for demo scope.
4. No automated tests are included in this demo.
5. No advanced monitoring, metrics, or alerting.

## 9. Out Of Scope
1. Broadcast and campaign engine
2. Multi-agent orchestration
3. RAG pipeline and vector database
4. Role-based dashboard and backoffice workflows
5. Horizontal scaling and high-availability design
