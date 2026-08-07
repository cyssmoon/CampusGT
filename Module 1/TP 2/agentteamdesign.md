# Practical Assignment – Designing an AI Agent Team
**Student:** Luna Estanga

## 1) Agent Team: Medical Appointment Management

### Agent 1: The Orchestrator (System Brain)
* **Function:** Acts as the central core of the team. It receives global requests from users or the system, breaks the problem into subtasks, and delegates responsibilities to the appropriate agents.
* **Key Tasks:**
    * Coordinate execution flow and manage task dependencies.
    * Validate and consolidate autonomous responses from each specialized agent.
    * Maintain the global state of the application in real-time.

### Agent 2: Backend Logic and Database Engineer
* **Function:** Manage data architecture and ensure business rule consistency on the server.
* **Key Tasks:**
    * Design and structure database entities (Doctors, Patients, Specialties, Available Time Slots).
    * Process availability queries and execute atomic appointment locking to prevent duplication (two patients scheduled at the same time with the same doctor).

### Agent 3: User Experience and Interface Designer (UI/UX & Frontend)
* **Function:** Build the visual and interactive layer that patients and administrative health staff interact with.
* **Key Tasks:**
    * Design intuitive screens for the booking flow (Select Specialty → Doctor → Date/Time → Confirmation).
    * Ensure web accessibility and mobile adaptability (Responsive Design).

### Agent 4: Cybersecurity and Role Management Specialist
* **Function:** Protect confidential medical data (sensitive under data protection laws) and validate identities within the platform.
* **Key Tasks:**
    * Manage the authentication system and role-based access control (Patient, Doctor, Administrator).
    * Implement data transmission encryption layers and audit suspicious requests.

### Agent 5: Notifications and External Communication Manager
* **Function:** Automate contact channels with the patient to reduce medical appointment absenteeism.
* **Key Tasks:**
    * Generate and send digital receipts at the time of booking.
    * Trigger automated reminders (via Email or WhatsApp) 24 hours before the appointment and process direct cancellations.

## 2) Agent Functionality Flow

| Step | Origin/Destination | Action/Instruction |
| :--- | :--- | :--- |
| 1 | User (Orchestrator) | Patient requests a cardiology appointment for next Tuesday. |
| 2 | Orchestrator (Agent 4, Security) | Request autonomous verification of whether the user session is valid and active. |
| 3 | Orchestrator (Agent 2, Backend) | After validation, instructs to search and provisionally lock availability for the specialty. |
| 4 | Agent 3 (UI/UX), Orchestrator | Renders and displays appointment options on the user screen based on received data. |
| 5 | Orchestrator (Agent 5, Notifications) | Once the appointment is confirmed by the user, the Orchestrator collects results and indicates immediate reminder dispatch. |

## 3) Communication Protocol
The system uses a **Centralized Star Topology**. Peripheral agents (Backend, UI/UX, Security, Notifications) are independent and have no visibility of each other; all interaction must be mediated by the Orchestrator.

### A. Protocol and Messaging Model
* **Synchronous (Request-Response):** Used for critical steps (e.g., waiting for session validation or database locks).
* **Asynchronous (Fire-and-Forget):** Used for non-blocking tasks (e.g., sending emails after confirmation).

### B. Message Format (Data Structure)
Agents exchange structured messages (JSON). Each message contains:
1. **Control Metadata:** Unique transaction ID and flow status.
2. **Payload:** Specific data (patient info, doctor ID, date/time).
3. **Required Action:** The exact instruction to be executed.

### C. Advantages
* **Error Isolation:** If one agent fails, the Orchestrator logs the issue without crashing the entire flow.
* **Technological Decoupling:** Agents can use different tech stacks (JavaScript, SQL, etc.) as long as they understand the structured messages.
* **Auditability:** Centralized logs make it easy to detect errors or bottlenecks.

## 4) Extra Challenge: Automated Technical School Management

### Agent Team & Functions
1. **The Institutional Orchestrator (Director):** Intelligent core; coordinates trimester start/end, integrates performance/attendance reports, maintains real-time institution state.
2. **Schedule and Physical Space Manager (Logistics):** Optimizes the school schedule; manages assignments for teachers and subjects (Systems, Database, Programming), coordinates lab availability.
3. **Pedagogical and Grading Evaluator (Academic):** Monitors school performance; records TP/exam grades, calculates quarterly averages, alerts on high failure rates.
4. **Attendance Control and Proctoring (Student Welfare):** Manages daily attendance (Present, Absent, Tardy, Excused, Early Withdrawal), tracks accumulated absences to detect risk of "free" status.
5. **Institutional Communicator and Guardian Alerts:** Automates external contact; sends digital report cards, triggers automatic alerts (Email/SMS) to guardians regarding absences or early withdrawals.

### Workflow
| Step | Origin/Destination | Action/Instruction |
| :--- | :--- | :--- |
| 1 | Agent 2 (Logistics, Orchestrator) | At the start of the cycle, generates final class/lab grid for the central director. |
| 2 | Orchestrator (Agent 4, Attendance) | Validates schedule and transfers course structure to the attendance agent for daily logging. |
| 3 | Agent 4 (Attendance, Orchestrator) | During the trimester, if a student hits critical absences, autonomously notifies the Orchestrator. |
| 4 | Orchestrator (Agent 3, Academic) | Receives alert and requests immediate report from the academic agent with recent TP/exam grades for that student. |
| 5 | Orchestrator (Agent 5, Communicator) | Cross-references reports (attendance + performance) and instructs the communicator to dispatch a consolidated report to the guardian. |
