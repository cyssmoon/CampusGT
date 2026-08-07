# Practical Assignment · Class 14 · AI Process Design

## Virtual Professor for Students

AI Automation for an online academy — complete process design.
**Selected Case 2 · Done by Yasmin Luna Estanga**

---

## 1. Selected Case and Justification

* **Case Chosen:** Case 2: Virtual Professor for Students.


* **Justification:** This case was selected because it addresses a real, highly scalable challenge in online education: thousands of students generate simultaneous queries that a teaching staff cannot possibly handle instantly. It represents a scenario where AI delivers clear, immediate value—such as 24/7 availability and speed—while acting as a complement to, rather than a replacement for, human instructors.



---

## 2. Problem to Solve

* **Current Situation:** An online academy receives hundreds of daily queries concerning course contents, calendar dates, assignment instructions, administrative registrations, and technical support. Instructors quickly fall behind, leaving students waiting hours or even days for a reply.


* **Consequences:** This friction results in high dropout rates, instructors overwhelmed by repetitive tasks, and inconsistent answers depending on who answers and when. Ultimately, service quality fluctuates wildly based on the working shift.



---

## 3. Flowchart

(The process follows an automated sequence from student input to resolution):

> **Student sends query** $\rightarrow$ **Platform receives and records message metadata** $\rightarrow$ **AI classifies query** $\rightarrow$ **Decision: Can AI answer directly?**
> * **If Yes:** AI provides automated response $\rightarrow$ **Decision: Is student satisfied?**
> * *If Yes:* Case closed successfully.
> * *If No:* Escalated to a human teacher.
> 
> 
> * **If No (Complex query):** Human teacher intervenes $\rightarrow$ Receives alert + AI-generated context $\rightarrow$ Teacher records response $\rightarrow$ Enriches knowledge base $\rightarrow$ End of process.
> 
> 

---

## 4. Tools and Services

* **Input Channels:** Slack, Discord, WhatsApp API, Email (IMAP), and the academy's proprietary web chat interface.


* **Generative AI & Processing:** Claude (Anthropic), GPT-4o, and Retrieval-Augmented Generation (RAG) over a vector database.


* **Knowledge Base:** Notion, Confluence, Pinecone (Vector DB), and course PDF materials.


* **Orchestration & Alerts:** Make, n8n, Zapier, and SendGrid for email notifications.



---

## 5. Step-by-Step Explanation

1. **Query Submission:** The student submits a question through an available channel such as the virtual classroom chat, email, or a messaging bot.


2. **Metadata Capture:** The system captures the message along with relevant metadata, including student ID, active course, current module, and historical query logs.


3. **Classification:** The AI analyzes and categorizes the request, determining whether it relates to course content, a technical glitch, administrative policy, or a complaint.


4. **Automated Resolution:** For standard questions, the AI cross-references the knowledge base (syllabi, FAQs, previous lecture notes) to generate a personalized, contextual answer.


5. **Human Escalation:** If a query requires advanced pedagogical judgment or if the student indicates dissatisfaction, the AI compiles a context summary and prioritizes an alert for the designated instructor.


6. **Continuous Learning:** The system logs interactions and incorporates teacher-reviewed resolutions back into the knowledge base so the AI continuously improves.


7. **Reporting:** Management receives weekly analytical metrics covering resolution times, automatic closure rates, trending topics, and student satisfaction scores.



---

## 6. Expected Benefits

* **24/7 Availability:** Students receive instant help within seconds, regardless of the time of day.


* **Empowered Instructors:** Teachers are freed from repetitive administrative queries, allowing them to focus entirely on complex academic guidance.


* **Operational Consistency:** Every student receives uniform, accurate information regardless of time zones or shift changes.


* **Seamless Scalability:** The system effortlessly handles anywhere from 10 to 10,000 simultaneous inquiries without incurring extra personnel costs.


* **Living Knowledge Base:** System accuracy increases over time as every resolved case sharpens future automated responses.


* **Actionable Insights:** The academy gains visibility into common student hurdles, providing data to refine course design.



---

## 7. Future Possible Improvements

* **Sentiment Analysis:** Integrating emotional tone detection to flag student frustration or early signs of dropout, triggering proactive teacher intervention.


* **Personalized Tutor Adaptation:** Configuring the AI to track individual learning speeds and preferred styles to customize explanations dynamically.


* **LMS Integration:** Connecting directly with platforms like Moodle or Canvas to check real-time student progress while crafting answers.


* **Dynamic Exercise Generation:** Automatically producing customized practice tasks targeting weaknesses detected during weekly queries.


* **Instructor Control Panel:** Adding visual heat maps that display query density by module, student, and time block.


* **Multi-Language Support:** Expanding language modules to seamlessly support international cohorts.
