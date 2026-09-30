
---

# Code Analysis Exercise: Backend SQL Server Query Refactoring

## 1. Three Problems (Ordered from Most Severe to Least Severe)

* **Problem 1 (Most Severe): Spawning CLI Processes (`execFile` with `sqlcmd`) per Request**
* **Concrete Scenario:** Right now, there is only one user and 5 tickets, so spawning an external system process (`sqlcmd`) for every single `GET /tickets` request works fine. However, if the system scales to dozens or hundreds of concurrent users fetching tickets simultaneously, the Node.js event loop will be choked by spawning hundreds of heavy operating-system subprocesses. This will cause severe CPU spikes, thread pool exhaustion, memory overhead, and high request latency.




* **Problem 2: Fragile Text-Based Parsing of CLI `stdout**`
* **Concrete Scenario:** The function relies on capturing standard output (`stdout`) from a command-line tool and parsing it with `JSON.parse(jsonText)`. If a user creates or edits a ticket containing specific special characters, quotes, or line breaks that interfere with the `sqlcmd` formatting or command-line argument passing, the string output will be malformed. This will cause `JSON.parse` to throw an unhandled syntax exception, crashing the endpoint entirely.




* **Problem 3 (Least Severe): Hardcoded Buffer and Column Width Limits**
* **Concrete Scenario:** The code uses hardcoded constants (`SQL_COMMAND_MAXIMUM_COLUMN_WIDTH = 8000` and `maxBuffer = 10 * 1024 * 1024`). As the application evolves to allow users to create and edit tickets with long descriptions, attachments, or rich text logs, historical data will grow. The moment the total JSON payload exceeds 10 MB or a text column exceeds 8000 characters, `execFile` will throw a `maxBuffer exceeded` error or silently truncate the data, returning corrupted or incomplete ticket lists to the frontend.





---

## 2. The Prompt for the AI

> "Refactor the `queryTicketRows` function in our Node.js backend which currently uses `child_process.execFile` and `sqlcmd` to fetch tickets from SQL Server.
> 
> 
> Please follow these strict guidelines:
> 1. Replace the external `sqlcmd` CLI execution approach with a reliable, production-ready database client library (such as the official `mssql` package with connection pooling) to handle concurrent requests efficiently.
> 2. Preserve the exact asynchronous function signature `export async function queryTicketRows(): Promise<unknown[]>` and keep the existing environment variable checks (`DB_SERVER`, `DB_DATABASE`) intact so that dependent controller layers do not break.
> 3. Do NOT use shell execution or command-line wrappers. Implement proper connection management and native driver queries.
> 4. Handle database errors cleanly by throwing descriptive errors rather than parsing raw CLI standard output strings."
> 
> 

---

## 3. Prompt Justification

* **Why it was written this way:** Instead of using a vague request like "improve this code," the prompt targets the structural root cause: the use of a CLI wrapper (`sqlcmd`) instead of a native database driver.


* **Context provided:** It defines the exact current function signature (`queryTicketRows(): Promise<unknown[]>`), the underlying technology stack (Node.js, SQL Server), and environment variables (`DB_SERVER`, `DB_DATABASE`).


* **Boundaries and limits set:** It explicitly commands the AI *not* to use shell execution and mandates a specific solution (connection pooling via a proper database client).
* **Human decisions:** We decided to lock down the function signature and environment variable validation. This ensures that while the internal implementation changes from a hacky CLI spawn to a proper database connection pool, the rest of the backend application remains completely decoupled and unaffected.
