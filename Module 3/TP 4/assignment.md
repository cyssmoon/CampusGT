
---

# Backend Design Activity: From Frontend to Full-Stack

## 1. Brief Description of the Application

* **Description:** A mobile-first personal habit tracking web application designed to help users create, monitor, and maintain daily routines and goals.

## 2. Identified Entities and Features

* **Main Features:**
* User authentication and profile management.


* Habit creation, editing, and deletion.


* Daily tracking and completion logging.


* Progress visualization and streak counting.




* **Entities:**
* **User:** Stores account credentials and profile details.
* **Habit:** Represents a specific goal with frequency and target settings.
* **HabitLog:** Tracks individual daily completions for each habit.



## 3. Frontend vs. Backend Responsibilities

* **Frontend:**
* User interface layout, components, and responsive design.


* Visual state management (loading spinners, active tabs, modal toggles).


* Handling user interactions, form inputs, and client-side formatting.




* **Backend:**
* Execution of business logic and core rules.


* Secure data persistence and database operations.


* Critical data validations and authentication/authorization.





## 4. Proposed API Endpoints

* `GET /api/habits` - Retrieves all habits for the authenticated user.
* `POST /api/habits` - Creates a new habit entry.


* `PUT /api/habits/:id` - Updates an existing habit configuration.
* `DELETE /api/habits/:id` - Deletes a specific habit.
* `POST /api/habits/:id/logs` - Records a completion log for a specific date.

## 5. Chosen Architecture and Justification

* **Chosen Architecture:** Controller-Service-Repository Pattern (Layered Architecture).
* **Justification:** I chose this structure because each layer handles a distinct responsibility: the **Controller** manages HTTP requests and responses, the **Service** encapsulates the core business logic and rules, and the **Repository** handles direct database communication. This promotes clean separation of concerns, scalability, and easier maintainability.



## 6. Questioned AI Decision

* **AI Proposal:** The AI initially suggested handling data validation directly inside database triggers and skipping the service layer for simple CRUD operations to speed up development.
* **Critique & Decision:** I questioned this approach because handling validation solely at the database level makes error handling harder to communicate cleanly back to the frontend API responses. I decided to keep validations explicitly in the backend service layer to ensure robust application-level error handling, better testability, and framework independence.

## 7. Implemented Backend Feature

* **Feature:** The `POST /api/habits` endpoint along with its service logic and database repository method to create and persist a new habit.

## 8. Evidence of Functionality

* **Test Case / Validation:**
* *Request Body (`POST /api/habits`):* `{"title": "Read 20 pages", "frequency": "daily"}`
* *Response (`201 Created`):* `{"id": 1, "title": "Read 20 pages", "frequency": "daily", "createdAt": "2026-09-30"}`
* *(Placeholder for screenshot or terminal logs showing the server successfully processing the request and storing it in the database).*



---

¿Te gustaría que te ayude a formatearlo directamente en código HTML/CSS o necesitas que organicemos algún detalle técnico específico de tu código para este reporte?
