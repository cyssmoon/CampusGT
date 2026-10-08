# Mini Activity: Measure Your Reviewer

**Program:** Generación T — Module 3 (Individual Assignment)  
**Student:** Yasmin Luna Estanga  

---

## 1. Complete Measurement Results

**Accuracy Criterion:** The reviewer finds the expected issues and does not hallucinate findings. In healthy/clean files, "getting it right" means keeping quiet.

| # | File / Case | Expected Findings (Before Running) | 1st Run (Original Reviewer) | 2nd Run (Improved Reviewer) |
|---|---|---|---|---|
| **1** | `app.py` complete<br>*(with issues)* | All 4 issues: Hardcoded API key (l. 4), SQL injection (l. 10), Password in log (l. 11), `/export` without access control (l. 14). | **NO.** Found 2 of 4 (SQLi and `/export`). Ignored the API key and password in the log. | **YES.** Found all 4, categorized by severity: 2 Critical and 2 High. |
| **2** | `app.py` complete, formatting<br>*(with issues)* | Locatable findings (`file:line`), ordered by severity, without refactoring or style suggestions. | **NO.** Output paragraphs without exact line numbers or severity; proposed refactors and style changes. | **YES.** Format `[Severity] file:line`, ordered, no refactors. |
| **3** | Clean file (~10 lines)<br>*(healthy)* | "No relevant findings". | **NO.** Invented 4 minor observations (PEP 8, docstrings, try/except). | **YES.** Output "No relevant findings" and indicated what was reviewed. |
| **4** | Endpoint validated in another file<br>*(healthy, with assumption)* | 0 findings and an explicit "assumption" regarding external validation. | **NO.** False positive: claimed input was not sanitized without seeing the rest of the codebase. | **YES.** 0 findings and an explicit assumption stated. |
| **5** | Small commit on a large file<br>*(with localized issue)* | Only changes present in the `git diff`. | **NO.** Reviewed 250+ lines and reported blocks that were not modified. | **YES.** Only reviewed modified lines and their immediate context. |

* **First Run Accuracy:** **0 / 5**
* **Second Run Accuracy:** **5 / 5**

---

## 2. Changes Implemented & Justification

I updated the reviewer's definition file by making six simultaneous changes:
1. Restricted the review scope strictly to the `git diff`.
2. Added a 5th core question focused on hardcoded secrets and sensitive data.
3. Defined a standardized output format (`file:line` with severity levels).
4. Separated unverified "assumptions" from confirmed findings.
5. Added explicit instructions for the empty case ("No relevant findings").
6. Adjusted the sub-agent description.

**Why:** The original reviewer missed sensitive data leaks, generated unnecessary filler findings on clean files, and asserted facts about external code context that it couldn't observe.

---

## 3. Results Analysis

The score increased from **0/5** to **5/5**. 

The most significant improvements occurred in **Case 3** (stopped inventing findings in clean files) and **Case 4** (eliminated false positives regarding external dependencies), which directly measure whether the reviewer knows when to remain silent. 

In **Case 1**, while the original version caught the most obvious flaws (SQL injection and unprotected `/export`), the improved version successfully identified the hardcoded API key and password exposure in logs.

---

## 4. Measurement Limitations

* **Multiple Variables Changed:** The instructions suggested changing a single line; however, six changes were applied simultaneously, making it impossible to isolate the exact impact of each individual adjustment. (Note: Change #6 regarding description tuning affects automatic delegation rather than review quality).
* **Strict Scoring:** The initial score of $0/5$ uses a binary pass/fail rule. If partial credit were awarded for Cases 1 and 2, the original score would be closer to $1/5$.
* **Overfitted Test Set:** Cases 1 and 2 shared the same file (`app.py`), and test cases were designed around the specific improvements made, favoring the updated version. A necessary next step is repeating this measurement on real-world repositories (e.g., HabitFlow), including additional clean files.
