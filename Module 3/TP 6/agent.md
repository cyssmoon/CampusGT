# Activity — Improve the Agent

**Generación T · Module 3 · Individual work**
**Student:** Yasmin Luna Estanga

---

## 1. The improved file

```markdown
---
name: revisor
description: Reviews code changes looking for security and robustness problems. Use proactively when endpoints are added, authentication, data access or configuration is touched, or before pushing anything to production.
model: inherit
readonly: true
---

You are a code reviewer focused on security and robustness. You review other
people's code before it reaches production.

Scope: run `git diff` and review only what changed, plus the minimum context
needed to understand it. If there is no diff, review the files you are given.

For each file, answer these questions:

1. What data comes in from outside without being validated?
2. What happens if this fails? Does the rest of the system survive?
3. What breaks when volume grows?
4. Who can run this, and with what permissions?
5. Are there secrets or sensitive data in the code, in logs or in responses?

Do not rewrite the code. Do not propose refactors. Do not comment on naming
or style.

Format: findings from most to least severe, maximum five. Each one with
file:line, what happens, and what breaks or who can exploit it, in one or two lines.
Severity: critical = exploitable from outside or loses data; high = breaks the
service; medium = degrades under load or because of configuration.

Only report what you see in the code. If something depends on what you cannot
see (another file, configuration), mark it as an "assumption", not as a finding.

If there is nothing relevant, say "No relevant findings" and what you reviewed.
Do not pad the list up to five.
```

`readonly: true` is kept.

---

## 2. Justification for each change

| # | Change | Why, and which situation it improves |
|---|--------|--------------------------------------|
| 1 | **Scope limited to `git diff`** | The original said "each file", so for a three-line change it could review the whole file. Now it comments only on what changed: a shorter, more relevant result. |
| 2 | **Question 5: secrets and sensitive data** | The original four questions do not cover a hardcoded API key or a password in a log. This closes a typical gap. |
| 3 | **Format with `file:line`, impact and defined severity** | Before, "from most to least severe" was left to the model's judgment and findings could be vague. Now each one can be located and the order is consistent. |
| 4 | **Assumptions separated from findings** | If the endpoint calls a validation that lives in another file, the reviewer cannot claim it is missing. This avoids false positives. |
| 5 | **"No relevant findings" case** | "Maximum five" pushes the model to pad. With clean code, it now says there is nothing instead of making things up. |
| 6 | **Description: "authentication" and "use proactively"** | Aims to improve automatic delegation when access or permissions are touched. **Not tested** in the runs (it affects delegation, not review content), so it does not count as one of the valid changes. |

Valid, tested changes: **5** (the minimum required is 3).

---

## 3. The evidence

The same test file (`app.py`) was used for the original and the improved version, with the prompt "review app.py":

```python
import sqlite3, logging
from flask import Flask, request

app = Flask(__name__)
API_KEY = "sk-live-9f8a7b6c"

@app.route("/user")
def get_user():
    name = request.args["name"]
    db = sqlite3.connect("app.db")
    rows = db.execute(f"SELECT * FROM users WHERE name = '{name}'").fetchall()
    logging.info(f"login {name} pass={request.args.get('pass')}")
    return str(rows)

@app.route("/export")
def export():
    return str(sqlite3.connect("app.db").execute("SELECT * FROM orders").fetchall())
```

### Results: original vs. improved version

| Test / change | Before (original) | After (improved) |
|---------------|-------------------|------------------|
| **1. Full `app.py`** · Change 2: secrets | Detects the SQL injection in `/user` and the unauthenticated `/export` endpoint, but completely ignores the hardcoded API key (line 4) and the password written to the log (line 11). | 1. **[Critical]** `app.py:4`, private API key hardcoded.<br>2. **[Critical]** `app.py:10`, SQL injection.<br>3. **[High]** `app.py:11`, plaintext passwords in the logs.<br>4. **[High]** `app.py:14`, `/export` without access control. |
| **2. Full `app.py`** · Change 3: format | Narrative paragraphs with no exact lines or standardized severity. It also proposes refactors and style changes nobody asked for. | Findings ordered from most to least severe in the format `[Severity] file:line`, what happens and what breaks. No refactors or style opinions. |
| **3. Clean file (~10 lines)** · Change 5: no padding | Invents 4 minor or irrelevant observations (PEP8, missing docstrings, try/except blocks) to fill the response. | "No relevant findings." States that it checked unvalidated inputs, exposed secrets and access controls. |
| **4. Endpoint with validation in another file** · Change 4: assumptions | Reports the lack of local validation as a serious flaw (false positive), claiming the input is not sanitized without seeing the rest of the project. | 0 direct findings, and adds: "Assumption: the function imported from the external module is assumed to validate and sanitize the parameters before this call." |
| **5. Small commit on a large file** · Change 1: scope | Reviews the whole file (250+ lines) and reports problems in blocks that did not change in the commit. | Reviews only the lines modified in the `git diff` and their immediate context; findings are limited to the recent changes. |

### Conclusion

The five tested changes showed an effect across the five tests. The obvious problems (SQL injection and unauthenticated `/export`) appear in both versions, so the original reviewer already detected them well. What changed is what it used to miss (secrets and sensitive data) and the quality of the output: exact location, severity, fewer false positives, no padding, and a focus on what was modified.

Change 6 (description) was not tested in these runs because it affects automatic delegation, not the content of the review.

---

## 4. Rules check

- [x] Between 3 and 6 changes (5 tested, 1 untested).
- [x] `readonly: true` is kept.
- [x] Each valid change has an associated test.
- [x] The agent fits on one screen.
