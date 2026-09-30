

---

# Exercise — Analyze Before Asking

**Module 3 · Individual Assignment · Generación T**

**Student:** Yasmin Luna Estanga

## 1. Problems (Ordered from Most to Least Severe)

* **Problem 1 — Command Injection via `sqlcmd -Q**`
* Right now it works because nobody touches external inputs. As soon as ticket creation and editing forms are added, any value a user types (title, description) will end up concatenated into a query built as a string and executed via `execFile` through the SQL Server shell. A ticket title like `; DROP TABLE Tickets; --` breaks the database or leaks data. There is no sanitization or parameterization anywhere in the function.




* **Problem 2 — Implicit Trust Authentication (`-E`) and System Credentials**
* The `-E` flag uses the Windows session of the process running the backend. The day this is deployed on a Linux server, inside a Docker container, or simply on a teammate's PC without that domain user, the function stops working — not with a logic error, but with an infrastructure failure that nobody sees coming until deployment.




* **Problem 3 — Shell-out to `sqlcmd` Instead of Using a SQL Driver**
* With 5 tickets and 1 user, the latency of spinning up a child process for every `GET /tickets` is invisible. With multiple users hitting the endpoint simultaneously, each request opens a separate operating system process — no connection pooling, no concurrency limit. It is the difference between a function call and a `fork()` per request.





## 2. The Prompt

> "I have this TypeScript function that fetches tickets from SQL Server by executing `sqlcmd` as a subprocess with `-E` (integrated authentication) and builds the query using string literals. I need you to rewrite it to use a native Node SQL Server driver (e.g., `mssql` or `tedious`) with parameterized queries, without subprocesses or string concatenation. Keep the `queryTicketRows(): Promise<unknown[]>` signature and the behavior of returning `[]` if there are no rows. Do not change the `Tickets` table schema or add user/password authentication: use the same connection mechanism already assumed by `DB_SERVER` and `DB_DATABASE`, just migrated to the driver's connection format (host/database), without touching `-E`. Do not add ticket creation or editing handling yet, just the `SELECT`."
> 
> 

## 3. Prompt Justification

I give it the pre-diagnosed issue (subprocess + concatenation) so it doesn't "discover" the problem its own way and end up rewriting things I didn't ask for — for example, changing the entire authentication model. I lock down the function signature and the return contract (`[]` if empty) because the rest of the backend already consumes that and I don't want it to decide on a new interface. I explicitly forbid it from touching the schema and adding user/pass credentials because those are architectural decisions that do not belong to the AI — migrating integrated authentication is a separate issue that I decide, not a side effect of "improving" the code. And I limit the scope to the `SELECT` so it doesn't hand me an entire CRUD on the side that I haven't asked for yet.
