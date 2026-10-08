# Mini Activity: Measure Your Reviewer — Results

**Student:** Yasmin Luna Estanga  
**Course:** Generación T — Module 3 (Individual Assignment)

---

## 1. Complete Table Across Both Runs

> **Accuracy Criterion:** The reviewer finds the expected issues and does not fabricate false positives. For clean files, "getting it right" means keeping quiet.

| # | File / Case | Expected Findings (Before Running) | 1st Run (Original Reviewer) | 2nd Run (Improved Reviewer) |
|---|---|---|---|---|
| **1** | `app.py` (complete, with issues) | All 4 issues: Hardcoded API key (l. 4), SQL injection (l. 10), Password logged (l. 11), `/export` endpoint without access control (l. 14). | **NO.** Found 2 of 4 (SQLi and `/export`). Ignored the API key and logged password. | **YES.** All 4 found with severity levels: 2 Critical, 2 High. |
| **2** | `app.py` (formatting check, with issues) | Findings with explicit locations (`file:line`), sorted by severity, with no refactoring or code style opinions. | **NO.** Paragraph format without exact lines or severity; suggested refactors and style changes. | **YES.** `[Severity] file:line`, properly ordered, no refactors suggested. |
| **3** | Clean file (~10 lines) (clean) | "No relevant findings." | **NO.** Invented 4 minor observations (PEP8, docstrings, try/except). | **YES.** "No relevant findings" and stated what was checked. |
| **4** | Endpoint with validation in external file (clean, with assumption) | 0 findings and an explicit "assumption" regarding external validation. | **NO.** False positive: claimed input was un-sanitized without seeing external files. | **YES.** 0 findings with an explicit stated assumption. |
| **5** | Small commit on large file (with localized issue) | Only report changes within the `git diff`. | **NO.** Reviewed 250+ lines and reported unchanged blocks. | **YES.** Focused strictly on modified lines and immediate context. |

* **Original Reviewer Score:** **0 / 5**[cite: 5]
* **Improved Reviewer Score:** **5 / 5**[cite: 5]

---

## 2. Changes Made & Justification

I improved the reviewer definition file by doing the following:
* Constrained scope strictly to the `git diff`.
* Added a 5th question specifically covering hardcoded secrets and sensitive data.
* Enforced the output format: `file:line` accompanied by a severity rating.
* Separated "assumptions" from confirmed findings.
* Added an explicit fallback output for clean code: `"No relevant findings"`.
* Refined the system description.

**Reasoning:** The original prompt missed hardcoded sensitive data, generated filler observations on clean files, and made definitive claims about unexposed code context[cite: 5].

---

## 3. Results Analysis

The overall score improved from **0/5 to 5/5**[cite: 6]. 

The most noticeable improvements occurred in:
* **Case 3:** Stopped inventing noise/cosmetic complaints on clean files[cite: 6].
* **Case 4:** Prevented false positives by properly
