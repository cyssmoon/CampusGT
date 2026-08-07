# Practical Assignment: AI Process Design
## Topic: Virtual Professor for Students
**Assignment:** AI Automation for an online academy — complete process design.
**Selected Case:** Case 2
**Author:** Yasmin Luna Estanga

---

## 1. Selected Case and Justification
Case 2: Virtual Professor for Students was chosen because it represents a real and scalable problem in online education: thousands of students generate simultaneous queries that no teaching staff can handle instantly. It is a case where AI adds clear value (speed, 24/7 availability) without replacing the human figure, but rather complementing it.

## 2. Problem to Solve
* **Current Situation:** An online academy receives hundreds of daily queries: questions about contents, dates, exercises, registrations, and technical support. Teachers cannot keep up, and students wait hours or days for a response.
* **Consequences:** High dropout rate, teachers overloaded with repetitive questions, and inconsistent answers depending on who answers and at what time. The quality of care depends on the shift of the day.

## 3. Flowchart
1. **Student sends query:** Chat / email / forum / WhatsApp.
2. **Platform receives the query:** Registers message and metadata (student, course, module, history).
3. **AI classifies the query:** Identifies topic and urgency.
4. **Decision:** If standard, AI answers automatically. If complex, escalate to human teacher.
5. **Feedback:** Successful interactions enrich the knowledge base for future use.

## 4. Tools and Services
* **Input Channels:** Slack, Discord, WhatsApp API, Email (IMAP), Proprietary web chat.
* **AI & Processing:** Claude (Anthropic), GPT-4o, RAG (Pinecone Vector DB).
* **Knowledge Base:** Notion, Confluence, Course PDFs.
* **Orchestration:** Make/n8n, Zapier, SendGrid.

## 5. Step-by-Step Explanation
1. Student submits inquiry.
2. System records metadata.
3. AI classifies the query.
4. AI retrieves info from RAG and responds.
5. If complex, AI summarizes context and alerts teacher.
6. System learns from teacher resolution.
7. Management receives weekly performance reports.

## 6. Expected Benefits
* **Immediate 24/7 Response:** Instant help regardless of time.
* **Empowered Teachers:** Focus on pedagogical complexity, not repetitive tasks.
* **Scalability:** Effortlessly handles simultaneous queries.
* **Actionable Metrics:** Data-driven insights to improve course content.

## 7. Possible Future Improvements
* Sentiment analysis for proactive dropout prevention.
* Personalized tutor mode adapting to individual learning styles.
* Direct integration with LMS (Moodle, Canvas).
* Automatic generation of customized practice exercises.
