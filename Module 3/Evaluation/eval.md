
# Quiz: Web Development & AI Agents

### Question 1 of 10
When tickets live inside a `useState` on the frontend, they are lost upon refreshing the page because they only exist in the browser's memory.

- [x] **True**
- [ ] False

---

### Question 2 of 10
When replacing local state data with a backend API call, `isLoading` and `error` states appeared. Why?

- [ ] Because React requires it when using `fetch`.
- [x] **Because data now takes time to arrive, leading to three possible outcomes: pending/waiting, success, or failure.**
- [ ] Because the backend returns those specific fields inside the JSON response.
- [ ] Because TypeScript does not allow an uninitialized state.

---

### Question 3 of 10
The frontend runs on one port and the backend on another. The first time the frontend requests data, a CORS error appears. Who blocks the response?

- [ ] The backend, which rejects the incoming request.
- [ ] The operating system.
- [x] **The browser, enforced by a security rule.**
- [ ] The frontend framework.

---

### Question 4 of 10
A date that is of type `Date` in the backend arrives at the frontend as a string because JSON does not natively support a Date data type. TypeScript does not warn about this because it checks static code, not runtime data arriving over the network.

- [x] **True**
- [ ] False

---

### Question 5 of 10
The controller already validates that the title is not empty. Why is it good practice for the service layer to also validate it?

- [ ] In case the controller has a bug.
- [x] **Because the service does not know who is invoking it: tomorrow it could be called by another endpoint, a background script, or a test suite.**
- [ ] Because it is a strict convention in layered architectures.
- [ ] It is not recommended: it is duplicate code and should be removed.

---

### Question 6 of 10
If a refactor is done correctly, the output of the program must change, as that is the proof that the change was applied.

- [ ] True
- [x] **False** *(Refactoring alters internal structure without changing external behavior).*

---

### Question 7 of 10
An urgent ticket is assigned at 10:30 AM and the assigned person needs to be notified immediately. What type of automation is appropriate?

- [ ] Time-based (Scheduled/Cron): a job that runs every day at 8:00 AM.
- [x] **Event-based (Trigger): fired immediately when the ticket is assigned.**
- [ ] Either one: they achieve the same result.
- [ ] None: this must be handled manually by a person.

---

### Question 8 of 10
What is a "tool" in the context of an AI agent?

- [ ] An external standalone application executed independently by the model.
- [x] **A custom function that the model can request execution for, which then runs our underlying code.**
- [ ] A permission flag granting the model full internet access.
- [ ] A library installed alongside the AI model.

---

### Question 9 of 10
Subagents communicate directly with each other: when one finishes, it passes its output directly to the next subagent.

- [ ] True
- [x] **False** *(Subagents report back to the main/orchestrator agent, which coordinates execution).*

---

### Question 10 of 10
What is the difference between writing "do not rewrite the code" in the agent's prompt body vs. setting `readonly: true` in the frontmatter?

- [ ] None: both approaches work identically.
- [ ] The frontmatter setting is faster to type.
- [x] **Prompt instructions can be ignored or bypassed by the model; `readonly: true` is an enforced tool-level constraint that physically prevents file modifications.**
- [ ] `readonly` only works with specific models.
